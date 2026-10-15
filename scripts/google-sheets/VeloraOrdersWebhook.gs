/**
 * Velora orders → Google Sheet (COD + paid card)
 *
 * Script properties:
 *   WEBHOOK_SECRET   — same as Easypanel ORDERS_SHEETS_WEBHOOK_SECRET
 *   SPREADSHEET_ID   — optional (default: bound spreadsheet)
 *   SHEET_GID        — COD tab (#gid=…)
 *   CARD_SHEET_GID   — paid card tab (#gid=…)
 *
 * Deploy → Web app → Execute as: Me → Who has access: Anyone
 * Easypanel:
 *   ORDERS_SHEETS_COD_WEBHOOK_URL  = /exec URL
 *   ORDERS_SHEETS_CARD_WEBHOOK_URL = same /exec URL (optional; routes by channel)
 */

var DEFAULT_SHEET_GID = 469291840;

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

var NOTES_COL = 12;

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function openSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId = props.getProperty("SPREADSHEET_ID");
  var ss = spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Spreadsheet not found");
  return ss;
}

function getSheetByGid_(gidString) {
  var ss = openSpreadsheet_();
  var targetGid = Number(gidString);
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === targetGid) return sheets[i];
  }
  throw new Error("Sheet gid not found: " + gidString);
}

function getTargetSheet_(channel) {
  var props = PropertiesService.getScriptProperties();
  if (channel === "card") {
    var cardGid = props.getProperty("CARD_SHEET_GID");
    if (cardGid) return getSheetByGid_(cardGid);
    throw new Error("CARD_SHEET_GID not configured");
  }
  var gidProp = props.getProperty("SHEET_GID");
  var gid = gidProp !== null && gidProp !== "" ? gidProp : String(DEFAULT_SHEET_GID);
  return getSheetByGid_(gid);
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

function doGet() {
  return jsonResponse_({ ok: true, service: "velora-orders-webhook" });
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

    var channel = body.channel === "card" ? "card" : "cod";

    if ((channel === "cod" || channel === "card") && body.rows && body.orderId) {
      var sheet = getTargetSheet_(channel);
      return jsonResponse_(appendCodOrder_(sheet, String(body.orderId), body.rows));
    }

    var values = body.values;
    if (values && Array.isArray(values)) {
      var legacySheet = getTargetSheet_(channel);
      legacySheet.appendRow(values);
      return jsonResponse_({ ok: true });
    }

    return jsonResponse_({ ok: false, error: "invalid payload" });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
