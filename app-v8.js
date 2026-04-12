const app = document.getElementById("app");
app.innerHTML = "JS V10 LOADED";

const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
  app.innerHTML += "<br>Telegram WebApp detected";
} else {
  app.innerHTML += "<br>Telegram WebApp NOT detected";
}

const API_BASE = "https://publishers-following-brake-laid.trycloudflare.com";

async function boot() {
  const initData = tg?.initData || "";
  app.innerHTML += `<br>initData length: ${initData.length}`;

  try {
    app.innerHTML += "<br>Testing GET /health ...";
    const healthResp = await fetch(`${API_BASE}/health`, {
      method: "GET",
      mode: "cors"
    });
    const healthText = await healthResp.text();
    app.innerHTML += `<br>/health status: ${healthResp.status}`;
    app.innerHTML += `<br>/health response: ${healthText}`;
  } catch (err) {
    app.innerHTML += `<br>/health ERROR: ${err.message}`;
    return;
  }

  try {
    app.innerHTML += "<br>Testing POST /api/auth/telegram ...";
    const resp = await fetch(`${API_BASE}/api/auth/telegram`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        init_data: initData
      })
    });

    const text = await resp.text();
    app.innerHTML += `<br>/auth status: ${resp.status}`;
    app.innerHTML += `<br>/auth response: ${text}`;
  } catch (err) {
    app.innerHTML += `<br>/auth ERROR: ${err.message}`;
  }
}

boot();
