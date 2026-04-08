const app = document.getElementById("app");
app.innerHTML = "JS V7 LOADED";

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  app.innerHTML += "<br>Telegram WebApp detected";
} else {
  app.innerHTML += "<br>Telegram WebApp NOT detected";
}

const initData = tg?.initData || "";
app.innerHTML += `<br>initData length: ${initData.length}`;
app.innerHTML += "<br>NO FETCH YET";
