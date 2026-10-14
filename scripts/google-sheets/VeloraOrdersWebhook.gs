/**
 * Velora — append storefront orders to this spreadsheet.
 *
 * Setup (repeat for COD sheet and Card sheet):
 * 1. Create a Google Sheet; row 1 = headers (see HEADER below).
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. Project Settings → Script properties → add WEBHOOK_SECRET (same as Easypanel).
 * 4. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.
 * 5. Copy the Web app URL into Easypanel:
 *    - COD sheet URL → ORDERS_SHEETS_COD_WEBHOOK_URL
 *    - Card sheet URL → ORDERS_SHEETS_CARD_WEBHOOK_URL
 */

var HEADER = [
  "التاريخ (دبي)",
  "رقم الطلب",
  "الاسم",
  "الهاتف",
  "الإمارة",
  "العنوان",
  "البريد",
  "المنتجات",
  "المجموع الفرعي",
  "التوصيل",
  "الإجمالي",
  "الحالة",
  "Stripe PI",
  "تسويق",
];

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
    sheet.setFrozenRows(1);
  }
}

function jsonResponse_(obj, code) {
  var output = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
  // Apps Script Web App cannot set HTTP status; use body.ok / body.error.
  return output;
}

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var expectedSecret = props.getProperty("WEBHOOK_SECRET");
    if (!expectedSecret) {
      return jsonResponse_({ ok: false, error: "WEBHOOK_SECRET not configured" });
    }

    var body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    if (body.secret !== expectedSecret) {
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }

    var values = body.values;
    if (!values || !Array.isArray(values) || values.length !== HEADER.length) {
      return jsonResponse_({
        ok: false,
        error: "invalid values",
        expectedColumns: HEADER.length,
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    ensureHeader_(sheet);
    sheet.appendRow(values);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
