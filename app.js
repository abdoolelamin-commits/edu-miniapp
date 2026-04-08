const tg = window.Telegram.WebApp;
tg.expand();

const API_BASE = "https://privileged-marivel-chancefully.ngrok-free.dev";

async function boot() {
  const app = document.getElementById("app");

  try {
    app.innerHTML = "<p>جارٍ التحقق...</p>";

    const initData = tg.initData || "";
    console.log("initData:", initData);

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
    console.log("raw response:", text);

    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      app.innerHTML = `<p>رد غير متوقع من السيرفر:</p><pre>${text}</pre>`;
      return;
    }

    if (!resp.ok) {
      app.innerHTML = `<p>فشل التحقق: ${data.detail || "خطأ غير معروف"}</p>`;
      return;
    }

    app.innerHTML = `
      <h3>مرحباً ${data.full_name || "طالب"}</h3>
      <p>حالة الاشتراك: ${data.subscription_status || "غير معروف"}</p>
      <p>القنوات المتاحة: ${(data.channels || []).join(" ، ") || "لا توجد"}</p>
    `;
  } catch (err) {
    console.error("fetch error:", err);
    app.innerHTML = `<p>تعذر الاتصال بالسيرفر: ${err.message}</p>`;
  }
}

boot();
