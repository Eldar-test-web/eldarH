/* ELDAR archive — small, dependency-free interaction layer */
(function () {
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* year + local time */
  var yearEls = document.querySelectorAll("[data-year]");
  var y = new Date().getFullYear();
  yearEls.forEach(function (el) { el.textContent = y; });

  var clock = document.querySelector("[data-clock]");
  function tick() {
    if (!clock) return;
    try {
      var t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      clock.textContent = "LOCAL " + t;
    } catch (e) { /* noop */ }
  }
  tick();
  window.setInterval(tick, 30000);

  /* scroll progress */
  var bar = document.querySelector("[data-progress]");
  function onScrollProgress() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) : 0;
    bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }
  window.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  /* reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal, .lines, .img-reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* subtle parallax — only large screens, no reduced motion */
  var pxEls = document.querySelectorAll("[data-parallax]");
  var ticking = false;
  function parallax() {
    ticking = false;
    if (prefersReduced || window.innerWidth < 900) {
      pxEls.forEach(function (el) { el.style.transform = ""; });
      return;
    }
    var vh = window.innerHeight;
    pxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var speed = parseFloat(el.getAttribute("data-parallax") || "0.06");
      var center = r.top + r.height / 2 - vh / 2;
      el.style.transform = "translateY(" + (-center * speed).toFixed(1) + "px)";
    });
  }
  function requestParallax() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(parallax); }
  }
  if (pxEls.length && !prefersReduced) {
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax);
    parallax();
  }

  /* cinematic page transition */
  var wipe = document.querySelector("[data-wipe]");
  var wipeLabel = document.querySelector("[data-wipe-label]");
  function go(url, label) {
    if (prefersReduced || !wipe) { window.location.href = url; return; }
    if (wipeLabel && label) wipeLabel.textContent = label;
    wipe.classList.add("is-on");
    window.setTimeout(function () { window.location.href = url; }, 560);
  }
  document.querySelectorAll("a[data-transition]").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var url = a.getAttribute("href");
      if (!url || url.charAt(0) === "#" || a.target === "_blank") return;
      // allow modified clicks
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      ev.preventDefault();
      go(url, a.getAttribute("data-label") || "ARCHIVE");
    });
  });
  // entrance: wipe away if we arrived with it on (back/forward)
  window.addEventListener("pageshow", function () {
    if (wipe) wipe.classList.remove("is-on");
  });
  window.setTimeout(function () {
    if (wipe) wipe.classList.remove("is-on");
  }, 60);

  /* horizontal strip drag-to-scroll + buttons */
  document.querySelectorAll("[data-hscroll]").forEach(function (strip) {
    var down = false, startX = 0, startL = 0;
    strip.addEventListener("pointerdown", function (e) {
      down = true; startX = e.clientX; startL = strip.scrollLeft;
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener("pointermove", function (e) {
      if (!down) return;
      strip.scrollLeft = startL - (e.clientX - startX);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (t) {
      strip.addEventListener(t, function () { down = false; });
    });
    var root = strip.closest("[data-hwrap]");
    if (root) {
      var prev = root.querySelector("[data-hprev]");
      var next = root.querySelector("[data-hnext]");
      function step(dir) {
        var w = strip.clientWidth * 0.7;
        strip.scrollBy({ left: dir * w, behavior: prefersReduced ? "auto" : "smooth" });
      }
      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });
    }
  });
})();
