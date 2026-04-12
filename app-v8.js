const app = document.getElementById("app");
app.innerHTML = "JS V8 LOADED";

const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
  app.innerHTML += "<br>Telegram WebApp detected";
} else {
  app.innerHTML += "<br>Telegram WebApp NOT detected";
}

const API_BASE = "https://stuck-harold-may-beans.trycloudflare.com";

async function boot() {
  try {
    const initData = tg?.initData || "";
    app.innerHTML += `<br>initData length: ${initData.length}`;
    app.innerHTML += "<br>Calling /health ...";

    const resp = await fetch(`${API_BASE}/health`, {
      method: "GET"
    });

    const text = await resp.text();

    app.innerHTML += `<br>Status: ${resp.status}`;
    app.innerHTML += `<br>Response: ${text}`;
  } catch (err) {
    app.innerHTML += `<br>ERROR: ${err.message}`;
    console.error(err);
  }
}

boot();
