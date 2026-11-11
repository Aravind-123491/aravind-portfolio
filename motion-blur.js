/* motion-blur.js — velocity-driven motion blur for Aravind's portfolio.
   Load AFTER cinematic-effects.js:  <script src="motion-blur.js"></script>
   Disable for testing with ?mb=off (or ?fx=off, which turns off every effect).

   What it does
   1. Scroll blur     – content blocks smear vertically in proportion to scroll speed
   2. Carousel blur   – the horizontal "Work" cards smear sideways as the track slides
   3. Marquee blur    – the skills ticker smears sideways when you scroll fast
   4. Cursor blur     – the custom cursor ring stretches in its direction of travel
   5. Entrance blur   – hero "rack focus", timeline slide-in and chip pop-in arrive out of blur

   Directional blur uses an SVG feGaussianBlur with a one-axis stdDeviation (e.g. "0 6").
   Safari handles SVG filters on HTML poorly, so it falls back to a plain CSS blur(). */
(function () {
  'use strict';
  if (/[?&](fx|mb)=off/.test(location.search)) { console.log('[motion-blur] disabled via query string'); return; }

  function init() {
    var root = document.documentElement;
    var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    var svgOK = !/^((?!chrome|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent);
    var I = fine ? 1 : 0.7;               /* intensity: a little gentler on touch screens */
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

    /* ---- tweak these -------------------------------------------------- */
    var MAX_SCROLL = 9;    /* max vertical blur (px) while scrolling   */
    var MAX_CARDS  = 10;   /* max horizontal blur on the Work carousel */
    var MAX_MARQ   = 12;   /* max horizontal blur on the ticker        */
    var MAX_CURSOR = 12;   /* max blur on the cursor ring              */
    /* ------------------------------------------------------------------- */

    /* Elements that smear vertically while the page scrolls.
       (Work section is excluded on purpose: it is pinned, so it blurs sideways instead.) */
    var V = ['.center-text-block', '.skill-card', '.detailed-header', '.timeline-content',
             '.about-text', '.info-tile', '.edu-card', '.skills-head', '.skill-group',
             '.contact-card .section-title', '.contact-mail', '.contact-links', '.contact-form'];
    var vSel = V.map(function (s) { return 'html.mb-v ' + s; }).join(',');

    var fV = svgOK ? 'url(#mb-y)'  : 'blur(var(--mb-iv,0px))';
    var fH = svgOK ? 'url(#mb-x)'  : 'blur(var(--mb-ih,0px))';
    var fM = svgOK ? 'url(#mb-mx)' : 'blur(var(--mb-im,0px))';

    var css =
      '.mb-svg{position:absolute;width:0;height:0;overflow:hidden;pointer-events:none}' +
      vSel + '{filter:' + fV + '!important}' +
      'html.mb-h .project-card{filter:' + fH + '!important}' +
      'html.mb-v .fx-track span{filter:' + fM + '!important}' +

      /* hero "rack focus": text pulls into focus as it fades in */
      '.card-content{filter:blur(18px);transition:opacity 1.5s ease-in-out,visibility 1.5s ease-in-out,filter 1.6s ease-in-out}' +
      'body.reveal .card-content{filter:none}' +

      /* timeline slides in out of a horizontal-feeling blur */
      'html.fx-ready .fx-tl{filter:blur(10px);transition:opacity 1s ease,transform 1s cubic-bezier(.2,.8,.2,1),filter 1s ease}' +
      'html.fx-ready .fx-tl.in{filter:none}' +

      /* skill chips pop in out of blur */
      'html.fx-ready .fx-pop{filter:blur(6px)}' +
      'html.fx-ready .fx-pop.in{filter:none;transition:opacity .5s var(--d,0s),scale .6s cubic-bezier(.34,1.56,.64,1) var(--d,0s),filter .5s var(--d,0s),background .2s,transform .2s}';

    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    /* One-axis blur filters. Regions are padded so the smear is never clipped. */
    var holder = document.createElement('div');
    holder.innerHTML =
      '<svg class="mb-svg" aria-hidden="true" focusable="false"><defs>' +
      '<filter id="mb-y"  x="-5%"  y="-40%" width="110%" height="180%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>' +
      '<filter id="mb-x"  x="-15%" y="-5%"  width="130%" height="110%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>' +
      '<filter id="mb-mx" x="-30%" y="-10%" width="160%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>' +
      '<filter id="mb-c"  x="-150%" y="-150%" width="400%" height="400%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>' +
      '</defs></svg>';
    document.body.appendChild(holder.firstChild);
    var blurOf = function (id) { return document.querySelector('#' + id + ' feGaussianBlur'); };
    var bY = blurOf('mb-y'), bX = blurOf('mb-x'), bM = blurOf('mb-mx'), bC = blurOf('mb-c');

    /* speed (px/frame) -> blur radius (px), rounded to 0.5 so we only touch the DOM when it visibly changes */
    function amt(v, dead, k, max) {
      var a = Math.abs(v); if (a < dead) return 0;
      return Math.round(Math.min((a - dead) * k * I, max * I) * 2) / 2;
    }

    var lastY = window.pageYOffset, vy = 0, warm = 20;           /* warm: ignore scroll-restore jump on load */
    var track = document.getElementById('workTrack'), lastL = null, vx = 0;
    var cx = -100, cy = -100, rx = -100, ry = -100, ring = null;
    var cur = { v: -1, h: -1, c: '' };

    if (fine) addEventListener('mousemove', function (e) { cx = e.clientX; cy = e.clientY; }, { passive: true });

    (function frame() {
      /* 1 + 3: vertical scroll speed -> content blur + marquee blur */
      var y = window.pageYOffset, dy = y - lastY; lastY = y;
      if (warm > 0) { warm--; dy = 0; }
      vy += (dy - vy) * 0.35;
      var sv = amt(vy, 0.8, 0.22, MAX_SCROLL);
      if (sv !== cur.v) {
        cur.v = sv;
        root.classList.toggle('mb-v', sv > 0);
        var sm = Math.min(sv * 1.3, MAX_MARQ * I);
        if (svgOK) { bY.setAttribute('stdDeviation', '0 ' + sv); bM.setAttribute('stdDeviation', sm + ' 0'); }
        else { root.style.setProperty('--mb-iv', sv * 0.45 + 'px'); root.style.setProperty('--mb-im', sm * 0.4 + 'px'); }
      }

      /* 2: horizontal speed of the Work carousel (desktop only; it stacks on mobile) */
      var sh = 0;
      if (track && innerWidth > 1024) {
        var l = track.getBoundingClientRect().left, dx = lastL === null ? 0 : l - lastL; lastL = l;
        vx += (dx - vx) * 0.35;
        sh = amt(vx, 0.8, 0.2, MAX_CARDS);
      } else { lastL = null; vx = 0; }
      if (sh !== cur.h) {
        cur.h = sh;
        root.classList.toggle('mb-h', sh > 0);
        if (svgOK) bX.setAttribute('stdDeviation', sh + ' 0');
        else root.style.setProperty('--mb-ih', sh * 0.45 + 'px');
      }

      /* 4: cursor ring. Replicates the ring's own easing so blur matches its real speed. */
      if (fine) {
        var nx = rx + (cx - rx) * 0.15, ny = ry + (cy - ry) * 0.15;
        var sx = amt(nx - rx, 0.8, 0.5, MAX_CURSOR), sy = amt(ny - ry, 0.8, 0.5, MAX_CURSOR);
        rx = nx; ry = ny;
        var key = sx + ',' + sy;
        if (key !== cur.c) {
          cur.c = key;
          ring = ring || document.querySelector('.fx-ring');
          if (ring) {
            if (sx || sy) {
              if (svgOK) { bC.setAttribute('stdDeviation', sx + ' ' + sy); ring.style.filter = 'url(#mb-c)'; }
              else ring.style.filter = 'blur(' + Math.max(sx, sy) * 0.5 + 'px)';
            } else ring.style.filter = '';
          }
        }
      }
      requestAnimationFrame(frame);
    })();

    console.log('[motion-blur] loaded' + (svgOK ? '' : ' (CSS-blur fallback for Safari)'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
