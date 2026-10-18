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

  const [newSlug, setNewSlug] = useState("");
  const [newDest, setNewDest] = useState("/products/hair-gummies");
  const [customDest, setCustomDest] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editDest, setEditDest] = useState("");

  const loadSession = useCallback(async () => {
    const res = await fetch("/api/redirectkiller/auth/session", { credentials: "include" });
    if (res.status === 503) {
      setConfigError("Redirect Killer is not configured on the server.");
      setAuthenticated(false);
      return;
    }
    const data = (await res.json()) as { authenticated?: boolean; destinations?: string[] };
    setAuthenticated(Boolean(data.authenticated));
    if (data.destinations) {
      /* destinations available for custom validation hints */
    }
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
    const destinationPath = customDest.trim() || newDest;
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
        setStatusMsg(data.error ?? "Could not create redirect");
        return;
      }
      setNewSlug("");
      setCustomDest("");
      setStatusMsg("Redirect created.");
      await loadRedirects();
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(row: RedirectRow) {
    setStatusMsg(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/redirectkiller/redirects/${row.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: apiHeaders(),
        body: JSON.stringify({ destinationPath: editDest }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatusMsg(data.error ?? "Update failed");
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
            <p className="text-xs text-slate-400">Public links: /ads/your-slug</p>
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
          <form onSubmit={handleCreate} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-xs text-slate-400">
              Slug (unique)
              <input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="hair-ad"
                pattern="[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-xs text-slate-400">
              Destination
              <select
                value={newDest}
                onChange={(e) => {
                  setNewDest(e.target.value);
                  setCustomDest("");
                }}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
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
            <label className="block text-xs text-slate-400 md:col-span-2">
              Or custom internal path
              <input
                value={customDest}
                onChange={(e) => setCustomDest(e.target.value)}
                placeholder="/lp or /products/hair-gummies"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
            </label>
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
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-2 pr-3">Slug</th>
                  <th className="pb-2 pr-3">Destination</th>
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
                    <tr key={row.id} className="border-t border-slate-800">
                      <td className="py-3 pr-3 font-mono text-emerald-300">{row.slug}</td>
                      <td className="py-3 pr-3">
                        {editId === row.id ? (
                          <select
                            value={editDest}
                            onChange={(e) => setEditDest(e.target.value)}
                            className="w-full max-w-xs rounded border border-slate-600 bg-slate-950 px-2 py-1 text-xs"
                          >
                            {presets.map((p) => (
                              <option key={p.path} value={p.path}>
                                {p.label} — {p.path}
                              </option>
                            ))}
                            {destOptions
                              .filter(
                                (p) =>
                                  !presets.some((pr) => pr.path === p) && p !== editDest,
                              )
                              .map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            {!presets.some((p) => p.path === editDest) &&
                            !destOptions.includes(editDest) ? (
                              <option value={editDest}>{editDest}</option>
                            ) : null}
                          </select>
                        ) : (
                          <span className="font-mono text-xs text-slate-300">{row.destinationPath}</span>
                        )}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={
                            row.enabled ? "text-emerald-400" : "text-amber-400"
                          }
                        >
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
                              onClick={() => {
                                setEditId(row.id);
                                setEditDest(row.destinationPath);
                              }}
                              className="rounded border border-slate-600 px-2 py-1 text-xs"
                            >
                              Edit dest
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
