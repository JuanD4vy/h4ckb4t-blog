(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navegación: fondo al hacer scroll + botón "arriba" ---------- */
  const nav = document.getElementById("nav");
  const toTop = document.getElementById("to-top");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 12);
    toTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Enlace activo según la sección visible ---------- */
  const navLinks = [...links.querySelectorAll("a")];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Feed: duplicar elementos para un bucle continuo ---------- */
  const track = document.getElementById("feed-track");
  [...track.children].forEach((li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  /* ---------- Terminal: mostrar líneas en secuencia ---------- */
  const lines = [...document.querySelectorAll("#terminal p")];
  if (reduceMotion) {
    lines.forEach((p) => p.classList.add("is-shown"));
  } else {
    lines.forEach((p, i) => {
      setTimeout(() => p.classList.add("is-shown"), 500 + i * 420);
    });
  }

  /* ---------- Aparición al hacer scroll (con escalonado por grupo) ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--delay", `${Math.min(siblings.indexOf(el), 5) * 80}ms`);
    revealObserver.observe(el);
  });

  /* ---------- Brillo de tarjetas que sigue al cursor ---------- */
  document.querySelectorAll(".card--signal").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Tendencias: filtro de casos por organización ---------- */
  const cases = [...document.querySelectorAll("#cases .case")];
  const filterBtns = [...document.querySelectorAll(".case-filter__btn")];
  filterBtns.forEach((btn) => {
    const f = btn.dataset.filter;
    const n = f === "todos" ? cases.length : cases.filter((c) => c.dataset.org === f).length;
    btn.querySelector(".case-filter__count").textContent = `(${n})`;
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      cases.forEach((c) => {
        c.hidden = f !== "todos" && c.dataset.org !== f;
        c.classList.add("is-visible");
      });
    });
  });

  /* ---------- Formulario de suscripción (solo front-end) ---------- */
  const form = document.getElementById("subscribe");
  const msg = document.getElementById("subscribe-msg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    form.classList.toggle("is-invalid", !valid);
    msg.classList.toggle("is-error", !valid);
    msg.classList.toggle("is-ok", valid);
    if (!valid) {
      msg.textContent = "[error] ingresa un correo válido.";
      form.email.focus();
      return;
    }
    msg.textContent = `[ok] ${email} registrado. Te avisaremos de lo que importa.`;
    form.reset();
  });

  /* ---------- Año del footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
