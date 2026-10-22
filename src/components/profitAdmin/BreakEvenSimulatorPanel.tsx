"use client";

import {
  computeBreakEvenScenario,
  resolveBreakEvenUnitEconomics,
} from "@/lib/profitAdmin/breakEvenSimulator";
import {
  formatOfferAedLine,
  normalizeOfferMix,
  SITE_STORE_OFFERS,
} from "@/lib/profitAdmin/breakEvenOffers";
import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";
import { formatRoas } from "@/lib/profitAdmin/marketingMetrics";
import type { ProfitDashboardState } from "@/lib/profitAdmin/settingsRepository";

function money(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

type Props = {
  fees: FeeConfig;
  localState: ProfitDashboardState;
  onPatch: (patch: Partial<ProfitDashboardState>) => void;
};

function NumField({
  label,
  hint,
  value,
  suffix,
  onChange,
  step = "any",
}: {
  label: string;
  hint?: string;
  value: number;
  suffix?: string;
  onChange: (n: number) => void;
  step?: string;
}) {
  return (
    <label className="block text-xs text-slate-400">
      {label}
      {hint ? <span className="mt-0.5 block text-[11px] text-slate-500">{hint}</span> : null}
      <div className="relative mt-1">
        <input
          type="number"
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-amber-500/35 bg-[#0c1018] px-3 py-2 text-sm text-white"
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

export function BreakEvenSimulatorPanel({ fees, localState, onPatch }: Props) {
  const units = resolveBreakEvenUnitEconomics(fees, localState);
  const scenario = computeBreakEvenScenario(fees, localState);
  const atBreakEven = Math.abs(scenario.netProfitUsd) < 0.01;
  const aboveBe = scenario.netProfitUsd > 0;
  const offerMix = normalizeOfferMix({
    offer1Pct: localState.breakEvenOffer1Pct,
    offer2Pct: localState.breakEvenOffer2Pct,
    offer3Pct: localState.breakEvenOffer3Pct,
  });

  return (
    <article className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/25 to-[#1a1d27] p-5">
      <h2 className="text-base font-semibold text-amber-200">Break Event</h2>
      <p className="mt-1 text-xs text-slate-400">
        Simulator (USD) — same bundle prices as the storefront (199/219, 249/269, 339/359 AED).
      </p>

      <div className="mt-4 rounded-lg border border-slate-700/70 bg-[#0c1018]/70 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-slate-300">Site offer</p>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={localState.breakEvenOfferMixEnabled}
              onChange={(e) => onPatch({ breakEvenOfferMixEnabled: e.target.checked })}
              className="rounded border-slate-600"
            />
            Mix offers (% — leave a tier at 0% if you only sell 1 or 2 bundles)
          </label>
        </div>
        {localState.breakEvenOfferMixEnabled ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <NumField
              label="1 product (199 / 219 AED)"
              suffix="%"
              value={localState.breakEvenOffer1Pct}
              onChange={(n) => onPatch({ breakEvenOffer1Pct: Math.max(0, n) })}
            />
            <NumField
              label="2 products (249 / 269 AED)"
              suffix="%"
              value={localState.breakEvenOffer2Pct}
              onChange={(n) => onPatch({ breakEvenOffer2Pct: Math.max(0, n) })}
            />
            <NumField
              label="3 products (339 / 359 AED)"
              suffix="%"
              value={localState.breakEvenOffer3Pct}
              onChange={(n) => onPatch({ breakEvenOffer3Pct: Math.max(0, n) })}
            />
          </div>
        ) : (
          <label className="mt-2 block text-xs text-slate-400">
            Single offer (all simulated leads)
            <select
              value={localState.breakEvenOfferTier}
              onChange={(e) =>
                onPatch({ breakEvenOfferTier: Number(e.target.value) as 1 | 2 | 3 })
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1018] px-3 py-2 text-sm text-white"
            >
              {SITE_STORE_OFFERS.map((o) => (
                <option key={o.tier} value={o.tier}>
                  {formatOfferAedLine(o)}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="mt-2 text-[11px] text-slate-500">
          {localState.breakEvenOfferMixEnabled
            ? `Normalized mix: ${offerMix[1].toFixed(0)}% / ${offerMix[2].toFixed(0)}% / ${offerMix[3].toFixed(0)}%`
            : formatOfferAedLine(
                SITE_STORE_OFFERS.find((o) => o.tier === localState.breakEvenOfferTier)!,
              )}
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NumField
          label="Simulated leads (purchases)"
          value={localState.breakEvenSimLeadCount}
          onChange={(n) => onPatch({ breakEvenSimLeadCount: Math.max(0, Math.round(n)) })}
        />
        <NumField
          label="Card leads %"
          hint={`COD ${scenario.codLeadPct}% (${scenario.codLeads} leads)`}
          suffix="%"
          value={localState.breakEvenCardLeadPct}
          onChange={(n) => onPatch({ breakEvenCardLeadPct: Math.min(100, Math.max(0, n)) })}
        />
        <NumField
          label="Snapchat CPA (per purchase)"
          value={localState.snapCpaUsd}
          suffix="USD"
          step="0.01"
          onChange={(n) => onPatch({ snapCpaUsd: Math.max(0, n) })}
        />
        <NumField
          label="COD confirmation rate"
          suffix="%"
          value={localState.confirmationRatePct}
          onChange={(n) => onPatch({ confirmationRatePct: Math.min(100, Math.max(0, n)) })}
        />
        <NumField
          label="COD delivery rate"
          suffix="%"
          value={localState.deliveryRatePct}
          onChange={(n) => onPatch({ deliveryRatePct: Math.min(100, Math.max(0, n)) })}
        />
      </div>

      <div
        className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
          atBreakEven
            ? "border-amber-400/50 bg-amber-500/10 text-amber-100"
            : aboveBe
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-100"
              : "border-red-500/40 bg-red-950/20 text-red-100"
        }`}
      >
        <p className="font-semibold">
          {atBreakEven
            ? "On break-even (net ≈ $0)"
            : aboveBe
              ? `Above break-even by ${money(scenario.netProfitUsd)}`
              : `Below break-even by ${money(Math.abs(scenario.netProfitUsd))}`}
        </p>
        <p className="mt-1 text-xs opacity-90">
          Max CPA (all leads):{" "}
          {scenario.maxCpaBreakEvenUsd !== null ? money(scenario.maxCpaBreakEvenUsd) : "—"} · Your
          CPA: {money(localState.snapCpaUsd)} · ROAS {formatRoas(scenario.currentRoas)} · Break-even
          ROAS {formatRoas(scenario.breakEvenRoas)}
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-emerald-500/25 bg-[#12151f] p-4">
          <h3 className="text-sm font-semibold text-emerald-300">Card channel</h3>
          <p className="text-xs text-slate-500">
            {scenario.cardLeads} leads · {money(units.avgCardRevenueUsd)} avg revenue / order
          </p>
          <dl className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-400">Profit before ads</dt>
              <dd>{money(scenario.card.profitUsd)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">− Ad spend (CPA × card leads)</dt>
              <dd>{money(scenario.cardAdSpendUsd)}</dd>
            </div>
            <div className="flex justify-between font-medium text-emerald-300">
              <dt>Net (card)</dt>
              <dd>{money(scenario.card.profitUsd - scenario.cardAdSpendUsd)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2 text-slate-400">
              <dt>Max CPA (card only)</dt>
              <dd>
                {scenario.maxCpaCardChannelUsd !== null
                  ? money(scenario.maxCpaCardChannelUsd)
                  : "—"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-orange-500/25 bg-[#12151f] p-4">
          <h3 className="text-sm font-semibold text-orange-300">COD channel</h3>
          <p className="text-xs text-slate-500">
            {scenario.codLeads} leads · {scenario.cod.deliveredOrders.toFixed(1)} delivered (sim)
          </p>
          <dl className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-400">Profit before ads</dt>
              <dd>{money(scenario.cod.profitUsd)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">− Ad spend (CPA × COD leads)</dt>
              <dd>{money(scenario.codAdSpendUsd)}</dd>
            </div>
            <div className="flex justify-between font-medium text-orange-300">
              <dt>Net (COD)</dt>
              <dd>{money(scenario.cod.profitUsd - scenario.codAdSpendUsd)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2 text-slate-400">
              <dt>Max CPA (COD only)</dt>
              <dd>
                {scenario.maxCpaCodChannelUsd !== null ? money(scenario.maxCpaCodChannelUsd) : "—"}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <dl className="mt-4 grid gap-2 rounded-lg border border-slate-700/60 bg-[#0c1018]/60 p-3 text-xs sm:grid-cols-2">
        <div className="flex justify-between gap-2">
          <dt className="text-slate-400">Total ad spend</dt>
          <dd>{money(scenario.adSpendUsd)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-400">Gross profit (before ads)</dt>
          <dd>{money(scenario.grossProfitUsd)}</dd>
        </div>
        <div className="flex justify-between gap-2 font-semibold text-white">
          <dt>Net profit (sim)</dt>
          <dd>{money(scenario.netProfitUsd)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-400">Net / lead</dt>
          <dd>
            {scenario.netPerLeadUsd !== null ? money(scenario.netPerLeadUsd) : "—"}
          </dd>
        </div>
      </dl>
    </article>
  );
}
