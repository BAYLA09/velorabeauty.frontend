/**
 * Velora orders → Google Sheet (COD + paid card)
 *
 * Script properties:
 *   WEBHOOK_SECRET   — same as Easypanel ORDERS_SHEETS_WEBHOOK_SECRET
 *   SPREADSHEET_ID   — optional (default: bound spreadsheet)
 *   SHEET_GID            — COD tab (#gid=…)
 *   CARD_SPREADSHEET_ID  — optional second workbook for card (else CARD_SHEET_GID tab in COD file)
 *   CARD_SHEET_GID       — card tab gid (optional if card file has one tab)
 *
 * Deploy → Web app → Execute as: Me → Who has access: Anyone
 * Easypanel:
 *   ORDERS_SHEETS_COD_WEBHOOK_URL  = /exec URL
 *   ORDERS_SHEETS_CARD_WEBHOOK_URL = same /exec URL (optional; routes by channel)
 */

var DEFAULT_SHEET_GID = 469291840;
var DEFAULT_CARD_SPREADSHEET_ID = "1paLygQEeE3V6kUVd4PP60v_xhpKp4e7Xu_UK3L5y32A";
var DEFAULT_CARD_SHEET_GID = 1628433865;

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

var CARD_HEADER = [
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
];

var NOTES_COL = 12;

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function openSpreadsheet_(spreadsheetIdOverride) {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId =
    spreadsheetIdOverride || props.getProperty("SPREADSHEET_ID");
  var ss = spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Spreadsheet not found");
  return ss;
}

function findSheetByGid_(ss, gidString) {
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
    var cardWorkbookId =
      props.getProperty("CARD_SPREADSHEET_ID") || DEFAULT_CARD_SPREADSHEET_ID;
    var ss = openSpreadsheet_(cardWorkbookId || null);
    var cardGid = props.getProperty("CARD_SHEET_GID") || String(DEFAULT_CARD_SHEET_GID);
    if (cardGid) return findSheetByGid_(ss, cardGid);
    var sheetGid = props.getProperty("SHEET_GID");
    if (sheetGid) return findSheetByGid_(ss, sheetGid);
    return ss.getSheets()[0];
  }
  var gidProp = props.getProperty("SHEET_GID");
  var gid = gidProp !== null && gidProp !== "" ? gidProp : String(DEFAULT_SHEET_GID);
  return findSheetByGid_(openSpreadsheet_(null), gid);
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

function appendOrderRows_(sheet, orderId, rows, expectedColumns) {
  if (orderAlreadyExported_(sheet, orderId)) {
    return { ok: true, duplicate: true };
  }
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (!row || row.length !== expectedColumns) {
      return { ok: false, error: "invalid row width", expectedColumns: expectedColumns };
    }
    sheet.appendRow(row);
  }
  return { ok: true };
}

function appendCodOrder_(sheet, orderId, rows) {
  return appendOrderRows_(sheet, orderId, rows, COD_HEADER.length);
}

function appendCardOrder_(sheet, orderId, rows) {
  if (!rows || !rows.length) {
    return { ok: false, error: "empty rows" };
  }
  var width = rows[0].length;
  if (width !== COD_HEADER.length && width !== CARD_HEADER.length) {
    return {
      ok: false,
      error: "invalid row width",
      expectedColumns: COD_HEADER.length + " or " + CARD_HEADER.length,
    };
  }
  return appendOrderRows_(sheet, orderId, rows, width);
}

function resolveSheetForPost_(channel, body) {
  if (body.spreadsheetId || body.sheetGid) {
    var ss = openSpreadsheet_(body.spreadsheetId || null);
    if (body.sheetGid) return findSheetByGid_(ss, String(body.sheetGid));
    return ss.getSheets()[0];
  }
  return getTargetSheet_(channel);
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
      var sheet = resolveSheetForPost_(channel, body);
      var result =
        channel === "card"
          ? appendCardOrder_(sheet, String(body.orderId), body.rows)
          : appendCodOrder_(sheet, String(body.orderId), body.rows);
      return jsonResponse_(result);
    }

    var values = body.values;
    if (values && Array.isArray(values)) {
      var legacySheet = resolveSheetForPost_(channel, body);
      legacySheet.appendRow(values);
      return jsonResponse_({ ok: true });
    }

    return jsonResponse_({ ok: false, error: "invalid payload" });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
