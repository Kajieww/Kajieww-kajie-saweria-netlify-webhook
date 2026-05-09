const form = document.getElementById("triggerForm");
const result = document.getElementById("result");
const amountInput = document.getElementById("amountInput");
const healthStatus = document.getElementById("healthStatus");

for (const btn of document.querySelectorAll("[data-amount]")) {
  btn.addEventListener("click", () => {
    amountInput.value = btn.dataset.amount;
  });
}

async function checkHealth() {
  try {
    const res = await fetch("/health");
    const json = await res.json();
    healthStatus.textContent = json.ok ? "Online" : "Check failed";
  } catch {
    healthStatus.textContent = "Offline";
  }
}

checkHealth();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  result.textContent = "Mengirim ke Roblox...";

  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch("/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await response.json().catch(() => ({}));
    result.textContent = JSON.stringify(json, null, 2);
  } catch (err) {
    result.textContent = JSON.stringify({ ok: false, message: err.message }, null, 2);
  }
});
