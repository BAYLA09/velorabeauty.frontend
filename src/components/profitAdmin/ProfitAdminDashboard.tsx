"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  computeCodProfit,
  computePaymentProfit,
  computeScenarioDelta,
  type CodCalcInput,
  type PaymentCalcInput,
} from "@/lib/profitAdmin/calculations";
import { DEFAULT_FEE_CONFIG, mergeFeeConfig, type FeeConfig } from "@/lib/profitAdmin/feesDefaults";
import { BAYLA_ADMIN_CSRF_HEADER } from "@/lib/profitAdmin/constants";
import type { ProfitDashboardState } from "@/lib/profitAdmin/settingsRepository";

function money(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function pct(n: number): string {
  return `${n.toFixed(1)}%`;
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

function NumInput({
  label,
  value,
  onChange,
  step = "any",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: string;
}) {
  return (
    <label className="block text-xs text-slate-400">
      {label}
      <input
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
      />
    </label>
  );
}

export function ProfitAdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [fees, setFees] = useState<FeeConfig>(mergeFeeConfig(null));
  const [payment, setPayment] = useState<PaymentCalcInput>({
    orderCount: 0,
    totalRevenueUsd: 0,
    avgProductCostUsd: DEFAULT_FEE_CONFIG.products.hairGummies,
    otherCostsUsd: 0,
  });
  const [cod, setCod] = useState<CodCalcInput>({
    totalOrders: 100,
    confirmationRatePct: 70,
    deliveryRatePct: 80,
    sellingPriceUsd: 35,
    avgProductCostUsd: DEFAULT_FEE_CONFIG.products.hairGummies,
    noAnswerRatePct: 15,
    declinedRatePct: 15,
    otherCostsUsd: 0,
  });
  const [scenarioDeliveryRatePct, setScenarioDeliveryRatePct] = useState(80);

  const paymentResult = useMemo(() => computePaymentProfit(payment, fees), [payment, fees]);
  const codResult = useMemo(() => computeCodProfit(cod, fees), [cod, fees]);
  const scenarioCod = useMemo(
    () => computeCodProfit({ ...cod, deliveryRatePct: scenarioDeliveryRatePct }, fees),
    [cod, fees, scenarioDeliveryRatePct],
  );
  const scenarioDelta = useMemo(
    () => computeScenarioDelta(codResult, scenarioCod),
    [codResult, scenarioCod],
  );

  const totalProfit = paymentResult.profitUsd + codResult.profitUsd;
  const totalOrders = paymentResult.orderCount + cod.totalOrders;

  const loadSession = useCallback(async () => {
    const res = await fetch("/api/bayla-admin/auth/session", { credentials: "include" });
    if (res.status === 503) {
      setConfigError("Bayla Admin is not configured on the server.");
      setAuthenticated(false);
      return;
    }
    const data = (await res.json()) as { authenticated?: boolean };
    setAuthenticated(Boolean(data.authenticated));
  }, []);

  const loadState = useCallback(async () => {
    const res = await fetch("/api/bayla-admin/state", { credentials: "include" });
    if (!res.ok) return;
    const data = (await res.json()) as { state?: ProfitDashboardState };
    if (!data.state) return;
    setFees(data.state.fees);
    setPayment(data.state.payment);
    setCod(data.state.cod);
    setScenarioDeliveryRatePct(data.state.scenarioDeliveryRatePct);
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (authenticated) void loadState();
  }, [authenticated, loadState]);

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
    await loadState();
  }

  async function saveState() {
    setSaveMsg(null);
    const res = await fetch("/api/bayla-admin/state", {
      method: "PUT",
      credentials: "include",
      headers: apiHeaders(),
      body: JSON.stringify({
        state: { fees, payment, cod, scenarioDeliveryRatePct },
      }),
    });
    setSaveMsg(res.ok ? "Saved to database." : "Could not save.");
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1419] text-slate-200">
        Loading…
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1419] px-4 text-center text-white">
        <div className="max-w-md rounded-xl border border-violet-500/40 bg-slate-900 p-6">
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
      <div className="flex min-h-screen items-center justify-center bg-[#0f1419] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h1 className="text-xl font-semibold text-white">Bayla Ecom</h1>
          <p className="text-sm text-slate-400">Private profit dashboard</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-6 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Password"
            required
          />
          {loginError ? <p className="mt-2 text-sm text-red-400">{loginError}</p> : null}
          <button type="submit" className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-slate-100">
      <header className="border-b border-slate-800 bg-[#121820] px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Bayla Ecom Dashboard</h1>
            <p className="text-xs text-slate-400">COD + card profit calculator (USD)</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void saveState()}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() =>
                void fetch("/api/bayla-admin/auth/logout", {
                  method: "POST",
                  credentials: "include",
                  headers: apiHeaders(),
                }).then(() => setAuthenticated(false))
              }
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm"
            >
              Log out
            </button>
          </div>
        </div>
        {saveMsg ? <p className="mx-auto mt-2 max-w-7xl text-xs text-emerald-400">{saveMsg}</p> : null}
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total profit", value: money(totalProfit), tone: "text-violet-300" },
            { label: "Payment profit", value: money(paymentResult.profitUsd), tone: "text-emerald-300" },
            { label: "COD profit", value: money(codResult.profitUsd), tone: "text-orange-300" },
            { label: "Orders (pay + COD)", value: String(totalOrders), tone: "text-sky-300" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
              <p className={`mt-2 text-2xl font-semibold ${card.tone}`}>{card.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="text-base font-semibold text-emerald-300">Payment (Stripe card)</h2>
            <p className="mt-1 text-xs text-slate-500">
              Fee per order: {fees.payment.stripePercent}% + {money(fees.payment.stripeFixedUsd)} · Shipping{" "}
              {money(fees.payment.shippingDeliveredUsd)}/order
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NumInput label="Order count" value={payment.orderCount} onChange={(n) => setPayment({ ...payment, orderCount: n })} step="1" />
              <NumInput label="Total revenue ($)" value={payment.totalRevenueUsd} onChange={(n) => setPayment({ ...payment, totalRevenueUsd: n })} />
              <NumInput label="Avg product cost / order ($)" value={payment.avgProductCostUsd} onChange={(n) => setPayment({ ...payment, avgProductCostUsd: n })} />
              <NumInput label="Other costs ($)" value={payment.otherCostsUsd} onChange={(n) => setPayment({ ...payment, otherCostsUsd: n })} />
            </div>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><dt>Stripe fees</dt><dd>{money(paymentResult.stripeFeesUsd)}</dd></div>
              <div className="flex justify-between"><dt>Product cost</dt><dd>{money(paymentResult.productCostUsd)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{money(paymentResult.shippingUsd)}</dd></div>
              <div className="flex justify-between border-t border-slate-700 pt-2 font-semibold text-emerald-300">
                <dt>Profit</dt><dd>{money(paymentResult.profitUsd)} ({pct(paymentResult.marginPct)})</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="text-base font-semibold text-orange-300">COD</h2>
            <p className="mt-1 text-xs text-slate-500">
              Delivered = total × confirmation × delivery · COD fee {fees.cod.platformFeePercent}%
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NumInput label="Total COD orders" value={cod.totalOrders} onChange={(n) => setCod({ ...cod, totalOrders: n })} step="1" />
              <NumInput label="Confirmation rate (%)" value={cod.confirmationRatePct} onChange={(n) => setCod({ ...cod, confirmationRatePct: n })} />
              <NumInput label="Delivery rate (% of confirmed)" value={cod.deliveryRatePct} onChange={(n) => setCod({ ...cod, deliveryRatePct: n })} />
              <NumInput label="Selling price ($)" value={cod.sellingPriceUsd} onChange={(n) => setCod({ ...cod, sellingPriceUsd: n })} />
              <NumInput label="Avg product cost ($)" value={cod.avgProductCostUsd} onChange={(n) => setCod({ ...cod, avgProductCostUsd: n })} />
              <NumInput label="No-answer rate (% of total)" value={cod.noAnswerRatePct} onChange={(n) => setCod({ ...cod, noAnswerRatePct: n })} />
              <NumInput label="Declined rate (% of total)" value={cod.declinedRatePct} onChange={(n) => setCod({ ...cod, declinedRatePct: n })} />
              <NumInput label="Other costs ($)" value={cod.otherCostsUsd} onChange={(n) => setCod({ ...cod, otherCostsUsd: n })} />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Delivered orders: <strong className="text-white">{codResult.deliveredOrders.toFixed(1)}</strong> (
              {cod.totalOrders} × {cod.confirmationRatePct}% × {cod.deliveryRatePct}%)
            </p>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between"><dt>Revenue</dt><dd>{money(codResult.revenueUsd)}</dd></div>
              <div className="flex justify-between"><dt>Call center</dt><dd>{money(codResult.callCenterUsd)}</dd></div>
              <div className="flex justify-between"><dt>Shipping + returns</dt><dd>{money(codResult.shippingUsd)}</dd></div>
              <div className="flex justify-between"><dt>COD platform fee</dt><dd>{money(codResult.codPlatformFeeUsd)}</dd></div>
              <div className="flex justify-between border-t border-slate-700 pt-2 font-semibold text-orange-300">
                <dt>Profit</dt><dd>{money(codResult.profitUsd)} ({pct(codResult.marginPct)})</dd>
              </div>
            </dl>
          </article>
        </section>

        <section className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-5">
          <h2 className="text-base font-semibold text-violet-200">Scenario calculator (COD delivery rate)</h2>
          <div className="mt-3 flex flex-wrap items-end gap-4">
            <NumInput
              label="Scenario delivery rate (%)"
              value={scenarioDeliveryRatePct}
              onChange={setScenarioDeliveryRatePct}
            />
            <div className="text-sm">
              <p>
                Scenario profit: <strong>{money(scenarioCod.profitUsd)}</strong>
              </p>
              <p className={scenarioDelta.profitDeltaUsd >= 0 ? "text-emerald-400" : "text-red-400"}>
                vs current: {scenarioDelta.profitDeltaUsd >= 0 ? "+" : ""}
                {money(scenarioDelta.profitDeltaUsd)} estimated profit
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-base font-semibold">Fee & product cost settings</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <NumInput label="Eye serum cost ($)" value={fees.products.eyeSerum} onChange={(n) => setFees({ ...fees, products: { ...fees.products, eyeSerum: n } })} />
            <NumInput label="Skin gummies cost ($)" value={fees.products.skinGummies} onChange={(n) => setFees({ ...fees, products: { ...fees.products, skinGummies: n } })} />
            <NumInput label="Hair gummies cost ($)" value={fees.products.hairGummies} onChange={(n) => setFees({ ...fees, products: { ...fees.products, hairGummies: n } })} />
            <NumInput label="Stripe %" value={fees.payment.stripePercent} onChange={(n) => setFees({ ...fees, payment: { ...fees.payment, stripePercent: n } })} />
            <NumInput label="Stripe fixed ($)" value={fees.payment.stripeFixedUsd} onChange={(n) => setFees({ ...fees, payment: { ...fees.payment, stripeFixedUsd: n } })} />
            <NumInput label="COD fee %" value={fees.cod.platformFeePercent} onChange={(n) => setFees({ ...fees, cod: { ...fees.cod, platformFeePercent: n } })} />
            <NumInput label="Call center no answer ($)" value={fees.cod.callCenterNoAnswerUsd} onChange={(n) => setFees({ ...fees, cod: { ...fees.cod, callCenterNoAnswerUsd: n } })} />
            <NumInput label="Call center declined ($)" value={fees.cod.callCenterDeclinedUsd} onChange={(n) => setFees({ ...fees, cod: { ...fees.cod, callCenterDeclinedUsd: n } })} />
            <NumInput label="Call center delivered ($)" value={fees.cod.callCenterDeliveredUsd} onChange={(n) => setFees({ ...fees, cod: { ...fees.cod, callCenterDeliveredUsd: n } })} />
            <NumInput label="COD ship delivered ($)" value={fees.cod.shippingDeliveredUsd} onChange={(n) => setFees({ ...fees, cod: { ...fees.cod, shippingDeliveredUsd: n } })} />
            <NumInput label="COD return ship ($)" value={fees.cod.shippingReturnUsd} onChange={(n) => setFees({ ...fees, cod: { ...fees.cod, shippingReturnUsd: n } })} />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Call center: {money(fees.cod.callCenterNoAnswerUsd)} no answer · {money(fees.cod.callCenterDeclinedUsd)}{" "}
            declined · {money(fees.cod.callCenterDeliveredUsd)} delivered/accepted
          </p>
        </section>
      </main>
    </div>
  );
}
