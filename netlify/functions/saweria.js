const {
  json,
  parseBody,
  buildPayload,
  publicPayload,
  publishToRoblox
} = require("./_shared");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });

  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, message: "Method not allowed. Gunakan POST." });
  }

  try {
    const body = parseBody(event);

    const secret =
      event.queryStringParameters?.secret ||
      event.headers?.["x-webhook-secret"] ||
      event.headers?.["X-Webhook-Secret"] ||
      body.secret;

    if (!process.env.WEBHOOK_SECRET || secret !== process.env.WEBHOOK_SECRET) {
      return json(401, { ok: false, message: "Unauthorized. Secret salah." });
    }

    const payload = buildPayload(body, "SAWERIA_WEBHOOK");
    const result = await publishToRoblox(payload);

    return json(200, {
      ok: true,
      message: "Webhook Saweria diteruskan ke Roblox.",
      payload: publicPayload(payload),
      roblox: result
    });
  } catch (err) {
    return json(500, { ok: false, message: err.message || String(err) });
  }
};
