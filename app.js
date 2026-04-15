const app = document.getElementById("app");
const tg = window.Telegram?.WebApp;
const API_BASE = "https://tahiredu.duckdns.org";

app.innerHTML = `
  <div style="padding:10px;color:green;font-weight:bold;">APP V30 LOADED</div>
  <div>جارٍ تحميل القنوات...</div>
  <select id="channel_code">
    <option value="">جارٍ تحميل القنوات...</option>
  </select>
  <div id="statusBox" style="margin-top:10px;"></div>
`;

if (tg) {
  tg.ready();
  tg.expand();
}

const channelSelect = document.getElementById("channel_code");
const statusBox = document.getElementById("statusBox");

async function loadChannels() {
  try {
    statusBox.textContent = "بدء طلب القنوات...";
    const resp = await fetch(`${API_BASE}/api/channels`, {
      method: "GET",
      cache: "no-store",
    });

    statusBox.textContent = `HTTP ${resp.status}`;
    const data = await resp.json();

    if (!resp.ok || !Array.isArray(data.channels)) {
      channelSelect.innerHTML = `<option value="">تعذر تحميل القنوات</option>`;
      statusBox.textContent = "فشل تحميل القنوات";
      return;
    }

    if (data.channels.length === 0) {
      channelSelect.innerHTML = `<option value="">لا توجد قنوات</option>`;
      statusBox.textContent = "لا توجد قنوات";
      return;
    }

    channelSelect.innerHTML = data.channels
      .map(c => `<option value="${c.code}">${c.title}</option>`)
      .join("");

    statusBox.textContent = `تم تحميل ${data.channels.length} قناة`;
  } catch (err) {
    channelSelect.innerHTML = `<option value="">تعذر تحميل القنوات</option>`;
    statusBox.textContent = `خطأ: ${err.message}`;
  }
}

loadChannels();
