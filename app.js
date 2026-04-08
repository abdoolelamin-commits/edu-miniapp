const app = document.getElementById("app");
const tg = window.Telegram?.WebApp;

if (tg) tg.expand();

const API_BASE = "https://privileged-marivel-chancefully.ngrok-free.dev";

async function boot() {
  try {
    app.innerHTML = `
      <p>VERSION: v6</p>
      <p>Preparing request...</p>
    `;

    const initData = tg?.initData || "";
    app.innerHTML += `<p>initData length: ${initData.length}</p>`;

    const resp = await fetch(`${API_BASE}/health`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    });

    const text = await resp.text();

    app.innerHTML += `<p>Status: ${resp.status}</p>`;
    app.innerHTML += `<pre>${text}</pre>`;
  } catch (err) {
    app.innerHTML += `<p>ERROR: ${err.message}</p>`;
    console.error(err);
  }
}

boot();
