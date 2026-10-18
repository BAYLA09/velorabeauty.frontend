import {
  CARD_ORDERS_SHEET_HEADERS,
  VELORA_CARD_SHEET_GID,
  VELORA_CARD_SPREADSHEET_ID,
} from "@/lib/ordersSheets/cardSheetColumns";
import {
  COD_ORDERS_SHEET_HEADERS,
  VELORA_COD_SHEET_GID,
  VELORA_COD_SPREADSHEET_ID,
} from "@/lib/ordersSheets/codSheetColumns";
import type { OrdersSheetChannel } from "@/lib/ordersSheets/buildSheetRow";
import {
  readGoogleSheetsDirectConfig,
  resolveSheetTabTitle,
} from "@/lib/ordersSheets/googleSheetsDirect";

export type OrderSheetTarget = {
  channel: OrdersSheetChannel;
  /** Human-readable role in the app. */
  label: string;
  spreadsheetId: string;
  sheetGid: number;
  expectedHeaderColumns: readonly string[];
  /** Resolved from Google Sheets API when service-account read is enabled. */
  tabTitle: string | null;
};

const STATIC_TARGETS: Omit<OrderSheetTarget, "tabTitle">[] = [
  {
    channel: "cod",
    label: "COD orders (cash on delivery)",
    spreadsheetId: VELORA_COD_SPREADSHEET_ID,
    sheetGid: VELORA_COD_SHEET_GID,
    expectedHeaderColumns: COD_ORDERS_SHEET_HEADERS,
  },
  {
    channel: "card",
    label: "Card / Stripe paid orders",
    spreadsheetId: VELORA_CARD_SPREADSHEET_ID,
    sheetGid: VELORA_CARD_SHEET_GID,
    expectedHeaderColumns: CARD_ORDERS_SHEET_HEADERS,
  },
];

/** Where outbound export and inbound sync read/write — two workbooks/tabs (see gids). */
export function listOrderSheetTargetsStatic(): Omit<OrderSheetTarget, "tabTitle">[] {
  return STATIC_TARGETS.map((t) => ({ ...t }));
}

export async function listOrderSheetTargetsWithTabTitles(): Promise<OrderSheetTarget[]> {
  const direct = readGoogleSheetsDirectConfig();
  const out: OrderSheetTarget[] = [];

  for (const target of STATIC_TARGETS) {
    let tabTitle: string | null = null;
    if (direct.enabled) {
      const workbookId =
        target.channel === "card"
          ? (direct.cardSpreadsheetId ?? direct.spreadsheetId)
          : direct.spreadsheetId;
      const gid =
        target.channel === "card" && direct.cardSheetGid != null
          ? direct.cardSheetGid
          : direct.sheetGid;
      if (workbookId) {
        tabTitle = await resolveSheetTabTitle(workbookId, gid).catch(() => null);
      }
    }
    out.push({ ...target, tabTitle });
  }

  return out;
}
