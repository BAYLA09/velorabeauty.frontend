/** Must match row 1 of the Velora card (Stripe) Google Sheet — tab gid=1628433865. */
export const CARD_ORDERS_SHEET_HEADERS = [
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
  "utm_term",
  "utm_content",
  "national_address",
] as const;

export const CARD_ORDERS_SHEET_COLUMN_COUNT = CARD_ORDERS_SHEET_HEADERS.length;

/** Spreadsheet ID from the card orders workbook URL. */
export const VELORA_CARD_SPREADSHEET_ID = "1paLygQEeE3V6kUVd4PP60v_xhpKp4e7Xu_UK3L5y32A";

/** Tab gid from the card sheet URL (#gid=…). */
export const VELORA_CARD_SHEET_GID = 1628433865;
