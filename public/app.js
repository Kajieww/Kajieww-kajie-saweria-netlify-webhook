const form = document.getElementById("triggerForm");
const result = document.getElementById("result");
const amountInput = document.getElementById("amountInput");
const healthBtn = document.getElementById("healthBtn");

document.querySelectorAll("[data-amount]").forEach((button) => {
  button.addEventListener("click", () => {
    amountInput.value = button.dataset.amount;
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  result.textContent = "Mengirim ke Roblox Open Cloud...";

  try {
    const payload = Object.fromEntries(new FormData(form).entries());

    const response = await fetch("/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    result.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    result.textContent = JSON.stringify({ ok: false, message: error.message }, null, 2);
  }
});

healthBtn.addEventListener("click", async () => {
  result.textContent = "Cek health...";
  try {
    const response = await fetch("/health");
    const data = await response.json().catch(() => ({}));
    result.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    result.textContent = JSON.stringify({ ok: false, message: error.message }, null, 2);
  }
});
