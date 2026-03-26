interface BaseTemplateParams {
  title: string;
  slidesHtml: string;
  totalSlides: number;
  brandColors?: {
    primary?: string;
    primaryContainer?: string;
    background?: string;
  };
  presenterNotes: Array<{ slideNum: number; notes: string }>;
}

export function renderBaseTemplate(params: BaseTemplateParams): string {
  const {
    title,
    slidesHtml,
    totalSlides,
    brandColors,
    presenterNotes,
  } = params;

  const primary = brandColors?.primary ?? "#C8102E";
  const primaryContainer = brandColors?.primaryContainer ?? "#8B0A1E";
  const background = brandColors?.background ?? "#0A0A0A";

  // Build nav dots
  const navDots = Array.from({ length: totalSlides }, (_, i) => {
    const n = i + 1;
    return `<button class="nav-dot${n === 1 ? " active" : ""}" data-slide="${n}" aria-label="Slide ${n}"></button>`;
  }).join("\n    ");

  return /* html */ `<!DOCTYPE html>
<html lang="en" style="color-scheme:dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="${background}">
<title>${escapeHtml(title)}</title>

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- GSAP CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"><\/script>

<style>
/* ═══════════════════════════════════════════
   CUSTOM PROPERTIES
   ═══════════════════════════════════════════ */
:root {
  --bg: ${background};
  --bg-card: #141414;
  --bg-card-hover: #1A1A1A;
  --bg-card-border: #222222;
  --red: ${primary};
  --red-dark: ${primaryContainer};
  --red-glow: ${hexToRgba(primary, 0.25)};
  --red-glow-strong: ${hexToRgba(primary, 0.5)};
  --white: #FFFFFF;
  --gray-100: #F5F5F5;
  --gray-300: #BBBBBB;
  --gray-400: #888888;
  --gray-600: #666666;
  --gray-800: #333333;
  --green: #2E7D32;
  --green-dark: #1B5E20;
  --blue: #1565C0;
  --blue-dark: #0D47A1;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
}

/* ═══════════════════════════════════════════
   RESET & BASE
   ═══════════════════════════════════════════ */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--red) var(--bg);
}
body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--white);
  font-size: 18px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}
::selection { background: var(--red); color: var(--white); }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--red); border-radius: 3px; }
a { color: var(--red); text-decoration: none; }
a:hover { color: var(--white); }
img { max-width: 100%; height: auto; display: block; }

/* ═══════════════════════════════════════════
   SLIDE SECTIONS
   ═══════════════════════════════════════════ */
.slide {
  min-height: 100vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 48px;
  position: relative;
  overflow: hidden;
}
.slide-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* ═══════════════════════════════════════════
   TYPOGRAPHY
   ═══════════════════════════════════════════ */
.t-display {
  font-family: var(--font-display);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.t-display-xl { font-size: clamp(42px, 5vw, 72px); }
.t-display-lg { font-size: clamp(36px, 4vw, 56px); }
.t-display-md { font-size: clamp(28px, 3vw, 44px); }
.t-heading {
  font-family: var(--font-body);
  font-weight: 700;
  line-height: 1.2;
}
.t-heading-lg { font-size: clamp(28px, 3vw, 40px); }
.t-heading-md { font-size: clamp(22px, 2.5vw, 32px); }
.t-heading-sm { font-size: clamp(18px, 2vw, 24px); }
.t-body { font-size: clamp(16px, 1.2vw, 20px); color: var(--gray-300); }
.t-body-sm { font-size: clamp(14px, 1vw, 16px); color: var(--gray-400); }
.t-caption { font-size: 13px; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.1em; }
.t-metric {
  font-family: var(--font-display);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.t-metric-xl { font-size: clamp(56px, 7vw, 110px); }
.t-metric-lg { font-size: clamp(40px, 5vw, 80px); }
.t-metric-md { font-size: clamp(28px, 3vw, 48px); }
.t-metric-sm { font-size: clamp(22px, 2.5vw, 36px); }
.text-red { color: var(--red); }
.text-gray { color: var(--gray-400); }
.text-green { color: var(--green); }
.text-blue { color: var(--blue); }

/* ═══════════════════════════════════════════
   CARDS
   ═══════════════════════════════════════════ */
.card {
  background: var(--bg-card);
  border: 1px solid var(--bg-card-border);
  border-radius: 16px;
  padding: 32px;
  transition: transform 0.4s var(--ease-out-expo), box-shadow 0.4s var(--ease-out-expo), border-color 0.4s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  border-color: var(--gray-800);
}
.card-red-top { border-top: 3px solid var(--red); }
.card-red-left { border-left: 3px solid var(--red); }
.card-red-glow {
  box-shadow: 0 0 30px var(--red-glow), inset 0 0 30px ${hexToRgba(primary, 0.05)};
  border-color: ${hexToRgba(primary, 0.3)};
}
.card-alert {
  background: ${hexToRgba(primary, 0.08)};
  border: 1px solid ${hexToRgba(primary, 0.2)};
  border-radius: 12px;
  padding: 20px 24px;
}

/* ═══════════════════════════════════════════
   GRIDS & LAYOUTS
   ═══════════════════════════════════════════ */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
.flex-row { display: flex; gap: 24px; align-items: center; }
.flex-col { display: flex; flex-direction: column; gap: 16px; }
.gap-8 { gap: 8px; } .gap-12 { gap: 12px; } .gap-16 { gap: 16px; }
.gap-24 { gap: 24px; } .gap-32 { gap: 32px; } .gap-48 { gap: 48px; }
.mt-16 { margin-top: 16px; } .mt-24 { margin-top: 24px; }
.mt-32 { margin-top: 32px; } .mt-48 { margin-top: 48px; }
.mb-16 { margin-bottom: 16px; } .mb-24 { margin-bottom: 24px; } .mb-32 { margin-bottom: 32px; }

/* ═══════════════════════════════════════════
   BADGES & PILLS
   ═══════════════════════════════════════════ */
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 100px; font-size: 12px;
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
}
.badge-red { background: ${hexToRgba(primary, 0.15)}; color: var(--red); }
.badge-green { background: rgba(46,125,50,0.15); color: #4CAF50; }
.badge-blue { background: rgba(21,101,192,0.15); color: #42A5F5; }
.badge-gray { background: rgba(136,136,136,0.15); color: var(--gray-400); }
.badge-white { background: rgba(255,255,255,0.1); color: var(--white); }
.num-circle {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--red); color: var(--white);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 16px; flex-shrink: 0;
}

/* ═══════════════════════════════════════════
   PROGRESS BARS
   ═══════════════════════════════════════════ */
.progress-bar {
  height: 8px; background: var(--gray-800); border-radius: 4px; overflow: hidden; position: relative;
}
.progress-bar-fill {
  height: 100%; border-radius: 4px; transition: width 1.2s var(--ease-out-expo); width: 0;
}
.progress-bar-fill.red { background: var(--red); }
.progress-bar-fill.green { background: var(--green); }
.progress-bar-fill.blue { background: var(--blue); }
.progress-bar-fill.gray { background: var(--gray-600); }

/* ═══════════════════════════════════════════
   QUOTE CARDS
   ═══════════════════════════════════════════ */
.quote-card {
  background: var(--bg-card);
  border-left: 3px solid var(--gray-800);
  padding: 20px 24px;
  border-radius: 0 12px 12px 0;
  font-size: clamp(15px, 1.1vw, 18px);
  color: var(--gray-300);
  font-style: italic;
  transition: border-color 0.3s, background 0.3s;
  margin-bottom: 12px;
}
.quote-card:first-child,
.quote-card:hover {
  border-left-color: var(--red);
  background: ${hexToRgba(primary, 0.05)};
}

/* ═══════════════════════════════════════════
   CHECKLIST
   ═══════════════════════════════════════════ */
.checklist { list-style: none; }
.checklist li {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 8px 0; font-size: 16px; color: var(--gray-300);
}
.checklist li::before {
  content: '';
  width: 20px; height: 20px; flex-shrink: 0;
  border: 2px solid var(--red); border-radius: 4px;
  margin-top: 2px; position: relative;
  transition: background 0.3s, border-color 0.3s;
}
.checklist li.checked::before {
  background: var(--red);
  border-color: var(--red);
}

/* ═══════════════════════════════════════════
   BAR CHART
   ═══════════════════════════════════════════ */
.bar-chart { width: 100%; }
.bar-chart .bar-row {
  display: flex; align-items: center; gap: 16px; margin-bottom: 12px;
}
.bar-chart .bar-label {
  width: 140px; font-size: 14px; color: var(--gray-400); text-align: right; flex-shrink: 0;
}
.bar-chart .bar-track {
  flex: 1; height: 28px; background: var(--gray-800); border-radius: 6px; overflow: hidden; position: relative;
}
.bar-chart .bar-fill {
  height: 100%; background: linear-gradient(90deg, var(--red-dark), var(--red));
  border-radius: 6px; transition: width 1.2s var(--ease-out-expo); width: 0;
  display: flex; align-items: center; justify-content: flex-end; padding-right: 12px;
}
.bar-chart .bar-fill span {
  font-size: 13px; font-weight: 700; color: var(--white); white-space: nowrap;
}

/* ═══════════════════════════════════════════
   METRIC TABLE
   ═══════════════════════════════════════════ */
.metric-table { width: 100%; }
.metric-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.metric-row:last-child { border-bottom: none; }
.metric-row .metric-label { color: var(--gray-400); font-size: 15px; }
.metric-row .metric-value { color: var(--red); font-weight: 700; font-size: 15px; }

/* ═══════════════════════════════════════════
   FUNNEL ARROW
   ═══════════════════════════════════════════ */
.funnel-arrow {
  display: flex; align-items: center; justify-content: center;
  color: var(--red); font-size: 32px; opacity: 0.6; flex-shrink: 0;
}

/* ═══════════════════════════════════════════
   DIVIDERS
   ═══════════════════════════════════════════ */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gray-800), transparent);
  margin: 16px 0;
}

/* ═══════════════════════════════════════════
   NAVIGATION — Side Progress
   ═══════════════════════════════════════════ */
.nav-progress {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 1000; display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.nav-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--gray-800); border: none; cursor: pointer;
  transition: all 0.4s var(--ease-out-expo); position: relative; padding: 0;
}
.nav-dot.active {
  background: var(--red);
  box-shadow: 0 0 12px var(--red-glow-strong);
  transform: scale(1.4);
}
.nav-dot:hover { background: var(--red); transform: scale(1.2); }
.nav-dot:focus-visible { outline: 2px solid var(--red); outline-offset: 4px; }

/* Slide counter */
.slide-counter {
  position: fixed; top: 32px; left: 32px; z-index: 1000;
  font-family: var(--font-display); font-size: 14px; color: var(--gray-600);
  letter-spacing: 0.05em; transition: color 0.3s;
}
.slide-counter .current { color: var(--white); font-size: 28px; font-weight: 900; }

/* ═══════════════════════════════════════════
   PRESENTER NOTES PANEL
   ═══════════════════════════════════════════ */
.presenter-panel {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(20px);
  border-top: 1px solid var(--gray-800); padding: 24px 48px;
  z-index: 9999; transform: translateY(100%);
  transition: transform 0.5s var(--ease-out-expo);
  max-height: 35vh; overflow-y: auto;
}
.presenter-panel.visible { transform: translateY(0); }
.presenter-panel h4 {
  font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--red); margin-bottom: 12px;
}
.presenter-panel p {
  font-size: 16px; color: var(--gray-300); line-height: 1.7; max-width: 900px;
}

/* ═══════════════════════════════════════════
   KEYBOARD HINTS
   ═══════════════════════════════════════════ */
.kbd-hints {
  position: fixed; bottom: 24px; left: 32px; z-index: 1000;
  display: flex; gap: 12px; opacity: 0.4; transition: opacity 0.3s;
}
.kbd-hints:hover { opacity: 1; }
.kbd {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 4px 8px; border-radius: 6px;
  background: var(--bg-card); border: 1px solid var(--bg-card-border);
  font-size: 11px; color: var(--gray-400); font-family: var(--font-body);
}

/* ═══════════════════════════════════════════
   BACKGROUNDS & EFFECTS
   ═══════════════════════════════════════════ */
.bg-glow {
  position: absolute; width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, var(--red-glow) 0%, transparent 70%);
  filter: blur(100px); pointer-events: none; z-index: 0;
}
.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none; z-index: 0;
}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .grid-5 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .slide { padding: 60px 32px; }
}
@media (max-width: 768px) {
  html { scroll-snap-type: none; }
  .grid-2, .grid-3, .grid-4, .grid-5 { grid-template-columns: 1fr; }
  .nav-progress, .slide-counter, .kbd-hints { display: none; }
  .slide { padding: 48px 20px; min-height: auto; }
  .presenter-panel { padding: 16px 20px; }
}

/* ═══════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  html { scroll-snap-type: none; scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .anim-fade-up, .anim-fade-in, .anim-scale-in,
  .anim-slide-left, .anim-slide-right {
    opacity: 1 !important; transform: none !important;
  }
  .progress-bar-fill, .bar-fill { transition: none; width: auto; }
}
</style>
</head>
<body>

<!-- Navigation Progress -->
<nav class="nav-progress" aria-label="Slide navigation">
  ${navDots}
</nav>

<!-- Slide Counter -->
<div class="slide-counter">
  <span class="current">01</span> / ${String(totalSlides).padStart(2, "0")}
</div>

<!-- Keyboard Hints -->
<div class="kbd-hints">
  <span class="kbd">&#8593; &#8595;</span>
  <span class="kbd">P notes</span>
  <span class="kbd">F fullscreen</span>
</div>

<!-- Main Content -->
<main id="main">
${slidesHtml}
</main>

<!-- Presenter Notes Panel -->
<aside class="presenter-panel" id="presenterPanel" aria-hidden="true">
  <h4>Presenter Notes</h4>
  <p id="presenterText"></p>
</aside>

<!-- ═══════════════════════════════════════════
     JAVASCRIPT — GSAP Animations & Navigation
     ═══════════════════════════════════════════ -->
<script>
(function() {
  'use strict';

  // ─── State ──────────────────────────────
  var currentSlide = 1;
  var totalSlides = ${totalSlides};
  var presenterMode = false;
  var slides = document.querySelectorAll('.slide');
  var dots = document.querySelectorAll('.nav-dot');
  var counter = document.querySelector('.slide-counter .current');
  var presenterPanel = document.getElementById('presenterPanel');
  var presenterText = document.getElementById('presenterText');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Register GSAP plugins ─────────────
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  gsap.ticker.lagSmoothing(0);

  // Force a setTimeout-based ticker fallback for iframe contexts
  setInterval(function() {
    try { gsap.ticker.tick(); } catch(e) {}
  }, 16);

  // ─── GSAP entrance animations ──────────
  if (!prefersReducedMotion) {
    var animConfig = {
      '.anim-fade-up':     { opacity: 0, y: 40 },
      '.anim-fade-in':     { opacity: 0 },
      '.anim-scale-in':    { opacity: 0, scale: 0.9 },
      '.anim-slide-left':  { opacity: 0, x: -60 },
      '.anim-slide-right': { opacity: 0, x: 60 }
    };

    // Set initial states
    slides.forEach(function(section) {
      Object.keys(animConfig).forEach(function(selector) {
        section.querySelectorAll(selector).forEach(function(el) {
          gsap.set(el, animConfig[selector]);
        });
      });
      section.querySelectorAll('.bar-fill[data-width], .progress-bar-fill[data-width]').forEach(function(bar) {
        gsap.set(bar, { width: '0%' });
      });
    });

    // Activate slide via IntersectionObserver
    function activateSlide(section) {
      if (section.dataset.activated) return;
      section.dataset.activated = 'true';

      Object.keys(animConfig).forEach(function(selector) {
        section.querySelectorAll(selector).forEach(function(el) {
          var delay = (parseInt(el.dataset.delay) || 0) * 0.1;
          gsap.to(el, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, delay: delay, ease: 'expo.out' });
        });
      });

      section.querySelectorAll('.bar-fill[data-width], .progress-bar-fill[data-width]').forEach(function(bar) {
        gsap.to(bar, { width: bar.dataset.width + '%', duration: 1.2, delay: 0.3, ease: 'expo.out' });
      });

      section.querySelectorAll('[data-count]').forEach(function(el) {
        animateCounter(el);
      });

      // Checklist items stagger
      var checklistItems = section.querySelectorAll('.checklist li');
      checklistItems.forEach(function(li, i) {
        gsap.fromTo(li,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, delay: i * 0.08, ease: 'expo.out' }
        );
      });
    }

    var slideObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) activateSlide(entry.target);
      });
    }, { threshold: 0.15 });

    slides.forEach(function(slide) { slideObserver.observe(slide); });

    // Glow pulse
    document.querySelectorAll('.bg-glow').forEach(function(glow) {
      gsap.to(glow, { scale: 1.1, opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
  }

  // ─── Counter animation ─────────────────
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    var target = parseInt(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';

    if (prefersReducedMotion) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }

    var obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: 'power4.out',
      onUpdate: function() {
        el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
      }
    });
  }

  // ─── Scroll-based slide detection ──────
  ScrollTrigger.create({
    trigger: 'main',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: function(self) {
      var idx = Math.round(self.progress * (totalSlides - 1)) + 1;
      if (idx !== currentSlide) {
        currentSlide = idx;
        updateNav();
      }
    }
  });

  // ─── Navigation ────────────────────────
  function updateNav() {
    dots.forEach(function(dot) {
      dot.classList.toggle('active', parseInt(dot.dataset.slide) === currentSlide);
    });
    if (counter) counter.textContent = String(currentSlide).padStart(2, '0');
    if (presenterMode) {
      var s = document.getElementById('slide-' + currentSlide);
      if (s) presenterText.textContent = s.dataset.notes || '';
    }
  }

  function goToSlide(num) {
    if (num < 1 || num > totalSlides) return;
    currentSlide = num;
    var target = document.getElementById('slide-' + num);
    if (target) {
      gsap.to(window, { scrollTo: target, duration: prefersReducedMotion ? 0 : 0.8, ease: 'expo.out' });
    }
    updateNav();
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() { goToSlide(parseInt(dot.dataset.slide)); });
  });

  // ─── Keyboard controls ─────────────────
  document.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'ArrowDown': case ' ': case 'PageDown': case 'ArrowRight':
        e.preventDefault(); goToSlide(currentSlide + 1); break;
      case 'ArrowUp': case 'PageUp': case 'ArrowLeft':
        e.preventDefault(); goToSlide(currentSlide - 1); break;
      case 'Home': e.preventDefault(); goToSlide(1); break;
      case 'End': e.preventDefault(); goToSlide(totalSlides); break;
      case 'p': case 'P': togglePresenter(); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'Escape': if (presenterMode) togglePresenter(); break;
    }
  });

  // ─── Presenter mode ────────────────────
  function togglePresenter() {
    presenterMode = !presenterMode;
    presenterPanel.classList.toggle('visible', presenterMode);
    presenterPanel.setAttribute('aria-hidden', String(!presenterMode));
    if (presenterMode) {
      var s = document.getElementById('slide-' + currentSlide);
      if (s) presenterText.textContent = s.dataset.notes || '';
    }
  }

  // ─── Fullscreen ────────────────────────
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function(){});
    } else {
      document.exitFullscreen().catch(function(){});
    }
  }

  // ─── Initial state ─────────────────────
  updateNav();

  // Pulse keyframe
  var ss = document.createElement('style');
  ss.textContent = '@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }';
  document.head.appendChild(ss);

})();
<\/script>
</body>
</html>`;
}

// ─── Helpers ────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    // Fallback for non-hex values
    return `rgba(200, 16, 46, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
