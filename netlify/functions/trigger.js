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

    if (!process.env.ADMIN_PIN || body.pin !== process.env.ADMIN_PIN) {
      return json(401, { ok: false, message: "PIN salah." });
    }

    const payload = buildPayload(body, "NETLIFY_WEB_TRIGGER");
    const result = await publishToRoblox(payload);

    return json(200, {
      ok: true,
      message: "Terkirim ke Roblox.",
      payload: publicPayload(payload),
      roblox: result
    });
  } catch (err) {
    return json(500, { ok: false, message: err.message || String(err) });
  }
};
