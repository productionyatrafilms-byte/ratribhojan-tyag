const LANG_KEY = "preferredLanguage";
const DEFAULT_LANG = "English";
let translations = {};

const btnEn = document.querySelector(".english");
const btnHi = document.querySelector(".hindi");
const btnGu = document.querySelector(".gujarati");

const langAudio = {
  English: "./assets/audio/Eng.mpeg",
  Hindi: "./assets/audio/Hin.mpeg",
  Gujarati: "./assets/audio/Guj.mpeg",
};

let currentAudio = null;

function playLangAudio(lang) {
  const src = langAudio[lang];
  if (!src) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(src);
  currentAudio.play().catch((error) => {
    console.error("Failed to play audio:", error);
  });
}

/* Apply saved language immediately to avoid English flash */
const savedLangOnStart = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;

if (savedLangOnStart === "Hindi") {
  document.documentElement.lang = "Hindi";
  document.documentElement.setAttribute("data-lang", "hi");
  document.body?.setAttribute("data-lang", "hi");
} else if (savedLangOnStart === "Gujarati") {
  document.documentElement.lang = "Gujarati";
  document.documentElement.setAttribute("data-lang", "gu");
  document.body?.setAttribute("data-lang", "gu");
} else {
  document.documentElement.lang = "English";
  document.documentElement.setAttribute("data-lang", "en");
  document.body?.setAttribute("data-lang", "en");
}

function setActiveButton(activeBtn) {
  [btnEn, btnHi, btnGu].forEach((btn) => btn?.classList.remove("active"));
  activeBtn?.classList.add("active");
}

function applyLanguage(lang) {
  const langData = translations[lang];
  if (!langData) return;

  document.documentElement.lang = lang;

  if (lang === "English") {
    document.documentElement.setAttribute("data-lang", "en");
    document.body.setAttribute("data-lang", "en");
    setActiveButton(btnEn);
  } else if (lang === "Hindi") {
    document.documentElement.setAttribute("data-lang", "hi");
    document.body.setAttribute("data-lang", "hi");
    setActiveButton(btnHi);
  } else if (lang === "Gujarati") {
    document.documentElement.setAttribute("data-lang", "gu");
    document.body.setAttribute("data-lang", "gu");
    setActiveButton(btnGu);
  }

  document.querySelectorAll("[data-lang-key]").forEach((el) => {
    const key = el.getAttribute("data-lang-key");
    const value = langData[key];

    if (value !== undefined) {
      if (
        typeof value === "string" &&
        (value.includes("<br>") || value.includes("<br/>") || value.includes("<br />"))
      ) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    }
  });

  localStorage.setItem(LANG_KEY, lang);

  document.dispatchEvent(new CustomEvent("languagechange", { detail: lang }));
}

async function loadTranslations() {
  try {
    translations = window.translationsData || {};

    const savedLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
    applyLanguage(savedLang);
  } catch (error) {
    console.error("Failed to load translations:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  btnEn?.addEventListener("click", () => {
    applyLanguage("English");
    playLangAudio("English");
  });
  btnHi?.addEventListener("click", () => {
    applyLanguage("Hindi");
    playLangAudio("Hindi");
  });
  btnGu?.addEventListener("click", () => {
    applyLanguage("Gujarati");
    playLangAudio("Gujarati");
  });

  loadTranslations();
});