// app.js — BharatPro.AI

// ===== Helpers =====
const $ = (id) => document.getElementById(id);
const yearEl = $("year");
const clockEl = $("clock");
const feedEl = $("feed");
const feedStatusEl = $("feedStatus");

// ===== Footer Year =====
yearEl.textContent = new Date().getFullYear();

// ===== Theme Toggle =====
const themeToggle = $("themeToggle");
themeToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});
// Load saved theme
if (localStorage.getItem("theme")) {
  document.documentElement.setAttribute("data-theme", localStorage.getItem("theme"));
}

// ===== Live IST Clock =====
function updateClock() {
  const now = new Date();
  const options = { hour: "2-digit", minute: "2-digit", second:"2-digit", hour12: true, timeZone: "Asia/Kolkata" };
  clockEl.textContent = now.toLocaleTimeString("en-IN", options);
}
setInterval(updateClock, 1000);
updateClock();

// ===== Settings Modal =====
const settingsBtn = $("settingsBtn");
const settingsModal = $("settingsModal");
const saveBtn = $("saveSettingsBtn");
const clearBtn = $("clearSettingsBtn");

settingsBtn.addEventListener("click", () => settingsModal.showModal());

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("newsapiKey", $("newsapiKey").value.trim());
  localStorage.setItem("gnewsKey", $("gnewsKey").value.trim());
  alert("✅ API Keys saved locally.");
  settingsModal.close();
});

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("newsapiKey");
  localStorage.removeItem("gnewsKey");
  $("newsapiKey").value = "";
  $("gnewsKey").value = "";
  alert("🔒 Keys cleared.");
});

// On load, restore keys (hidden in input)
$("newsapiKey").value = localStorage.getItem("newsapiKey") || "";
$("gnewsKey").value = localStorage.getItem("gnewsKey") || "";

// ===== Fake Feed Fetcher (Demo) =====
// Later you can replace with real API requests
async function loadFeed(topic = "top") {
  feedStatusEl.textContent = "🔄 Fetching fresh news…";
  feedEl.setAttribute("aria-busy", "true");
  feedEl.innerHTML = "";

  // Simulate async fetch
  await new Promise(res => setTimeout(res, 1500));

  // Demo feed (replace with fetched articles)
  const sampleArticles = [
    { title: `Latest in ${topic.toUpperCase()}`, desc: "Your trusted update from BharatPro.AI", url: "#" },
    { title: "Global Markets Update", desc: "Stocks and finance insights.", url: "#" },
    { title: "Science & Tech", desc: "New innovations shaping tomorrow.", url: "#" }
  ];

  sampleArticles.forEach(article => {
    const div = document.createElement("div");
    div.className = "feed-item";
    div.innerHTML = `<h4><a href="${article.url}" target="_blank" rel="noopener">${article.title}</a></h4>
                     <p>${article.desc}</p>`;
    feedEl.appendChild(div);
  });

  feedEl.setAttribute("aria-busy", "false");
  feedStatusEl.textContent = `✅ Updated ${new Date().toLocaleTimeString()}`;

  // Refresh AdSense blocks after new content
  if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
    document.querySelectorAll('.adsbygoogle').forEach(ad => {
      try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { }
    });
  }
}

// Initial feed
loadFeed();

// ===== Topic Switching =====
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    loadFeed(chip.dataset.topic);
  });
});

// ===== Search Handler =====
$("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const q = $("searchInput").value.trim();
  if (q) {
    loadFeed("search:" + q);
  }
});

// ===== Refresh Button =====
$("refreshBtn").addEventListener("click", () => {
  const activeChip = document.querySelector(".chip.active");
  const topic = activeChip ? activeChip.dataset.topic : "top";
  loadFeed(topic);
});
