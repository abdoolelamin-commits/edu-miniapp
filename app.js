const API_BASE = "https://privileged-marivel-chancefully.ngrok-free.dev";

fetch(`${API_BASE}/api/auth/telegram`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    init_data: window.Telegram.WebApp.initData
  })
})
  .then(res => res.json())
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error("API error:", err);
  });
