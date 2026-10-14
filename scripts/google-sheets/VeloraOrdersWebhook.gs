/**
 * Velora COD orders → Google Sheet (VeloraOrdersWebhook.gs)
 *
 * Bind this project to your spreadsheet OR set Script properties:
 *   WEBHOOK_SECRET     — same as Easypanel ORDERS_SHEETS_WEBHOOK_SECRET
 *   SPREADSHEET_ID     — optional (default: active spreadsheet)
 *   SHEET_GID          — optional tab gid from URL (#gid=469291840)
 *
 * Deploy → Web app → Execute as: Me → Who has access: Anyone
 * Easypanel → ORDERS_SHEETS_COD_WEBHOOK_URL = deployment URL (/exec)
 */

var COD_HEADER = [
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
];

var NOTES_COL = 12; // 1-based column index for "notes" (orderId=…)

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getTargetSheet_() {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId = props.getProperty("SPREADSHEET_ID");
  var gid = props.getProperty("SHEET_GID");
  var ss = spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Spreadsheet not found");

  if (gid) {
    var targetGid = Number(gid);
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getSheetId() === targetGid) return sheets[i];
    }
    throw new Error("Sheet gid not found: " + gid);
  }
  return ss.getSheets()[0];
}

function orderAlreadyExported_(sheet, orderId) {
  if (!orderId) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var needle = "orderId=" + orderId;
  var notesRange = sheet.getRange(2, NOTES_COL, lastRow, NOTES_COL);
  var values = notesRange.getValues();
  for (var r = 0; r < values.length; r++) {
    var cell = String(values[r][0] || "");
    if (cell.indexOf(needle) !== -1) return true;
  }
  return false;
}

function appendCodOrder_(sheet, orderId, rows) {
  if (orderAlreadyExported_(sheet, orderId)) {
    return { ok: true, duplicate: true };
  }
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (!row || row.length !== COD_HEADER.length) {
      return { ok: false, error: "invalid row width", expectedColumns: COD_HEADER.length };
    }
    sheet.appendRow(row);
  }
  return { ok: true };
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

    var sheet = getTargetSheet_();

    if (body.channel === "cod" && body.rows && body.orderId) {
      return jsonResponse_(appendCodOrder_(sheet, String(body.orderId), body.rows));
    }

    // Legacy single-row payload (e.g. card sheet)
    var values = body.values;
    if (values && Array.isArray(values)) {
      sheet.appendRow(values);
      return jsonResponse_({ ok: true });
    }

    return jsonResponse_({ ok: false, error: "invalid payload" });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
