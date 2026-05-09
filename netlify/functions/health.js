const { json, envStatus } = require("./_shared");

exports.handler = async () => {
  return json(200, {
    ok: true,
    service: "kajie-saweria-netlify-webhook-final",
    version: "2.0.0",
    endpoint: "cloud-v2-publishMessage",
    env: envStatus(),
    now: new Date().toISOString()
  });
};
