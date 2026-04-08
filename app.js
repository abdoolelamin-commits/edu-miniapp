const tg = window.Telegram.WebApp;
tg.expand();

const API_BASE = "https://privileged-marivel-chancefully.ngrok-free.dev";

async function boot() {
  const app = document.getElementById("app");

  try {
    app.innerHTML = "<p>جارٍ التحقق...</p>";

    const resp = await fetch(`${API_BASE}/api/auth/telegram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        init_data: tg.initData
      })
    });

    const data = await resp.json();

    if (!resp.ok) {
      app.innerHTML = `
        <p>فشل التحقق</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `;
      return;
    }

    app.innerHTML = `
      <h3>تم التحقق بنجاح ✅</h3>
      <p><strong>الاسم:</strong> ${data.full_name || "غير معروف"}</p>
      <p><strong>حالة الاشتراك:</strong> ${data.subscription_status || "غير معروفة"}</p>
      <p><strong>القنوات:</strong> ${(data.channels || []).join(" ، ") || "لا توجد"}</p>
    `;
  } catch (err) {
    app.innerHTML = `
      <p>حصل خطأ أثناء الاتصال بالـ API</p>
      <pre>${err.message}</pre>
    `;
    console.error(err);
  }
}

boot();
