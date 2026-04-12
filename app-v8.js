const app = document.getElementById("app");
app.innerHTML = "JS V9 LOADED";

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
    app.innerHTML += "<br>Calling /api/auth/telegram ...";

    const resp = await fetch(`${API_BASE}/api/auth/telegram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        init_data: initData
      })
    });

    const text = await resp.text();

    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      app.innerHTML += `<br>Non-JSON response: ${text}`;
      return;
    }

    if (!resp.ok) {
      app.innerHTML += `<br>ERROR STATUS: ${resp.status}`;
      app.innerHTML += `<br>DETAIL: ${data.detail || "Unknown error"}`;
      return;
    }

    app.innerHTML = `
      <h3>مرحباً ${data.full_name || "طالب"}</h3>
      <p>Telegram ID: ${data.telegram_id}</p>
      <p>Username: ${data.username || "-"}</p>
      <p>حالة الاشتراك: ${data.subscription_status || "-"}</p>
      <p>القنوات المتاحة: ${(data.channels || []).join(" ، ") || "لا توجد"}</p>
    `;
  } catch (err) {
    app.innerHTML += `<br>FETCH ERROR: ${err.message}`;
    console.error(err);
  }
}

boot();
