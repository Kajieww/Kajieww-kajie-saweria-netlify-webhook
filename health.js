exports.handler = async () => {
  return json(200, {
    ok: true,
    service: "kajie-saweria-netlify-webhook",
    topic: process.env.ROBLOX_TOPIC || "SaweriaDonation",
    hasApiKey: Boolean(process.env.ROBLOX_API_KEY),
    hasUniverseId: Boolean(process.env.ROBLOX_UNIVERSE_ID)
  });
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, x-webhook-secret",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    },
    body: JSON.stringify(body)
  };
}
