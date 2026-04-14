const tg = window.Telegram?.WebApp;
const app = document.getElementById("app");

const API_BASE = "https://tahiredu.duckdns.org";

if (tg) {
  tg.ready();
  tg.expand();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderLoading() {
  app.innerHTML = `
    <div style="padding:20px;font-family:sans-serif;direction:rtl">
      <h3>منصة الدروس</h3>
      <p>جارٍ تحميل بياناتك...</p>
    </div>
  `;
}

function renderError(message) {
  app.innerHTML = `
    <div style="padding:20px;font-family:sans-serif;direction:rtl">
      <h3>منصة الدروس</h3>
      <p style="color:#b00020;">${escapeHtml(message)}</p>
    </div>
  `;
}

function renderStudent(data) {
  const channels = Array.isArray(data.channels) ? data.channels : [];
  const channelsHtml = channels.length
    ? `<ul>${channels.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>`
    : `<p>لا توجد قنوات مرتبطة بحسابك حاليًا.</p>`;

  const statusText =
    data.subscription_status === "active" ? "✅ اشتراكك فعال" : "❌ لا يوجد اشتراك فعال";

  app.innerHTML = `
    <div style="padding:20px;font-family:sans-serif;direction:rtl;line-height:1.8">
      <h2 style="margin-top:0;">منصة الدروس</h2>

      <div style="padding:14px;border:1px solid #ddd;border-radius:12px;margin-bottom:16px;">
        <div><strong>الاسم:</strong> ${escapeHtml(data.full_name || "طالب")}</div>
        <div><strong>اسم المستخدم:</strong> ${escapeHtml(data.username || "-")}</div>
        <div><strong>Telegram ID:</strong> ${escapeHtml(data.telegram_id || "-")}</div>
        <div><strong>الحالة:</strong> ${statusText}</div>
      </div>

      <div style="padding:14px;border:1px solid #ddd;border-radius:12px;">
        <h3 style="margin-top:0;">القنوات المتاحة</h3>
        ${channelsHtml}
      </div>
    </div>
  `;
}

async function boot() {
  renderLoading();

  try {
    if (!tg) {
      renderError("يجب فتح المنصة من داخل تيليجرام.");
      return;
    }

    const initData = tg.initData || "";
    if (!initData) {
      renderError("تعذر التحقق من جلسة تيليجرام. افتح المنصة من زر البوت مباشرة.");
      return;
    }

    const resp = await fetch(`${API_BASE}/api/auth/telegram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        init_data: initData,
      }),
    });

    const text = await resp.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      renderError("رد غير متوقع من السيرفر.");
      return;
    }

    if (!resp.ok) {
      renderError(data.detail || "تعذر تحميل بياناتك.");
      return;
    }

    renderStudent(data);
  } catch (err) {
    renderError(`تعذر الاتصال بالسيرفر: ${err.message}`);
  }
}

boot();
