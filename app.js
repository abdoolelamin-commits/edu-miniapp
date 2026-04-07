const tg = window.Telegram.WebApp;
tg.expand();

function getDeviceFingerprint() {
  const raw = [
    navigator.userAgent || "",
    navigator.language || "",
    screen.width || "",
    screen.height || "",
    Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  ].join("|");

  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return "dev_" + Math.abs(hash);
}

async function boot() {
  const statusEl = document.getElementById("status");
  const contentEl = document.getElementById("content");

  try {
    const initData = tg.initData;
    if (!initData) {
      statusEl.textContent = "يجب فتح هذه الصفحة من داخل تيليجرام.";
      return;
    }

    const authResp = await fetch("/api/auth/telegram", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        init_data: initData,
        device_fingerprint: getDeviceFingerprint(),
      })
    });

    const authData = await authResp.json();
    if (!authResp.ok) {
      statusEl.textContent = authData.detail || "فشل التحقق";
      return;
    }

    const meResp = await fetch("/api/me", {
      headers: {
        "Authorization": "Bearer " + authData.session_token
      }
    });

    const me = await meResp.json();
    if (!meResp.ok) {
      statusEl.textContent = me.detail || "تعذر جلب بياناتك";
      return;
    }

    statusEl.innerHTML = `
      <b>مرحباً ${me.full_name || "طالب"}</b><br>
      حالة الاشتراك: ${me.subscription_status === "active" ? "✅ فعال" : "❌ غير فعال"}
    `;

    let html = "";
    if (me.subscription) {
      html += `<p><b>الخطة:</b> ${me.subscription.plan_name}<br><b>ينتهي:</b> ${me.subscription.ends_at}</p>`;
    }

    html += "<h3>القنوات المتاحة</h3>";
    if (me.channels.length === 0) {
      html += "<p>لا توجد قنوات مفعلة لك حالياً.</p>";
    } else {
      for (const ch of me.channels) {
        html += `
          <div class="channel">
            <b>${ch.title}</b><br>
            الكود: ${ch.code}<br>
            للحصول على رابط الانضمام ارجع للبوت وأرسل:<br>
            <code>/join ${ch.code}</code>
          </div>
        `;
      }
    }

    contentEl.innerHTML = html;
    contentEl.classList.remove("hidden");

  } catch (err) {
    statusEl.textContent = "حدث خطأ غير متوقع.";
    console.error(err);
  }
}

boot();
