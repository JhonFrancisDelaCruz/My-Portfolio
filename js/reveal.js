/* Scroll animations: progress bar + reveal-on-scroll (pages must have the "js" class on <html>) */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- scroll progress bar --- */
  if (!reduce) {
    var bar = document.createElement("div");
    bar.className = "scrollBar";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    var ticking = false;
    var update = function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--p", max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* --- what to reveal --- */
  var mark = function (el, type, delay) {
    el.setAttribute("data-reveal", type || "up");
    if (delay) el.style.setProperty("--d", delay + "s");
  };

  document.querySelectorAll("main .section").forEach(function (sec) {
    Array.prototype.forEach.call(sec.children, function (child, i) {
      if (child.classList.contains("stackList")) return;       // pills handled below
      mark(child, child.classList.contains("project-card") ? "scale" : "up", Math.min(i, 4) * 0.08);
    });
  });

  document.querySelectorAll(".stackGroup").forEach(function (g, i) {
    mark(g, "up", (i % 2) * 0.12);
  });

  document.querySelectorAll(".stackList").forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (pill, i) {
      pill.style.setProperty("--n", i);
    });
  });

  var footer = document.querySelector(".footer");
  if (footer) mark(footer, "up");

  /* --- observe --- */
  var targets = document.querySelectorAll("[data-reveal], .stackList");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  targets.forEach(function (el) { io.observe(el); });
})();
