const tg = window.Telegram?.WebApp;
const API_BASE = "https://tahiredu.duckdns.org";

const fullNameInput = document.getElementById("full_name");
const whatsappInput = document.getElementById("whatsapp");
const universityInput = document.getElementById("university");
const channelSelect = document.getElementById("channel_code");
const noteInput = document.getElementById("note");
const submitBtn = document.getElementById("submitBtn");
const statusBox = document.getElementById("statusBox");

if (tg) {
  tg.ready();
  tg.expand();
}

function showStatus(message, type = "error") {
  statusBox.className = `status ${type}`;
  statusBox.textContent = message;
}

function clearStatus() {
  statusBox.className = "status";
  statusBox.textContent = "";
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? "جارٍ الإرسال..." : "إرسال الطلب";
}

async function loadChannels() {
  try {
    showStatus("جارٍ تحميل القنوات...", "success");

    const resp = await fetch(`${API_BASE}/api/channels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await resp.json();

    if (!resp.ok || !Array.isArray(data.channels)) {
      channelSelect.innerHTML = `<option value="">تعذر تحميل القنوات</option>`;
      showStatus("تعذر تحميل القنوات من السيرفر.");
      return;
    }

    if (data.channels.length === 0) {
      channelSelect.innerHTML = `<option value="">لا توجد قنوات متاحة حاليًا</option>`;
      showStatus("لا توجد قنوات متاحة حاليًا.");
      return;
    }

    channelSelect.innerHTML = data.channels
      .map(
        (channel) =>
          `<option value="${channel.code}">${channel.title}</option>`
      )
      .join("");

    showStatus("✅ تم تحميل القنوات", "success");
  } catch (err) {
    channelSelect.innerHTML = `<option value="">تعذر تحميل القنوات</option>`;
    showStatus(`تعذر الاتصال بالسيرفر: ${err.message}`);
  }
}

async function submitForm() {
  clearStatus();

  const full_name = fullNameInput.value.trim();
  const whatsapp = whatsappInput.value.trim();
  const university = universityInput.value.trim();
  const channel_code = channelSelect.value.trim();
  const note = noteInput.value.trim();

  if (!tg) {
    showStatus("يجب فتح هذه الصفحة من داخل تيليجرام.");
    return;
  }

  const initData = tg.initData || "";
  if (!initData) {
    showStatus("تعذر التحقق من جلسة تيليجرام. افتح الطلب من زر البوت مباشرة.");
    return;
  }

  if (!full_name || !whatsapp || !university || !channel_code) {
    showStatus("الرجاء تعبئة الاسم ورقم واتساب والجامعة واختيار القناة.");
    return;
  }

  setLoading(true);

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
      showStatus(data.detail || "تعذر إرسال الطلب.");
      setLoading(false);
      return;
    }

    showStatus("✅ تم إرسال طلب الاشتراك بنجاح. ستقوم الإدارة بمراجعته.", "success");

    fullNameInput.value = "";
    whatsappInput.value = "";
    universityInput.value = "";
    noteInput.value = "";

    if (tg?.HapticFeedback?.notificationOccurred) {
      tg.HapticFeedback.notificationOccurred("success");
    }
  } catch (err) {
    showStatus(`تعذر الاتصال بالسيرفر: ${err.message}`);
  } finally {
    setLoading(false);
  }
}

submitBtn.addEventListener("click", submitForm);
loadChannels();
