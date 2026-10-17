// Respect people who ask their device to reduce motion
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1. Load-in sequence ---------------------------------------------------- */
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    document.documentElement.classList.add("is-loaded");
  });
});

/* 2. Rotating role text (typing effect) ---------------------------------- */
// Edit the roles in the data-roles attribute in index.html, separated by "|"
const typedEl = document.getElementById("typed");

if (typedEl && !reduceMotion) {
  const roles = typedEl.dataset.roles.split("|");
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true; // the first role is already on screen, so start by erasing it

  function type() {
    const current = roles[roleIndex];

    if (deleting) {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 35);
    } else {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2200); // pause on the finished word
        return;
      }
      setTimeout(type, 70);
    }
  }

  setTimeout(type, 3000); // let the first role show before it starts changing
}

/* 3. Subtle mouse parallax on the title and photo (desktop only) --------- */
const hero = document.querySelector(".hero");
const title = document.querySelector(".hero__title");
const photo = document.querySelector(".hero__photo");
const canHover = window.matchMedia("(hover: hover) and (min-width: 801px)");

if (hero && title && photo && !reduceMotion) {
  let ticking = false;

  hero.addEventListener("mousemove", (e) => {
    if (!canHover.matches || ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const x = e.clientX / window.innerWidth - 0.5; // -0.5 to 0.5
      const y = e.clientY / window.innerHeight - 0.5;

      photo.style.setProperty("--px", `${x * -14}px`);
      photo.style.setProperty("--py", `${y * -8}px`);
      title.style.setProperty("--px", `${x * 10}px`);
      title.style.setProperty("--py", `${y * 6}px`);
      ticking = false;
    });
  });

  hero.addEventListener("mouseleave", () => {
    [photo, title].forEach((el) => {
      el.style.setProperty("--px", "0px");
      el.style.setProperty("--py", "0px");
    });
  });
}