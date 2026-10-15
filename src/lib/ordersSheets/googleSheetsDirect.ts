import { JWT } from "google-auth-library";
import {
  VELORA_COD_SHEET_GID,
  VELORA_COD_SPREADSHEET_ID,
} from "@/lib/ordersSheets/codSheetColumns";

export type GoogleSheetsDirectConfig = {
  enabled: boolean;
  spreadsheetId: string | null;
  sheetGid: number;
  cardSpreadsheetId: string | null;
  cardSheetGid: number | null;
  clientEmail: string | null;
  reason?: string;
};

type ServiceAccountJson = {
  client_email?: string;
  private_key?: string;
};

let cachedSheetTitle: { gid: number; spreadsheetId: string; title: string } | null = null;

function parseServiceAccountJson(raw: string): ServiceAccountJson | null {
  try {
    const parsed = JSON.parse(raw) as ServiceAccountJson;
    if (!parsed.client_email?.trim() || !parsed.private_key?.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Rejects Apps Script deployment ids mistakenly pasted as spreadsheet id. */
export function isLikelyGoogleSpreadsheetId(id: string): boolean {
  const t = id.trim();
  if (!t || t.startsWith("AKfyc")) return false;
  return t.length >= 20;
}

export function readGoogleSheetsDirectConfig(): GoogleSheetsDirectConfig {
  const rawJson =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() ||
    process.env.ORDERS_SHEETS_SERVICE_ACCOUNT_JSON?.trim() ||
    null;

  const spreadsheetIdRaw =
    process.env.ORDERS_SHEETS_SPREADSHEET_ID?.trim() ||
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() ||
    VELORA_COD_SPREADSHEET_ID;

  const sheetGid = Number.parseInt(
    process.env.ORDERS_SHEETS_SHEET_GID?.trim() ||
      process.env.SHEET_GID?.trim() ||
      String(VELORA_COD_SHEET_GID),
    10,
  );

  const cardGidRaw =
    process.env.ORDERS_SHEETS_CARD_SHEET_GID?.trim() ||
    process.env.CARD_SHEET_GID?.trim() ||
    "";
  const cardSheetGidParsed = cardGidRaw ? Number.parseInt(cardGidRaw, 10) : NaN;
  const cardSheetGid = Number.isFinite(cardSheetGidParsed) ? cardSheetGidParsed : null;

  const cardSpreadsheetIdRaw =
    process.env.ORDERS_SHEETS_CARD_SPREADSHEET_ID?.trim() ||
    process.env.CARD_SPREADSHEET_ID?.trim() ||
    "";
  const cardSpreadsheetId = isLikelyGoogleSpreadsheetId(cardSpreadsheetIdRaw)
    ? cardSpreadsheetIdRaw
    : null;

  if (!rawJson) {
    return {
      enabled: false,
      spreadsheetId: null,
      sheetGid,
      cardSpreadsheetId,
      cardSheetGid,
      clientEmail: null,
      reason: "missing_service_account_json",
    };
  }

  const sa = parseServiceAccountJson(rawJson);
  if (!sa) {
    return {
      enabled: false,
      spreadsheetId: null,
      sheetGid,
      cardSpreadsheetId,
      cardSheetGid,
      clientEmail: null,
      reason: "invalid_service_account_json",
    };
  }

  if (!isLikelyGoogleSpreadsheetId(spreadsheetIdRaw)) {
    return {
      enabled: false,
      spreadsheetId: spreadsheetIdRaw,
      sheetGid,
      cardSpreadsheetId,
      cardSheetGid,
      clientEmail: sa.client_email ?? null,
      reason: "invalid_spreadsheet_id",
    };
  }

  return {
    enabled: true,
    spreadsheetId: spreadsheetIdRaw,
    sheetGid: Number.isFinite(sheetGid) ? sheetGid : VELORA_COD_SHEET_GID,
    cardSpreadsheetId,
    cardSheetGid,
    clientEmail: sa.client_email ?? null,
  };
}

async function getAccessToken(): Promise<string> {
  const rawJson =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() ||
    process.env.ORDERS_SHEETS_SERVICE_ACCOUNT_JSON?.trim();
  if (!rawJson) throw new Error("missing service account json");

  const sa = parseServiceAccountJson(rawJson);
  if (!sa?.client_email || !sa.private_key) throw new Error("invalid service account json");

  const client = new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const token = await client.getAccessToken();
  if (!token.token) throw new Error("no access token");
  return token.token;
}

async function resolveSheetTitle(
  spreadsheetId: string,
  sheetGid: number,
  token: string,
): Promise<string> {
  if (
    cachedSheetTitle &&
    cachedSheetTitle.spreadsheetId === spreadsheetId &&
    cachedSheetTitle.gid === sheetGid
  ) {
    return cachedSheetTitle.title;
  }

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets(properties(sheetId,title))`,
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15_000),
    },
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`sheets metadata ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = JSON.parse(text) as {
    sheets?: { properties?: { sheetId?: number; title?: string } }[];
  };
  const match = data.sheets?.find((s) => s.properties?.sheetId === sheetGid);
  const title = match?.properties?.title?.trim();
  if (!title) throw new Error(`sheet gid not found: ${sheetGid}`);
  cachedSheetTitle = { gid: sheetGid, spreadsheetId, title };
  return title;
}

/** Append COD/card rows via Google Sheets API (no Apps Script). */
export async function appendCodRowsViaGoogleSheetsApi(
  config: GoogleSheetsDirectConfig,
  rows: (string | number)[][],
  channel: "cod" | "card" = "cod",
): Promise<boolean> {
  if (!config.enabled || !config.spreadsheetId || rows.length === 0) return false;

  const spreadsheetId =
    channel === "card" && config.cardSpreadsheetId
      ? config.cardSpreadsheetId
      : config.spreadsheetId;
  if (!spreadsheetId) return false;

  const gid =
    channel === "card" && config.cardSheetGid != null ? config.cardSheetGid : config.sheetGid;
  if (channel === "card" && !config.cardSpreadsheetId && config.cardSheetGid == null) {
    console.error(
      "[orders-sheets] card export needs ORDERS_SHEETS_CARD_SPREADSHEET_ID and/or ORDERS_SHEETS_CARD_SHEET_GID",
    );
    return false;
  }

  const token = await getAccessToken();
  const title = await resolveSheetTitle(spreadsheetId, gid, token);
  const range = `'${title.replace(/'/g, "''")}'!A:Q`;

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: rows }),
      signal: AbortSignal.timeout(20_000),
    },
  );
  const text = await res.text();
  if (!res.ok) {
    console.error("[orders-sheets] google api append failed", {
      status: res.status,
      body: text.slice(0, 300),
    });
    return false;
  }
  return true;
}
