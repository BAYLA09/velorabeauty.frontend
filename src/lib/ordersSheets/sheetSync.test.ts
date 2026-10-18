import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseOrderSheetGrid } from "@/lib/ordersSheets/parseCodSheetRows";
import {
  isOrderEligibleForSheetSync,
  isSheetRowEligibleForSync,
} from "@/lib/ordersSheets/syncCutoff";
import {
  mapCardSheetStatusLabel,
  mapSheetStatusLabel,
} from "@/lib/ordersSheets/sheetStatusMapping";
import { listOrderSheetTargetsStatic } from "@/lib/ordersSheets/sheetTargets";
import {
  VELORA_CARD_SHEET_GID,
  VELORA_CARD_SPREADSHEET_ID,
} from "@/lib/ordersSheets/cardSheetColumns";
import {
  VELORA_COD_SHEET_GID,
  VELORA_COD_SPREADSHEET_ID,
} from "@/lib/ordersSheets/codSheetColumns";

describe("order sheet targets", () => {
  it("maps COD export to COD workbook gid and card export to card workbook gid", () => {
    const targets = listOrderSheetTargetsStatic();
    const cod = targets.find((t) => t.channel === "cod");
    const card = targets.find((t) => t.channel === "card");
    assert.equal(cod?.spreadsheetId, VELORA_COD_SPREADSHEET_ID);
    assert.equal(cod?.sheetGid, VELORA_COD_SHEET_GID);
    assert.equal(card?.spreadsheetId, VELORA_CARD_SPREADSHEET_ID);
    assert.equal(card?.sheetGid, VELORA_CARD_SHEET_GID);
  });
});

describe("sheet sync cutoff", () => {
  const cutoff = "2026-10-18T12:00:00.000Z";

  it("skips rows and orders before cutoff", () => {
    assert.equal(isSheetRowEligibleForSync("2026-10-18T11:59:59.000Z", cutoff), false);
    assert.equal(isSheetRowEligibleForSync("2026-10-18T12:00:00.000Z", cutoff), true);
    assert.equal(isOrderEligibleForSheetSync("2026-10-17T00:00:00.000Z", cutoff), false);
    assert.equal(isOrderEligibleForSheetSync("2026-10-18T12:00:00.000Z", cutoff), true);
  });
});

describe("sheet status mapping", () => {
  it("maps COD and card labels", () => {
    assert.equal(mapSheetStatusLabel("No answer"), "no_answer");
    assert.equal(mapSheetStatusLabel("Confirmé"), "confirmed");
    assert.equal(mapCardSheetStatusLabel("Refunded"), "refunded");
    assert.equal(mapCardSheetStatusLabel("paid"), "delivered");
  });
});

describe("parse order sheet grid", () => {
  it("reads status column for both channels", () => {
    const headers = ["OrderDate", "name", "phone", "notes", "status"];
    const rows = [
      [
        "2026-10-18 14:00:00",
        "Test",
        "+971500000000",
        "orderId=abc-123",
        "delivered",
      ],
    ];
    const cod = parseOrderSheetGrid(headers, rows, "cod");
    assert.equal(cod[0]?.status, "delivered");
    const card = parseOrderSheetGrid(headers, rows, "card");
    assert.equal(card[0]?.status, "delivered");
  });
});
