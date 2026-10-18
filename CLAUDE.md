# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

H4CKB4T es un sitio informativo estático de una sola página sobre ciberseguridad (IoT security, AI security, Red/Blue Team y tendencias). Todo el contenido está en español. No hay build, dependencias, linter ni tests: son `index.html`, `css/styles.css` y `js/main.js` en HTML/CSS/JS sin frameworks. Para verlo, abre `index.html` en el navegador o sirve la carpeta con cualquier servidor estático (por ejemplo `python -m http.server`). Node no está instalado en este equipo.

## Arquitectura

- **`index.html`** contiene todo el contenido. Las secciones van marcadas con comentarios `<!-- ============ NOMBRE ============ -->`: nav, hero (sonar + terminal), feed de alertas, stats, áreas (`#areas`), Red vs Blue (`#redblue`), tendencias (`#tendencias`), CTA/suscripción (`#suscribir`) y footer.
- **Íconos:** hay un sprite SVG inline al inicio del `<body>` (`<symbol id="i-*">`, con trazos estilo lucide, y `logo-h4ckb4t`). Se usan con `<svg class="icon"><use href="#i-nombre"/></svg>`. Para un ícono nuevo, agrega un `<symbol>` al sprite; no uses archivos aparte.
- **Navegación:** el resaltado del enlace activo sale de los `href="#id"` de `#nav-links`. Una sección nueva que deba aparecer en el menú necesita un `id` y un enlace ahí.
- **`css/styles.css`:** el sistema de diseño se define con variables en `:root`: fondo oscuro, acento verde `--primary` (#47ff7b), `--red` para Red Team y crítico, y `--blue` para Blue Team y medio. Cada color tiene su variante `*-rgb` para usarla con `rgba()`. Las fuentes son Space Grotesk y JetBrains Mono. El archivo está dividido en bloques con comentarios `/* ---------- Sección ---------- */`.
- **Clases que conectan JS y CSS:**
  - `.reveal` hace aparecer el elemento al hacer scroll (IntersectionObserver añade `.is-visible`, con retardo escalonado entre hermanos). Solo actúa si `<html>` tiene la clase `.js`, que pone un script inline en el `<head>`.
  - `.card--signal` da el brillo que sigue al cursor (variables `--mx`/`--my`).
  - En el feed, `#feed-track` se duplica por JS para que el marquee sea continuo. Basta con agregar `<li>` una sola vez.
  - `#terminal p` se muestra línea por línea.
  - Hay que respetar `prefers-reduced-motion`, que se maneja tanto en el CSS como en el JS.
- **Tendencias (`#tendencias`):** es un registro de casos reales de seguridad que involucran IA, ordenados del más reciente al más antiguo.
  - Cada caso es un `<article class="card card--signal case reveal" data-org="anthropic|openai|otros">` con `.case__meta` (organización y `<time>`), una etiqueta de gravedad (`.sev--crit`, `.sev--high` o `.sev--mid`), un resumen, `.case__lesson`, `.chips` y `.case__src` (enlace a la fuente, `target="_blank" rel="noopener noreferrer"`).
  - Los botones `.case-filter__btn[data-filter]` filtran por `data-org` y cuentan los casos solos (`main.js`). Para una organización nueva, agrega su botón.
  - Si cambia el número de casos, actualiza a mano el contador "casos de IA" de la sección stats.
  - Los casos deben ser verificables y llevar su fuente.
- **Suscripción:** el formulario solo valida en el front-end y no hay backend.
