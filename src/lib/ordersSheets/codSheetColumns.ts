/** Must match row 1 of the Velora COD Google Sheet (tab gid=469291840). */
export const COD_ORDERS_SHEET_HEADERS = [
  "OrderDate",
  "country",
  "name",
  "phone",
  "address",
  "url",
  "sku",
  "Product",
  "quantity",
  "price",
  "currency",
  "notes",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type CodOrdersSheetHeader = (typeof COD_ORDERS_SHEET_HEADERS)[number];

export const COD_ORDERS_SHEET_COLUMN_COUNT = COD_ORDERS_SHEET_HEADERS.length;

/** Spreadsheet ID (for docs / Apps Script property) — not required in Easypanel when script is bound to the sheet. */
export const VELORA_COD_SPREADSHEET_ID = "1nasdcXYD5ihxj5QnGMWQ05ug3VqoVfgP8R9ojBnsjXQ";

/** Tab gid from the sheet URL (#gid=…). */
export const VELORA_COD_SHEET_GID = 469291840;
