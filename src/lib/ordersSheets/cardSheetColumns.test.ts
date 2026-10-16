import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CARD_ORDERS_SHEET_COLUMN_COUNT,
  CARD_ORDERS_SHEET_HEADERS,
} from "./cardSheetColumns.ts";

describe("cardSheetColumns", () => {
  it("matches the live card orders sheet header row", () => {
    assert.equal(CARD_ORDERS_SHEET_COLUMN_COUNT, 18);
    assert.equal(CARD_ORDERS_SHEET_HEADERS[15], "utm_term");
    assert.equal(CARD_ORDERS_SHEET_HEADERS[16], "utm_content");
    assert.equal(CARD_ORDERS_SHEET_HEADERS[17], "national_address");
  });
});
