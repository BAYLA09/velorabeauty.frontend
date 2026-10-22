import { computePaymentPanel, netProfitAfterAdSpend } from "@/lib/profitAdmin/calculations";
import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";
import { computeMarketingMetrics, type MarketingMetrics } from "@/lib/profitAdmin/marketingMetrics";
import { buildCodPanelForPeriodWithLiveStatuses } from "@/lib/profitAdmin/codLiveMetrics";
import {
  aggregateOrdersForPeriod,
  buildPaymentPanelFromLive,
  type PeriodMetrics,
} from "@/lib/profitAdmin/orderMetrics";
import { computeSnapchatAdSpendUsd } from "@/lib/profitAdmin/snapAdSpend";
import type { ProfitDashboardState } from "@/lib/profitAdmin/settingsRepository";

export type PeriodEconomics = {
  live: PeriodMetrics;
  paymentResult: ReturnType<typeof computePaymentPanel>;
  codResult: ReturnType<typeof buildCodPanelForPeriodWithLiveStatuses>["result"];
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
  const { input: codInput, result: codResult } = buildCodPanelForPeriodWithLiveStatuses(
    fromIso,
    toIso,
    fees,
    state.confirmationRatePct,
    state.deliveryRatePct,
  );
  const totalOrders = paymentResult.orderCount + codInput.totalOrders;
  const adSpendUsd = computeSnapchatAdSpendUsd(state.snapCpaUsd, totalOrders);
  const marketing = computeMarketingMetrics({ adSpendUsd, payment: paymentResult, cod: codResult });
  const totalProfitUsd = netProfitAfterAdSpend(
    paymentResult.profitUsd,
    codResult.profitUsd,
    adSpendUsd,
  );

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
