/* Thermofis — Cookie-Consent (kein Drittanbieter, läuft komplett lokal) */
(function () {
  "use strict";

  var STORAGE_KEY = "thermofis_cookie_consent"; // Werte: "all" | "essential"

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    applyConsent(value);
  }

  function applyConsent(value) {
    document.querySelectorAll(".map-block, .areas__map").forEach(function (block) {
      if (value === "all") {
        loadMap(block);
      } else {
        showMapPlaceholder(block);
      }
    });
  }

  function loadMap(block) {
    var src = block.getAttribute("data-map-src");
    var existing = block.querySelector("iframe");
    if (src && !existing) {
      var iframe = document.createElement("iframe");
      iframe.loading = "lazy";
      iframe.src = src;
      iframe.title = "Standort";
      block.innerHTML = "";
      block.appendChild(iframe);
    }
  }

  function showMapPlaceholder(block) {
    if (block.querySelector(".map-consent-placeholder")) return;
    var iframe = block.querySelector("iframe");
    if (iframe) iframe.remove();
    var ph = document.createElement("div");
    ph.className = "map-consent-placeholder";
    ph.innerHTML =
      '<p>Hier würde die Karte (OpenStreetMap) geladen. Dafür wird eine Verbindung zu externen Servern aufgebaut.</p>' +
      '<button type="button" class="map-consent-btn">Karte laden &amp; Cookies akzeptieren</button>';
    block.innerHTML = "";
    block.appendChild(ph);
    ph.querySelector(".map-consent-btn").addEventListener("click", function () {
      setConsent("all");
      updateBannerVisibility();
    });
  }

  function updateBannerVisibility() {
    var banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = getConsent() ? "none" : "";
  }

  function buildBanner() {
    if (document.getElementById("cookie-banner")) return;
    var el = document.createElement("div");
    el.id = "cookie-banner";
    el.className = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Cookie-Einstellungen");
    el.innerHTML =
      '<div class="cookie-banner__inner">' +
      '<p class="cookie-banner__text">Wir binden eine Karte (OpenStreetMap) ein. Dabei wird Ihre IP-Adresse an externe Server übertragen. Details in der <a href="/datenschutz/">Datenschutzerklärung</a>.</p>' +
      '<div class="cookie-banner__actions">' +
      '<button type="button" class="cookie-banner__btn cookie-banner__btn--ghost" data-consent="essential">Nur notwendige</button>' +
      '<button type="button" class="cookie-banner__btn cookie-banner__btn--primary" data-consent="all">Akzeptieren</button>' +
      "</div></div>";
    document.body.appendChild(el);

    el.querySelectorAll("[data-consent]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setConsent(btn.getAttribute("data-consent"));
        updateBannerVisibility();
      });
    });
  }

  function buildFooterLink() {
    var footer = document.querySelector(".footer");
    if (!footer || document.getElementById("cookie-settings-link")) return;
    var bottom = footer.querySelector(".footer__bottom");
    if (!bottom) return;
    var link = document.createElement("a");
    link.id = "cookie-settings-link";
    link.href = "#";
    link.textContent = "Cookie-Einstellungen";
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var banner = document.getElementById("cookie-banner");
      if (banner) banner.style.display = "";
    });
    bottom.appendChild(link);
  }

  function init() {
    if (!document.querySelector(".map-block, .areas__map")) return;
    // Alle vorhandenen Map-Blöcke: iframe-Quelle merken, iframe erstmal entfernen
    document.querySelectorAll(".map-block, .areas__map").forEach(function (block) {
      var iframe = block.querySelector("iframe");
      if (iframe && !block.getAttribute("data-map-src")) {
        block.setAttribute("data-map-src", iframe.getAttribute("src"));
      }
    });

    buildBanner();
    buildFooterLink();

    var consent = getConsent();
    if (consent) {
      applyConsent(consent);
      updateBannerVisibility();
    } else {
      applyConsent("essential"); // bis zur Entscheidung: Karten nicht laden
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
