const app = document.getElementById("app");
app.innerHTML = "JS V5 LOADED";

const tg = window.Telegram?.WebApp;

if (tg) {
  tg.expand();
  app.innerHTML += "<br>Telegram detected";
} else {
  app.innerHTML += "<br>Telegram NOT detected";
}

const API_BASE = "https://privileged-marivel-chancefully.ngrok-free.dev";

async function boot() {
  try {
    app.innerHTML += "<br>Calling /health ...";

    const resp = await fetch(`${API_BASE}/health`, {
      method: "GET"
    });

    const text = await resp.text();

    app.innerHTML += `<br>Status: ${resp.status}`;
    app.innerHTML += `<br>Response: ${text}`;
  } catch (err) {
    app.innerHTML += `<br>ERROR: ${err.message}`;
  }

  const initData = tg?.initData || "";
  app.innerHTML += `<br>initData length: ${initData.length}`;
}

boot();
