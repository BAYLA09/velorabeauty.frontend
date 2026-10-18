"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfigFootnote } from "@/components/profitAdmin/ConfigFootnote";
import { DonutChart } from "@/components/profitAdmin/DonutChart";
import { ProfitLineChart } from "@/components/profitAdmin/ProfitLineChart";
import type { CodPanelInput, PaymentPanelInput } from "@/lib/profitAdmin/calculations";
import { BAYLA_ADMIN_CSRF_HEADER } from "@/lib/profitAdmin/constants";
import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";
import type { DailyProfitPoint } from "@/lib/profitAdmin/orderMetrics";
import type { MarketingMetrics } from "@/lib/profitAdmin/marketingMetrics";
import { formatMoneyMetric, formatRoiPct, formatRoas } from "@/lib/profitAdmin/marketingMetrics";
import type { ProfitDashboardState } from "@/lib/profitAdmin/settingsRepository";

type DashboardPayload = {
  range: { from: string; to: string };
  previousRange: { from: string; to: string };
  payment: {
    input: PaymentPanelInput;
    result: PaymentPanelInput & {
      profitUsd: number;
      marginPct: number;
      stripeFeesUsd: number;
      revenueUsd: number;
    };
  };
  cod: {
    input: CodPanelInput;
    result: CodPanelInput & {
      profitUsd: number;
      marginPct: number;
      deliveredOrders: number;
      confirmedOrders: number;
      notConfirmedOrders: number;
      returnedOrders: number;
      revenueUsd: number;
      productCostUsd: number;
      shippingCostUsd: number;
      callCenterUsd: number;
      callCenterNoAnswerUsd: number;
      callCenterReturnedUsd: number;
      callCenterDeliveredUsd: number;
      shippingDeliveredUsd: number;
      shippingReturnedUsd: number;
      codServiceFeeUsd: number;
    };
    live?: {
      pendingOrders: number;
      noAnswerOrders: number;
      cancelledOrders: number;
      confirmedPipelineOrders: number;
      deliveredOrders: number;
      returnedOrders: number;
      projectedFromPending: { notConfirmed: number; delivered: number; returned: number };
    };
  };
  kpis: {
    totalProfitUsd: number;
    paymentProfitUsd: number;
    codProfitUsd: number;
    adSpendUsd: number;
    totalOrders: number;
    changes: {
      totalProfitPct: number | null;
      paymentProfitPct: number | null;
      codProfitPct: number | null;
      totalOrdersPct: number | null;
    };
  };
  profitSummary: {
    paymentProfitUsd: number;
    codProfitUsd: number;
    totalProfitUsd: number;
    totalMarginPct: number;
    marketing: MarketingMetrics;
  };
  chart: DailyProfitPoint[];
  recentOrders: {
    id: string;
    type: string;
    customerName: string;
    amountUsd: number;
    status: string;
    statusTone: string;
    date: string;
  }[];
  state: ProfitDashboardState;
  fees: FeeConfig;
  codNetwork?: {
    webhookSecretConfigured: boolean;
    apiTokenConfigured: boolean;
    lastWebhookAt: string | null;
    statusCutoffIso: string;
  };
};

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◉" },
  { id: "payment", label: "Payment Orders", icon: "◎" },
  { id: "cod", label: "COD Orders", icon: "◈" },
  { id: "products", label: "Products", icon: "▣" },
  { id: "costs", label: "Costs & Fees", icon: "◇" },
  { id: "analytics", label: "Analytics", icon: "◐" },
  { id: "reports", label: "Reports", icon: "▤" },
  { id: "settings", label: "Settings", icon: "⚙" },
] as const;

function money(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function readCsrf(): string {
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bayla_admin_csrf="));
  return match ? decodeURIComponent(match.slice("bayla_admin_csrf=".length)) : "";
}

function apiHeaders(): HeadersInit {
  const csrf = readCsrf();
  return csrf
    ? { "Content-Type": "application/json", [BAYLA_ADMIN_CSRF_HEADER]: csrf }
    : { "Content-Type": "application/json" };
}

function formatRangeLabel(from: string, to: string): string {
  const f = new Date(from);
  const t = new Date(to);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return `${f.toLocaleDateString("en-US", opts)} – ${t.toLocaleDateString("en-US", opts)}`;
}

function formatPrevLabel(from: string, to: string): string {
  const f = new Date(from);
  const t = new Date(to);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${f.toLocaleDateString("en-US", opts)} – ${t.toLocaleDateString("en-US", opts)}`;
}

function TrendBadge({ pct, prevLabel }: { pct: number | null; prevLabel: string }) {
  if (pct === null) {
    return <span className="text-xs text-slate-500">No prior period data</span>;
  }
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        up ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
      }`}
    >
      {up ? "+" : ""}
      {pct.toFixed(1)}% vs {prevLabel}
    </span>
  );
}

function NumInput({
  label,
  value,
  onChange,
  step = "any",
  disabled,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: string;
  disabled?: boolean;
  suffix?: string;
}) {
  return (
    <label className="block text-xs text-slate-400">
      {label}
      <div className="relative mt-1">
        <input
          type="number"
          step={step}
          disabled={disabled}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-slate-700/80 bg-[#0c1018] px-3 py-2 text-sm text-white disabled:opacity-60"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export function ProfitAdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<string>("dashboard");
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loadingDash, setLoadingDash] = useState(false);
  const [codNetRefreshing, setCodNetRefreshing] = useState(false);
  const [codNetNote, setCodNetNote] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [localState, setLocalState] = useState<ProfitDashboardState | null>(null);
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  const loadSession = useCallback(async () => {
    const res = await fetch("/api/bayla-admin/auth/session", { credentials: "include" });
    if (res.status === 503) {
      setConfigError("Bayla Admin is not configured on the server.");
      setAuthenticated(false);
      return;
    }
    const json = (await res.json()) as { authenticated?: boolean };
    setAuthenticated(Boolean(json.authenticated));
  }, []);

  const persistState = useCallback(async (state: ProfitDashboardState) => {
    await fetch("/api/bayla-admin/state", {
      method: "PUT",
      credentials: "include",
      headers: apiHeaders(),
      body: JSON.stringify({ state }),
    });
  }, []);

  const loadDashboard = useCallback(async (from?: string, to?: string) => {
    setLoadingDash(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const res = await fetch(`/api/bayla-admin/dashboard?${params}`, { credentials: "include" });
    if (res.ok) {
      const json = (await res.json()) as DashboardPayload;
      setData(json);
      setLocalState(json.state);
      setRangeFrom(json.range.from.slice(0, 10));
      setRangeTo(json.range.to.slice(0, 10));
    }
    setLoadingDash(false);
  }, []);

  const refreshCodNetwork = useCallback(async () => {
    setCodNetRefreshing(true);
    setCodNetNote(null);
    try {
      const res = await fetch("/api/bayla-admin/cod-network/refresh", {
        method: "POST",
        credentials: "include",
        headers: apiHeaders(),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        leadsProcessed?: number;
        ordersProcessed?: number;
        errors?: string[];
      };
      if (!res.ok || !json.ok) {
        setCodNetNote(json.error ?? "COD Network refresh failed");
        return;
      }
      setCodNetNote(
        `Polled COD Network — leads ${json.leadsProcessed ?? 0}, orders ${json.ordersProcessed ?? 0}.`,
      );
      await loadDashboard();
    } finally {
      setCodNetRefreshing(false);
    }
  }, [loadDashboard]);

  const codNetworkStatusLine = useMemo(() => {
    const cn = data?.codNetwork;
    if (!cn) return null;
    const last = cn.lastWebhookAt
      ? new Date(cn.lastWebhookAt).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })
      : "never";
    const secret = cn.webhookSecretConfigured ? "webhook OK" : "webhook secret missing";
    return `COD Network status · last webhook: ${last} (${secret})`;
  }, [data?.codNetwork]);

  const scheduleSave = useCallback(
    (state: ProfitDashboardState) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void persistState(state).then(() =>
          loadDashboard(state.dateRangeFrom ?? undefined, state.dateRangeTo ?? undefined),
        );
      }, 400);
    },
    [persistState, loadDashboard],
  );

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (authenticated) void loadDashboard();
  }, [authenticated, loadDashboard]);


  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/bayla-admin/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Invalid password or rate limited.");
      return;
    }
    setPassword("");
    setAuthenticated(true);
    await loadDashboard();
  }

  function patchState(patch: Partial<ProfitDashboardState>) {
    if (!localState) return;
    const next = { ...localState, ...patch };
    setLocalState(next);
    scheduleSave(next);
  }

  function applyRange() {
    const from = new Date(`${rangeFrom}T00:00:00.000Z`).toISOString();
    const to = new Date(`${rangeTo}T23:59:59.999Z`).toISOString();
    if (localState) {
      const next = { ...localState, dateRangeFrom: from, dateRangeTo: to };
      setLocalState(next);
      void persistState(next).then(() => loadDashboard(from, to));
    } else {
      void loadDashboard(from, to);
    }
  }

  const prevLabel = useMemo(() => {
    if (!data) return "";
    return formatPrevLabel(data.previousRange.from, data.previousRange.to);
  }, [data]);

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f111a] text-slate-200">
        Loading…
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f111a] px-4 text-center text-white">
        <div className="max-w-md rounded-xl border border-violet-500/40 bg-[#1a1d27] p-6">
          <p>{configError}</p>
          <p className="mt-3 text-xs text-slate-400">
            Add BAYLA_ADMIN_PASSWORD and BAYLA_ADMIN_SESSION_SECRET in Easypanel.
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f111a] px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-slate-700/80 bg-[#1a1d27] p-6 shadow-xl"
        >
          <h1 className="text-xl font-semibold text-white">Bayla Ecom</h1>
          <p className="text-sm text-slate-400">Velora Beauty profit dashboard</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-6 w-full rounded-lg border border-slate-600 bg-[#0c1018] px-3 py-2 text-sm text-white"
            placeholder="Password"
            required
          />
          {loginError ? <p className="mt-2 text-sm text-red-400">{loginError}</p> : null}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const paymentInput = data?.payment.input;
  const paymentResult = data?.payment.result;
  const codInput = data?.cod.input;
  const codResult = data?.cod.result;

  return (
    <div className="flex min-h-screen bg-[#0f111a] text-slate-100">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-800/80 bg-[#12151f] lg:flex">
        <div className="border-b border-slate-800/80 px-5 py-5">
          <p className="text-lg font-bold tracking-tight text-white">Bayla Ecom</p>
          <p className="text-xs text-slate-500">Dashboard</p>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveNav(item.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                activeNav === item.id
                  ? "bg-violet-600/90 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span className="text-base opacity-80">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-slate-800/80 p-3 text-sm text-slate-400">
          <a href="mailto:support@velorabeauty.world" className="block rounded-lg px-3 py-2 hover:bg-slate-800/60">
            Support
          </a>
          <button
            type="button"
            onClick={() =>
              void fetch("/api/bayla-admin/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: apiHeaders(),
              }).then(() => setAuthenticated(false))
            }
            className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800/60"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-800/80 bg-[#12151f]/80 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
              <p className="text-sm text-slate-400">
                Overview of your store performance and profits.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-[#1a1d27] px-3 py-2 text-xs">
                <input
                  type="date"
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none"
                />
                <span className="text-slate-500">–</span>
                <input
                  type="date"
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none"
                />
                <button
                  type="button"
                  onClick={applyRange}
                  className="rounded-lg bg-slate-700 px-2 py-1 text-white hover:bg-slate-600"
                >
                  Apply
                </button>
              </div>
              {data?.codNetwork?.apiTokenConfigured ? (
                <button
                  type="button"
                  disabled={codNetRefreshing}
                  onClick={() => void refreshCodNetwork()}
                  className="rounded-xl border border-slate-600 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-50"
                >
                  {codNetRefreshing ? "Refreshing…" : "Refresh from COD Network"}
                </button>
              ) : null}
              <div
                className="max-w-xs rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-100/90"
                title="Statuses update via COD Network webhooks (not Google Sheets)"
              >
                COD Network status
                <p className="mt-0.5 text-[11px] text-emerald-200/70">
                  {codNetworkStatusLine ?? "Loading…"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold">
                  AB
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">Amine Bayla</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
          {data ? (
            <p className="mt-2 text-xs text-slate-500">
              {formatRangeLabel(data.range.from, data.range.to)}
              {loadingDash ? " · Refreshing…" : null}
              {codNetNote ? ` · ${codNetNote}` : null}
            </p>
          ) : null}
        </header>

        <main className="flex-1 space-y-6 overflow-auto p-4 md:p-8">
          {(activeNav === "dashboard" || activeNav === "payment" || activeNav === "cod") && data ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Total Profit",
                    value: money(data.kpis.totalProfitUsd),
                    change: data.kpis.changes.totalProfitPct,
                    tone: "from-violet-600/20 to-violet-900/10 border-violet-500/30",
                    accent: "text-violet-300",
                  },
                  {
                    label: "Payment Profit",
                    value: money(data.kpis.paymentProfitUsd),
                    change: data.kpis.changes.paymentProfitPct,
                    tone: "from-emerald-600/15 to-emerald-900/5 border-emerald-500/25",
                    accent: "text-emerald-300",
                  },
                  {
                    label: "COD Profit",
                    value: money(data.kpis.codProfitUsd),
                    change: data.kpis.changes.codProfitPct,
                    tone: "from-orange-600/15 to-orange-900/5 border-orange-500/25",
                    accent: "text-orange-300",
                  },
                  {
                    label: "Total Orders",
                    value: String(data.kpis.totalOrders),
                    change: data.kpis.changes.totalOrdersPct,
                    tone: "from-sky-600/15 to-sky-900/5 border-sky-500/25",
                    accent: "text-sky-300",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`rounded-2xl border bg-gradient-to-br p-4 ${card.tone}`}
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {card.label}
                    </p>
                    <p className={`mt-2 text-2xl font-bold ${card.accent}`}>{card.value}</p>
                    <div className="mt-3">
                      <TrendBadge pct={card.change} prevLabel={prevLabel} />
                    </div>
                  </div>
                ))}
              </section>

              {localState ? (
                <article className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/30 to-[#1a1d27] p-5">
                  <h2 className="text-base font-semibold text-violet-200">Your inputs</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    The only values you control — everything else uses live orders and server fee
                    config.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <NumInput
                      label="Confirmation rate"
                      suffix="%"
                      value={localState.confirmationRatePct}
                      onChange={(n) => patchState({ confirmationRatePct: n })}
                    />
                    <NumInput
                      label="Delivery rate"
                      suffix="%"
                      value={localState.deliveryRatePct}
                      onChange={(n) => patchState({ deliveryRatePct: n })}
                    />
                    <NumInput
                      label="Ad spend (Snapchat)"
                      value={localState.adSpendUsd}
                      onChange={(n) => patchState({ adSpendUsd: n })}
                    />
                  </div>
                </article>
              ) : null}

              <section className="grid gap-6 xl:grid-cols-2">
                <article className="rounded-2xl border border-slate-800/80 bg-[#1a1d27] p-5">
                  <h2 className="flex items-center gap-2 text-base font-semibold">
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                    Payment Orders (Card / Online)
                  </h2>
                  {paymentInput && paymentResult && data ? (
                    <div className="mt-4 grid gap-6 md:grid-cols-2">
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-400">Total Revenue</dt>
                          <dd>{money(paymentResult.revenueUsd)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Product Cost</dt>
                          <dd>{money(paymentResult.productCostUsd)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Shipping Cost</dt>
                          <dd>{money(paymentResult.shippingCostUsd)}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-400">Stripe fees (card only)</dt>
                          <dd className="text-right">
                            {money(paymentResult.stripeFeesUsd)}
                            <span className="ml-1 text-xs text-slate-500">
                              ({data.fees.payment.stripePercent}% +{" "}
                              {money(data.fees.payment.stripeFixedUsd)} / card order)
                            </span>
                          </dd>
                        </div>
                      </dl>
                      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-700/60 bg-[#12151f] p-4">
                        <p className="text-sm text-slate-400">Payment Profit</p>
                        <p className="text-2xl font-bold text-emerald-400">
                          {money(paymentResult.profitUsd)}
                        </p>
                        <DonutChart
                          percent={paymentResult.marginPct}
                          color="#34d399"
                          label="Profit Margin"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <ConfigFootnote fees={data.fees} />
                      </div>
                    </div>
                  ) : null}
                </article>

                <article className="rounded-2xl border border-slate-800/80 bg-[#1a1d27] p-5">
                  <h2 className="flex items-center gap-2 text-base font-semibold">
                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                    COD Orders
                  </h2>
                  {codInput && codResult && localState && data ? (
                    <div className="mt-4 grid gap-6 md:grid-cols-2">
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Total COD orders (N)</dt>
                          <dd>{codInput.totalOrders}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Avg selling price (delivered)</dt>
                          <dd>{money(codInput.sellingPricePerOrderUsd)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Avg product cost (delivered)</dt>
                          <dd>{money(codInput.productCostPerOrderUsd)}</dd>
                        </div>
                        {data.cod.live ? (
                          <div className="rounded-lg border border-slate-700/50 bg-[#12151f]/80 p-3 text-xs text-slate-400">
                            <p className="font-medium text-slate-300">From COD Network (actual)</p>
                            <p className="mt-1">
                              No answer {data.cod.live.noAnswerOrders} · Confirmed{" "}
                              {data.cod.live.confirmedPipelineOrders} · Delivered{" "}
                              {data.cod.live.deliveredOrders} · Returned{" "}
                              {data.cod.live.returnedOrders} · Cancelled{" "}
                              {data.cod.live.cancelledOrders} · Pending{" "}
                              {data.cod.live.pendingOrders}
                            </p>
                            {data.cod.live.pendingOrders > 0 ? (
                              <p className="mt-1 text-slate-500">
                                Pending projected with your {localState.confirmationRatePct}% /{" "}
                                {localState.deliveryRatePct}% rates (+{Math.round(data.cod.live.projectedFromPending.delivered)} delivered est.).
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Not confirmed (total incl. projected)</dt>
                          <dd>{Math.round(codResult.notConfirmedOrders)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Returned (total incl. projected)</dt>
                          <dd>{Math.round(codResult.returnedOrders)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Call center fees</dt>
                          <dd>{money(codResult.callCenterUsd)}</dd>
                        </div>
                        <div className="flex justify-between pl-3 text-xs text-slate-500">
                          <dt>No answer</dt>
                          <dd>{money(codResult.callCenterNoAnswerUsd)}</dd>
                        </div>
                        <div className="flex justify-between pl-3 text-xs text-slate-500">
                          <dt>Returned</dt>
                          <dd>{money(codResult.callCenterReturnedUsd)}</dd>
                        </div>
                        <div className="flex justify-between pl-3 text-xs text-slate-500">
                          <dt>Delivered</dt>
                          <dd>{money(codResult.callCenterDeliveredUsd)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Shipping fees</dt>
                          <dd>{money(codResult.shippingCostUsd)}</dd>
                        </div>
                        <div className="flex justify-between pl-3 text-xs text-slate-500">
                          <dt>Returned shipments</dt>
                          <dd>{money(codResult.shippingReturnedUsd)}</dd>
                        </div>
                        <div className="flex justify-between pl-3 text-xs text-slate-500">
                          <dt>Delivered shipments</dt>
                          <dd>{money(codResult.shippingDeliveredUsd)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">COD service fee (COD only)</dt>
                          <dd>
                            {money(codResult.codServiceFeeUsd)}
                            <span className="ml-1 text-xs text-slate-500">
                              ({codInput.serviceFeePercent}% of delivered COD revenue)
                            </span>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Product cost (delivered)</dt>
                          <dd>{money(codResult.productCostUsd)}</dd>
                        </div>
                      </dl>
                      <div className="space-y-3">
                        <div className="rounded-xl border border-slate-700/60 bg-[#12151f] p-4 text-sm">
                          <p className="text-slate-400">Delivered Orders</p>
                          <p className="text-xl font-semibold text-white">
                            {Math.round(codResult.deliveredOrders)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {data.cod.live && data.cod.live.pendingOrders > 0
                              ? `Includes ${Math.round(data.cod.live.projectedFromPending.delivered)} projected from ${data.cod.live.pendingOrders} pending`
                              : "All orders have COD Network-synced statuses"}
                          </p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">COD Revenue</span>
                          <span>{money(codResult.revenueUsd)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-orange-300">
                          <span>COD Profit</span>
                          <span>{money(codResult.profitUsd)}</span>
                        </div>
                        <div className="flex justify-center pt-2">
                          <DonutChart
                            percent={codResult.marginPct}
                            color="#fb923c"
                            label="Profit Margin"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <ConfigFootnote fees={data.fees} />
                      </div>
                    </div>
                  ) : null}
                </article>
              </section>

              <section className="grid gap-6 xl:grid-cols-3">
                <article className="xl:col-span-2 rounded-2xl border border-slate-800/80 bg-[#1a1d27] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold">Profit Overview</h2>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-violet-300">
                        <span className="h-2 w-2 rounded-full bg-violet-400" /> Payment
                      </span>
                      <span className="flex items-center gap-1 text-orange-300">
                        <span className="h-2 w-2 rounded-full bg-orange-400" /> COD
                      </span>
                      <span className="flex items-center gap-1 text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> Total
                      </span>
                      <select
                        className="rounded-lg border border-slate-600 bg-[#0c1018] px-2 py-1 text-slate-200"
                        value={localState?.chartDays ?? 7}
                        onChange={(e) => {
                          const v = Number.parseInt(e.target.value, 10) as 7 | 30 | 90;
                          patchState({ chartDays: v });
                          void loadDashboard();
                        }}
                      >
                        <option value={7}>Last 7 Days</option>
                        <option value={30}>Last 30 Days</option>
                        <option value={90}>Last 90 Days</option>
                      </select>
                    </div>
                  </div>
                  <ProfitLineChart points={data.chart} />
                </article>

                <div className="space-y-4">
                  <article className="rounded-2xl border border-slate-800/80 bg-[#1a1d27] p-5">
                    <h2 className="text-base font-semibold">Profit Summary</h2>
                    <dl className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-violet-300">
                        <dt>Payment Profit</dt>
                        <dd>{money(data.profitSummary.paymentProfitUsd)}</dd>
                      </div>
                      <div className="flex justify-between text-orange-300">
                        <dt>COD Profit</dt>
                        <dd>{money(data.profitSummary.codProfitUsd)}</dd>
                      </div>
                      <div className="flex justify-between font-semibold text-emerald-300">
                        <dt>Total Profit</dt>
                        <dd>{money(data.profitSummary.totalProfitUsd)}</dd>
                      </div>
                      <div className="flex justify-between border-t border-slate-700 pt-2 text-slate-400">
                        <dt>Ad spend (Snapchat)</dt>
                        <dd>{money(data.kpis.adSpendUsd)}</dd>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <dt>Total Profit Margin</dt>
                        <dd>{data.profitSummary.totalMarginPct.toFixed(1)}%</dd>
                      </div>
                      <div className="mt-3 space-y-2 border-t border-slate-700 pt-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Ad performance
                        </p>
                        {[
                          { label: "ROI", value: formatRoiPct(data.profitSummary.marketing.roiPct) },
                          { label: "ROAS", value: formatRoas(data.profitSummary.marketing.roas) },
                          { label: "CPA", value: formatMoneyMetric(data.profitSummary.marketing.cpaUsd) },
                          {
                            label: "Cost / delivered order",
                            value: formatMoneyMetric(
                              data.profitSummary.marketing.costPerDeliveredOrderUsd,
                            ),
                          },
                          {
                            label: "Break-even ROAS",
                            value: formatRoas(data.profitSummary.marketing.breakEvenRoas),
                          },
                        ].map((row) => (
                          <div key={row.label} className="flex justify-between text-slate-300">
                            <dt className="text-slate-400">{row.label}</dt>
                            <dd className="font-medium text-white">{row.value}</dd>
                          </div>
                        ))}
                      </div>
                    </dl>
                  </article>

                  <article className="rounded-2xl border border-slate-800/80 bg-[#1a1d27] p-5">
                    <h2 className="text-base font-semibold">Quick Actions</h2>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        { label: "Add Payment Order", href: "/checkout/card" },
                        { label: "Add COD Order", href: "/checkout/cod" },
                        { label: "View Costs", action: () => setActiveNav("costs") },
                        {
                          label: "Download Report",
                          action: () => {
                            const q = new URLSearchParams();
                            if (localState?.dateRangeFrom) q.set("from", localState.dateRangeFrom);
                            if (localState?.dateRangeTo) q.set("to", localState.dateRangeTo);
                            window.open(`/api/bayla-admin/report?${q}`, "_blank");
                          },
                        },
                      ].map((btn) =>
                        btn.href ? (
                          <a
                            key={btn.label}
                            href={btn.href}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-slate-700 bg-[#12151f] px-2 py-3 text-center text-xs font-medium text-slate-200 hover:border-violet-500/50"
                          >
                            {btn.label}
                          </a>
                        ) : (
                          <button
                            key={btn.label}
                            type="button"
                            onClick={btn.action}
                            className="rounded-xl border border-slate-700 bg-[#12151f] px-2 py-3 text-xs font-medium text-slate-200 hover:border-violet-500/50"
                          >
                            {btn.label}
                          </button>
                        ),
                      )}
                    </div>
                  </article>
                </div>
              </section>

              <article className="rounded-2xl border border-slate-800/80 bg-[#1a1d27] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Recent Orders</h2>
                  <span className="text-xs text-violet-400">View All Orders</span>
                </div>
                {data.recentOrders.length === 0 ? (
                  <p className="mt-6 text-center text-sm text-slate-500">
                    No orders yet — empty state until ads drive traffic.
                  </p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead className="text-xs uppercase text-slate-500">
                        <tr>
                          <th className="pb-2 pr-4">Order ID</th>
                          <th className="pb-2 pr-4">Type</th>
                          <th className="pb-2 pr-4">Customer</th>
                          <th className="pb-2 pr-4">Amount</th>
                          <th className="pb-2 pr-4">Status</th>
                          <th className="pb-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentOrders.map((row) => (
                          <tr key={row.id} className="border-t border-slate-800/80">
                            <td className="py-2.5 pr-4 font-mono text-xs text-slate-400">
                              #{row.id.slice(0, 8)}
                            </td>
                            <td className="py-2.5 pr-4">{row.type}</td>
                            <td className="py-2.5 pr-4">{row.customerName}</td>
                            <td className="py-2.5 pr-4">{money(row.amountUsd)}</td>
                            <td className="py-2.5 pr-4">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs ${
                                  row.statusTone === "success"
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : row.statusTone === "warning"
                                      ? "bg-orange-500/15 text-orange-300"
                                      : "bg-slate-700 text-slate-300"
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-400">{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            </>
          ) : null}

          {(activeNav === "products" || activeNav === "costs") && data ? (
            <article className="rounded-2xl border border-slate-800/80 bg-[#1a1d27] p-5">
              <h2 className="text-base font-semibold">
                {activeNav === "products" ? "Products" : "Costs & Fees"} (read-only)
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Fee config is set in Easypanel environment variables — not editable in the dashboard.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                In stock: Eye serum (SKU vitaminamin), Skin Whitening Gummies (SKU WHITEAMIN).
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex justify-between gap-2 sm:block">
                  <dt className="text-slate-400">Eye serum COGS</dt>
                  <dd>{money(data.fees.products.eyeSerum)}</dd>
                </div>
                <div className="flex justify-between gap-2 sm:block">
                  <dt className="text-slate-400">Skin gummies COGS</dt>
                  <dd>{money(data.fees.products.skinGummies)}</dd>
                </div>
                <div className="flex justify-between gap-2 sm:block">
                  <dt className="text-slate-400">Hair gummies COGS</dt>
                  <dd>{money(data.fees.products.hairGummies)}</dd>
                </div>
                <div className="flex justify-between gap-2 sm:block">
                  <dt className="text-slate-400">AED per USD (FX)</dt>
                  <dd>{data.fees.aedPerUsd}</dd>
                </div>
                <div className="flex justify-between gap-2 sm:block">
                  <dt className="text-slate-400">Stripe fee (card only)</dt>
                  <dd>
                    {data.fees.payment.stripePercent}% + {money(data.fees.payment.stripeFixedUsd)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2 sm:block">
                  <dt className="text-slate-400">Card shipping / order</dt>
                  <dd>{money(data.fees.payment.shippingPerOrderUsd)}</dd>
                </div>
                <div className="flex justify-between gap-2 sm:block">
                  <dt className="text-slate-400">COD call center</dt>
                  <dd>
                    {money(data.fees.cod.callCenterNoAnswerUsd)} /{" "}
                    {money(data.fees.cod.callCenterReturnedUsd)} /{" "}
                    {money(data.fees.cod.callCenterDeliveredUsd)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2 sm:block">
                  <dt className="text-slate-400">COD shipping</dt>
                  <dd>
                    {money(data.fees.cod.shippingReturnedUsd)} returned /{" "}
                    {money(data.fees.cod.shippingDeliveredUsd)} delivered
                  </dd>
                </div>
                <div className="flex justify-between gap-2 sm:block">
                  <dt className="text-slate-400">COD service fee (COD only)</dt>
                  <dd>{data.fees.cod.serviceFeePercent}% of delivered COD revenue</dd>
                </div>
              </dl>
              <ConfigFootnote fees={data.fees} />
              <p className="mt-4 text-xs text-slate-500">
                COD formula: delivered = orders × confirmation% × delivery%; return cost applies to
                confirmed-but-not-delivered orders. Net profit subtracts ad spend from payment + COD
                profit.
              </p>
            </article>
          ) : null}

          {["analytics", "reports", "settings"].includes(activeNav) ? (
            <article className="rounded-2xl border border-dashed border-slate-700 bg-[#1a1d27]/50 p-8 text-center text-sm text-slate-400">
              <p className="font-medium text-slate-300">{NAV.find((n) => n.id === activeNav)?.label}</p>
              <p className="mt-2">Use the main dashboard for profit analytics. More views coming soon.</p>
              <button
                type="button"
                onClick={() => setActiveNav("dashboard")}
                className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white"
              >
                Back to Dashboard
              </button>
            </article>
          ) : null}
        </main>
      </div>
    </div>
  );
}
