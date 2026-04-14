const tg = window.Telegram?.WebApp;
const API_BASE = "https://tahiredu.duckdns.org";

if (tg) {
  tg.ready();
  tg.expand();
}

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "default";

const app = document.getElementById("app");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderRequestForm() {
  app.innerHTML = `
    <div style="padding:20px;font-family:sans-serif;direction:rtl;max-width:720px;margin:auto;">
      <h2>طلب اشتراك</h2>
      <p style="color:#666;line-height:1.8;">املأ البيانات التالية لإرسال طلب الاشتراك.</p>

      <div style="display:grid;gap:14px;">
        <div>
          <label>الاسم الكامل</label>
          <input id="full_name" type="text" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;">
        </div>

        <div>
          <label>رقم واتساب</label>
          <input id="whatsapp" type="text" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;">
        </div>

        <div>
          <label>الجامعة</label>
          <input id="university" type="text" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;">
        </div>

        <div>
          <label>القناة المطلوبة</label>
          <select id="channel_code" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;">
            <option value="">جارٍ تحميل القنوات...</option>
          </select>
        </div>

        <div>
          <label>ملاحظة إضافية</label>
          <textarea id="note" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;min-height:100px;"></textarea>
        </div>

        <button id="submitBtn" style="padding:14px;border:0;border-radius:12px;background:#2563eb;color:#fff;font-weight:bold;">
          إرسال الطلب
        </button>

        <div id="statusBox" style="line-height:1.8;"></div>
      </div>
    </div>
  `;

  loadChannels();

  document.getElementById("submitBtn").addEventListener("click", submitSubscriptionRequest);
}

async function loadChannels() {
  const select = document.getElementById("channel_code");
  try {
    const resp = await fetch(`${API_BASE}/api/channels`);
    const data = await resp.json();

    if (!resp.ok || !Array.isArray(data.channels)) {
      select.innerHTML = `<option value="">تعذر تحميل القنوات</option>`;
      return;
    }

    if (data.channels.length === 0) {
      select.innerHTML = `<option value="">لا توجد قنوات متاحة حاليًا</option>`;
      return;
    }

    select.innerHTML = data.channels
      .map(c => `<option value="${escapeHtml(c.code)}">${escapeHtml(c.title)}</option>`)
      .join("");
  } catch (err) {
    select.innerHTML = `<option value="">تعذر تحميل القنوات</option>`;
  }
}

async function submitSubscriptionRequest() {
  const statusBox = document.getElementById("statusBox");
  const full_name = document.getElementById("full_name").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const university = document.getElementById("university").value.trim();
  const channel_code = document.getElementById("channel_code").value.trim();
  const note = document.getElementById("note").value.trim();

  statusBox.textContent = "";

  if (!tg) {
    statusBox.textContent = "يجب فتح هذه الصفحة من داخل تيليجرام.";
    return;
  }

  const initData = tg.initData || "";
  if (!initData) {
    statusBox.textContent = "تعذر التحقق من جلسة تيليجرام.";
    return;
  }

  if (!full_name || !whatsapp || !university || !channel_code) {
    statusBox.textContent = "الرجاء تعبئة الاسم والواتساب والجامعة واختيار القناة.";
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/api/subscription-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        init_data: initData,
        full_name,
        whatsapp,
        university,
        channel_code,
        note,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      statusBox.textContent = data.detail || "تعذر إرسال الطلب.";
      return;
    }

    statusBox.textContent = "✅ تم إرسال طلب الاشتراك بنجاح.";
    document.getElementById("full_name").value = "";
    document.getElementById("whatsapp").value = "";
    document.getElementById("university").value = "";
    document.getElementById("note").value = "";
  } catch (err) {
    statusBox.textContent = `تعذر الاتصال بالسيرفر: ${err.message}`;
  }
}

function renderDefaultPage() {
  app.innerHTML = `
    <div style="padding:20px;font-family:sans-serif;direction:rtl;">
      <h2>منصة الدروس</h2>
      <p>اختر ما تريد من البوت.</p>
    </div>
  `;
}

if (mode === "request") {
  renderRequestForm();
} else {
  renderDefaultPage();
}
