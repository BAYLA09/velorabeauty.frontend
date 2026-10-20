"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { REDIRECTKILLER_CSRF_HEADER } from "@/lib/redirectkiller/constants";

type RedirectRow = {
  id: string;
  slug: string;
  destinationPath: string;
  enabled: boolean;
  publicUrl: string;
  updatedAt: string;
};

type Preset = { label: string; path: string };

function readCsrf(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("rk_csrf="));
  return match ? decodeURIComponent(match.slice("rk_csrf=".length)) : "";
}

function apiHeaders(): HeadersInit {
  const csrf = readCsrf();
  return csrf
    ? { "Content-Type": "application/json", [REDIRECTKILLER_CSRF_HEADER]: csrf }
    : { "Content-Type": "application/json" };
}

function formatApiError(code: string | undefined): string {
  switch (code) {
    case "invalid_slug":
      return "Invalid slug — use lowercase letters, numbers, and hyphens only.";
    case "slug_exists":
      return "That ad slug is already in use.";
    case "redirect_loop":
      return "Destination cannot point back to the same /ads/ link.";
    case "not_allowed":
      return "That landing path is not allowed.";
    case "invalid_path":
      return "Invalid landing path — must start with /.";
    default:
      return code ?? "Something went wrong.";
  }
}

function resolveDestination(
  presetValue: string,
  customValue: string,
  presets: Preset[],
): string {
  const custom = customValue.trim();
  if (custom) return custom;
  return presetValue;
}

type DestinationFieldsProps = {
  presets: Preset[];
  destOptions: string[];
  presetValue: string;
  customValue: string;
  onPresetChange: (path: string) => void;
  onCustomChange: (path: string) => void;
  idPrefix: string;
};

function DestinationFields({
  presets,
  destOptions,
  presetValue,
  customValue,
  onPresetChange,
  onCustomChange,
  idPrefix,
}: DestinationFieldsProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs text-slate-400" htmlFor={`${idPrefix}-preset`}>
        Landing page (where the visitor ends up)
        <select
          id={`${idPrefix}-preset`}
          value={customValue.trim() ? "" : presetValue}
          onChange={(e) => {
            onPresetChange(e.target.value);
            onCustomChange("");
          }}
          disabled={Boolean(customValue.trim())}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm disabled:opacity-50"
        >
          {presets.map((p) => (
            <option key={p.path} value={p.path}>
              {p.label} — {p.path}
            </option>
          ))}
          {destOptions
            .filter((p) => !presets.some((pr) => pr.path === p))
            .map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
        </select>
      </label>
      <label className="block text-xs text-slate-400" htmlFor={`${idPrefix}-custom`}>
        Or custom internal path
        <input
          id={`${idPrefix}-custom`}
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="/lp/snap/hair-gummies"
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}

export function RedirectKillerDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [redirects, setRedirects] = useState<RedirectRow[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [filterQ, setFilterQ] = useState("");
  const [filterEnabled, setFilterEnabled] = useState<"all" | "yes" | "no">("all");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [newDest, setNewDest] = useState("/lp/snap/hair-gummies");
  const [newCustomDest, setNewCustomDest] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editSlug, setEditSlug] = useState("");
  const [editDest, setEditDest] = useState("");
  const [editCustomDest, setEditCustomDest] = useState("");

  const loadSession = useCallback(async () => {
    const res = await fetch("/api/redirectkiller/auth/session", { credentials: "include" });
    if (res.status === 503) {
      setConfigError("Redirect Killer is not configured on the server.");
      setAuthenticated(false);
      return;
    }
    const data = (await res.json()) as { authenticated?: boolean; destinations?: string[] };
    setAuthenticated(Boolean(data.authenticated));
  }, []);

  const loadRedirects = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterQ.trim()) params.set("q", filterQ.trim());
    if (filterEnabled !== "all") params.set("enabled", filterEnabled);
    const res = await fetch(`/api/redirectkiller/redirects?${params}`, { credentials: "include" });
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    const data = (await res.json()) as {
      ok?: boolean;
      redirects?: RedirectRow[];
      presets?: Preset[];
    };
    if (data.redirects) setRedirects(data.redirects);
    if (data.presets) setPresets(data.presets);
  }, [filterQ, filterEnabled]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (authenticated) void loadRedirects();
  }, [authenticated, loadRedirects]);

  const destOptions = useMemo(() => {
    const paths = new Set(presets.map((p) => p.path));
    redirects.forEach((r) => paths.add(r.destinationPath));
    return [...paths].sort();
  }, [presets, redirects]);

  const newPreview = useMemo(() => {
    const slug = newSlug.trim().toLowerCase() || "your-slug";
    const dest =
      resolveDestination(newDest, newCustomDest, presets) || "/landing-page";
    return { slug, dest };
  }, [newSlug, newDest, newCustomDest, presets]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/redirectkiller/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok) {
        setLoginError(data.message ?? data.error ?? "Login failed");
        return;
      }
      setPassword("");
      setAuthenticated(true);
      await loadRedirects();
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch("/api/redirectkiller/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: apiHeaders(),
      });
      setAuthenticated(false);
      setRedirects([]);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    const destinationPath = resolveDestination(newDest, newCustomDest, presets);
    setBusy(true);
    try {
      const res = await fetch("/api/redirectkiller/redirects", {
        method: "POST",
        credentials: "include",
        headers: apiHeaders(),
        body: JSON.stringify({ slug: newSlug, destinationPath, enabled: true }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatusMsg(formatApiError(data.error));
        return;
      }
      setNewSlug("");
      setNewCustomDest("");
      setStatusMsg("Redirect created.");
      await loadRedirects();
    } finally {
      setBusy(false);
    }
  }

  function startEdit(row: RedirectRow) {
    setEditId(row.id);
    setEditSlug(row.slug);
    const isPreset = presets.some((p) => p.path === row.destinationPath);
    if (isPreset || destOptions.includes(row.destinationPath)) {
      setEditDest(row.destinationPath);
      setEditCustomDest("");
    } else {
      setEditDest(presets[0]?.path ?? "/lp/snap/hair-gummies");
      setEditCustomDest(row.destinationPath);
    }
  }

  async function saveEdit(row: RedirectRow) {
    setStatusMsg(null);
    const destinationPath = resolveDestination(editDest, editCustomDest, presets);
    setBusy(true);
    try {
      const res = await fetch(`/api/redirectkiller/redirects/${row.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: apiHeaders(),
        body: JSON.stringify({ slug: editSlug, destinationPath }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatusMsg(formatApiError(data.error));
        return;
      }
      setEditId(null);
      setStatusMsg("Redirect updated.");
      await loadRedirects();
    } finally {
      setBusy(false);
    }
  }

  async function toggleEnabled(row: RedirectRow) {
    setBusy(true);
    try {
      await fetch(`/api/redirectkiller/redirects/${row.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: apiHeaders(),
        body: JSON.stringify({ enabled: !row.enabled }),
      });
      await loadRedirects();
    } finally {
      setBusy(false);
    }
  }

  async function deleteRow(row: RedirectRow) {
    if (!window.confirm(`Delete redirect “${row.slug}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await fetch(`/api/redirectkiller/redirects/${row.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: apiHeaders(),
      });
      setStatusMsg("Redirect deleted.");
      await loadRedirects();
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setStatusMsg("Public URL copied.");
    } catch {
      setStatusMsg("Could not copy — select the URL manually.");
    }
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-200">
        <div className="max-w-md rounded-xl border border-amber-500/40 bg-slate-900 p-6">
          <h1 className="text-lg font-semibold text-amber-200">Configuration required</h1>
          <p className="mt-2 text-sm text-slate-300">{configError}</p>
          <p className="mt-4 text-xs text-slate-400">
            Set REDIRECTKILLER_ADMIN_PASSWORD and REDIRECTKILLER_SESSION_SECRET in Easypanel, then
            redeploy.
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
        >
          <h1 className="text-xl font-semibold text-white">Redirect Killer</h1>
          <p className="mt-1 text-sm text-slate-400">Velora Beauty — ad link manager</p>
          <label className="mt-6 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
              required
            />
          </label>
          {loginError ? <p className="mt-3 text-sm text-red-400">{loginError}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-white">Redirect Killer</h1>
            <p className="text-xs text-slate-400">
              Ad link <span className="font-mono text-slate-300">/ads/…</span> → landing page on
              your site
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={busy}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm hover:bg-slate-800"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8">
        {statusMsg ? (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-200">
            {statusMsg}
          </p>
        ) : null}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-base font-semibold">Create redirect</h2>
          <p className="mt-1 text-xs text-slate-500">
            Pick the landing page first, then the short ad slug you will paste in Snapchat / Meta.
          </p>
          <form onSubmit={handleCreate} className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <DestinationFields
                idPrefix="create"
                presets={presets}
                destOptions={destOptions}
                presetValue={newDest}
                customValue={newCustomDest}
                onPresetChange={setNewDest}
                onCustomChange={setNewCustomDest}
              />
            </div>

            <label className="block text-xs text-slate-400 md:col-span-2">
              Ad link slug (public URL — what you put in the ad)
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-slate-500">/ads/</span>
                <input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="hair-ad"
                  pattern="[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?"
                  className="min-w-[12rem] flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm"
                  required
                />
              </div>
            </label>

            <p className="md:col-span-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 font-mono text-xs text-slate-400">
              <span className="text-emerald-400/90">/ads/{newPreview.slug}</span>
              <span className="mx-2 text-slate-600">→</span>
              <span className="text-slate-300">{newPreview.dest}</span>
            </p>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60"
              >
                Save redirect
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-wrap items-end gap-3">
            <h2 className="flex-1 text-base font-semibold">Saved redirects</h2>
            <input
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              placeholder="Search slug or path…"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm"
            />
            <select
              value={filterEnabled}
              onChange={(e) => setFilterEnabled(e.target.value as typeof filterEnabled)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm"
            >
              <option value="all">All</option>
              <option value="yes">Enabled</option>
              <option value="no">Disabled</option>
            </select>
            <button
              type="button"
              onClick={() => void loadRedirects()}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm"
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-2 pr-3">Ad link (/ads/…)</th>
                  <th className="pb-2 pr-3">Lands on</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {redirects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No redirects yet.
                    </td>
                  </tr>
                ) : (
                  redirects.map((row) => (
                    <tr key={row.id} className="border-t border-slate-800 align-top">
                      <td className="py-3 pr-3">
                        {editId === row.id ? (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="font-mono text-xs text-slate-500">/ads/</span>
                            <input
                              value={editSlug}
                              onChange={(e) => setEditSlug(e.target.value)}
                              pattern="[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?"
                              className="min-w-[8rem] rounded border border-slate-600 bg-slate-950 px-2 py-1 font-mono text-xs"
                            />
                          </div>
                        ) : (
                          <div>
                            <span className="font-mono text-emerald-300">/ads/{row.slug}</span>
                            <p className="mt-0.5 text-[10px] text-slate-600">{row.publicUrl}</p>
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-3">
                        {editId === row.id ? (
                          <DestinationFields
                            idPrefix={`edit-${row.id}`}
                            presets={presets}
                            destOptions={destOptions}
                            presetValue={editDest}
                            customValue={editCustomDest}
                            onPresetChange={setEditDest}
                            onCustomChange={setEditCustomDest}
                          />
                        ) : (
                          <span className="font-mono text-xs text-slate-300">
                            {row.destinationPath}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-3">
                        <span className={row.enabled ? "text-emerald-400" : "text-amber-400"}>
                          {row.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => void copyUrl(row.publicUrl)}
                            className="rounded border border-slate-600 px-2 py-1 text-xs"
                          >
                            Copy URL
                          </button>
                          {editId === row.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => void saveEdit(row)}
                                className="rounded bg-emerald-700 px-2 py-1 text-xs"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditId(null)}
                                className="rounded border border-slate-600 px-2 py-1 text-xs"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEdit(row)}
                              className="rounded border border-slate-600 px-2 py-1 text-xs"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => void toggleEnabled(row)}
                            className="rounded border border-slate-600 px-2 py-1 text-xs"
                          >
                            {row.enabled ? "Disable" : "Enable"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteRow(row)}
                            className="rounded border border-red-800 px-2 py-1 text-xs text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
