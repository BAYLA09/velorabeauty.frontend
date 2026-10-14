export function isAppsScriptWebhookSuccess(
  res: { ok: boolean; status: number },
  text: string,
): boolean {
  let parsed: { ok?: boolean; error?: string; duplicate?: boolean } | null = null;
  try {
    parsed = JSON.parse(text) as { ok?: boolean; error?: string; duplicate?: boolean };
  } catch {
    parsed = null;
  }
  if (parsed?.ok === true || parsed?.duplicate === true) return true;
  if (parsed?.ok === false) {
    console.error("[orders-sheets] webhook rejected", parsed.error);
    return false;
  }
  if (!res.ok) {
    console.error("[orders-sheets] webhook failed", {
      status: res.status,
      body: text.slice(0, 200),
    });
    return false;
  }
  console.error("[orders-sheets] webhook non-json or missing ok", {
    status: res.status,
    body: text.slice(0, 200),
  });
  return false;
}
