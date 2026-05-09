exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return json(405, {
      ok: false,
      message: "Method not allowed. Gunakan POST."
    });
  }

  try {
    const body = parseBody(event);

    if (!process.env.ADMIN_PIN || body.pin !== process.env.ADMIN_PIN) {
      return json(401, {
        ok: false,
        message: "PIN salah."
      });
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
    return json(500, {
      ok: false,
      message: err.message || String(err)
    });
  }
};

function parseBody(event) {
  const raw = event.body || "{}";

  const contentType = String(
    event.headers["content-type"] ||
    event.headers["Content-Type"] ||
    ""
  ).toLowerCase();

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(raw));
  }

  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

function cleanText(value, fallback = "") {
  const text = String(value ?? fallback)
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .trim();

  return (text || fallback || "").slice(0, 80);
}

function parseAmount(value) {
  const raw = String(value ?? "").replace(/[^\d]/g, "");
  const amount = Number(raw);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  return Math.floor(amount);
}

function buildPayload(input, source) {
  const donorName = cleanText(
    input.donorName ||
      input.DonorName ||
      input.username ||
      input.name ||
      input.donator_name ||
      input.donatorName ||
      input.sender ||
      "WebDonor",
    "WebDonor"
  );

  const targetName = cleanText(
    input.targetName ||
      input.TargetName ||
      input.robloxUsername ||
      input.username ||
      donorName,
    donorName
  );

  const amount = parseAmount(
    input.amount ||
      input.Amount ||
      input.rupiah ||
      input.Rupiah ||
      input.value ||
      input.Value
  );

  const message = cleanText(
    input.message ||
      input.Message ||
      input.note ||
      input.Note ||
      "Donation from Netlify Web",
    "Donation from Netlify Web"
  );

  const receiver = cleanText(
    process.env.DEFAULT_RECEIVER_NAME || "SOUTHEAST EARTH",
    "SOUTHEAST EARTH"
  );

  if (amount <= 0) {
    throw new Error("Amount tidak valid.");
  }

  return {
    DonorName: donorName,
    DisplayName: donorName,

    TargetName: targetName,
    Username: targetName,
    PlayerName: targetName,

    ReceiverName: receiver,

    Amount: amount,
    Rupiah: amount,
    Value: amount,

    Message: message,
    Currency: "IDR",
    Source: source,
    CreatedAt: Date.now()
  };
}

function publicPayload(payload) {
  return {
    DonorName: payload.DonorName,
    TargetName: payload.TargetName,
    Amount: payload.Amount,
    Message: payload.Message,
    Source: payload.Source
  };
}

async function publishToRoblox(payload) {
  const apiKey = process.env.ROBLOX_API_KEY;
  const universeId = process.env.ROBLOX_UNIVERSE_ID;
  const topic = process.env.ROBLOX_TOPIC || "SaweriaDonation";

  if (!apiKey) {
    throw new Error("ROBLOX_API_KEY belum diisi di Netlify Environment Variables.");
  }

  if (!universeId) {
    throw new Error("ROBLOX_UNIVERSE_ID belum diisi di Netlify Environment Variables.");
  }

  const url = `https://apis.roblox.com/cloud/v2/universes/${encodeURIComponent(
    universeId
  )}:publishMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      topic: topic,
      message: JSON.stringify(payload)
    })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Roblox Open Cloud error ${response.status}: ${text || response.statusText}`
    );
  }

  return {
    ok: true,
    status: response.status,
    response: text
  };
}

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
