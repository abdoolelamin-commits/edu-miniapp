const app = document.getElementById("app");
app.innerHTML = "JS LOADED v3";

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  app.innerHTML += "<br>Telegram WebApp detected";
} else {
  app.innerHTML += "<br>Telegram WebApp NOT detected";
}

const API_BASE = "https://privileged-marivel-chancefully.ngrok-free.dev";

async function boot() {
  try {
    app.innerHTML += "<br>Preparing request...";

    const initData = tg?.initData || "";
    app.innerHTML += `<br>initData length: ${initData.length}`;

    const resp = await fetch(`${API_BASE}/health`, {
      method: "GET"
    });

    app.innerHTML += `<br>HTTP status: ${resp.status}`;

    const text = await resp.text();
    app.innerHTML += `<br>Response: ${text}`;
  } catch (err) {
    app.innerHTML += `<br>ERROR: ${err.message}`;
  }
}

boot();
