import {
  computeCodPanel,
  computePaymentPanel,
  netProfitAfterAdSpend,
} from "@/lib/profitAdmin/calculations";
import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";
import { computeMarketingMetrics, type MarketingMetrics } from "@/lib/profitAdmin/marketingMetrics";
import {
  aggregateOrdersForPeriod,
  buildCodPanelForPeriod,
  buildPaymentPanelFromLive,
  type PeriodMetrics,
} from "@/lib/profitAdmin/orderMetrics";
import type { ProfitDashboardState } from "@/lib/profitAdmin/settingsRepository";

export type PeriodEconomics = {
  live: PeriodMetrics;
  paymentResult: ReturnType<typeof computePaymentPanel>;
  codResult: ReturnType<typeof computeCodPanel>;
  adSpendUsd: number;
  totalProfitUsd: number;
  totalOrders: number;
  marketing: MarketingMetrics;
};

export function computePeriodEconomics(
  fromIso: string,
  toIso: string,
  fees: FeeConfig,
  state: ProfitDashboardState,
): PeriodEconomics {
  const live = aggregateOrdersForPeriod(fromIso, toIso, fees);
  const paymentResult = computePaymentPanel(buildPaymentPanelFromLive(live.payment, fees));
  const codInput = buildCodPanelForPeriod(
    fromIso,
    toIso,
    fees,
    state.confirmationRatePct,
    state.deliveryRatePct,
  );
  const codResult = computeCodPanel(codInput);
  const adSpendUsd = state.adSpendUsd;
  const marketing = computeMarketingMetrics({ adSpendUsd, payment: paymentResult, cod: codResult });
  const totalProfitUsd = netProfitAfterAdSpend(
    paymentResult.profitUsd,
    codResult.profitUsd,
    adSpendUsd,
  );
  const totalOrders = paymentResult.orderCount + codInput.totalOrders;

  return {
    live,
    paymentResult,
    codResult,
    adSpendUsd,
    totalProfitUsd,
    totalOrders,
    marketing,
  };
}
