/* cinematic-effects.js — drop-in effects for Aravind's portfolio.
   Add before </body>:  <script src="cinematic-effects.js"></script>  */
(function () {
  'use strict';
  function boot() {
  /* Effects now run on every device (PC + mobile), even if the OS has "reduce motion" on.
     To turn them off for testing, open the page with ?fx=off */
  var reduce = /[?&]fx=off/.test(location.search);
  console.log('[cinematic-effects] loaded' + (reduce ? ' - effects disabled via ?fx=off' : ' - all effects ON'));
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- ORANGE THEME: remaps every blue/cyan/purple color in your page ---------- */
  var MAP = [
    [/#00e5ff/gi, '#ffb300'], [/#6e8efb/gi, '#ff7a1a'], [/#a777e3/gi, '#ff4a2e'],
    [/#9db4ff/gi, '#ffc47a'], [/#7a9dff/gi, '#ff9442'], [/#5a82ff/gi, '#ff8a3d'],
    [/#110d1c/gi, '#1c110b'], [/#0d121c/gi, '#1c150b'], [/#0a0e1c/gi, '#1a0f09'],
    [/#1a1a22/gi, '#251a13'], [/#111115/gi, '#17100c'], [/#0b0b10/gi, '#130c08'],
    [/#050505/gi, '#060403'], [/#080808/gi, '#0b0705'], [/#151515/gi, '#1b1410'],
    [/rgba\(\s*110\s*,\s*142\s*,\s*251\s*,/g, 'rgba(255,122,26,'], [/rgba\(\s*0\s*,\s*229\s*,\s*255\s*,/g, 'rgba(255,179,0,'],
    [/rgba\(\s*167\s*,\s*119\s*,\s*227\s*,/g, 'rgba(255,74,46,'], [/rgba\(\s*90\s*,\s*130\s*,\s*255\s*,/g, 'rgba(255,122,26,'],
    [/rgba\(\s*15\s*,\s*15\s*,\s*20\s*,/g, 'rgba(22,14,9,'], [/rgba\(\s*20\s*,\s*20\s*,\s*28\s*,/g, 'rgba(32,20,12,'],
    [/rgba\(\s*5\s*,\s*5\s*,\s*5\s*,/g, 'rgba(6,4,3,']
  ];
  function theme(s) { MAP.forEach(function (m) { s = s.replace(m[0], m[1]); }); return s; }
  $('style').forEach(function (s) { s.textContent = theme(s.textContent); });
  $('[stroke],[stop-color]').forEach(function (e) {
    ['stroke', 'stop-color'].forEach(function (a) { if (e.hasAttribute(a)) e.setAttribute(a, theme(e.getAttribute(a))); });
  });

  /* ---------- CSS ---------- */
  var css = `
  .fx-pre{position:fixed;inset:0;z-index:10000;pointer-events:none}
  .fx-pre i{position:absolute;left:0;width:100%;height:50.5%;background:#000;transition:transform 1.1s cubic-bezier(.77,0,.18,1) .2s}
  .fx-pre i:nth-child(1){top:0}.fx-pre i:nth-child(2){bottom:0}
  .fx-pre.go i:nth-child(1){transform:translateY(-100%)}.fx-pre.go i:nth-child(2){transform:translateY(100%)}
  .fx-pre b{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font:400 clamp(2rem,6vw,4rem)/1 'Anton',sans-serif;letter-spacing:12px;color:#fff;z-index:2;transition:opacity .5s,letter-spacing 1.2s cubic-bezier(.2,.8,.2,1)}
  .fx-pre b::after{content:'';display:block;height:2px;margin-top:14px;background:linear-gradient(90deg,#00e5ff,#a777e3);transform-origin:left;animation:fxLoad 1.2s ease forwards}
  .fx-pre.go b{opacity:0;letter-spacing:30px}
  @keyframes fxLoad{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  .fx-vig{position:fixed;inset:0;z-index:9997;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55))}
  .fx-bar{position:fixed;top:0;left:0;height:3px;width:100%;transform-origin:left;transform:scaleX(0);z-index:10001;background:linear-gradient(90deg,#00e5ff,#6e8efb,#a777e3);box-shadow:0 0 12px #6e8efb}
  .fx-canvas{position:fixed;inset:0;width:100%;height:100%;z-index:25;pointer-events:none;opacity:.85}
  .fx-dot,.fx-ring{position:fixed;top:0;left:0;pointer-events:none;z-index:10002;border-radius:50%;mix-blend-mode:difference}
  .fx-dot{width:8px;height:8px;background:#fff;margin:-4px 0 0 -4px}
  .fx-ring{width:38px;height:38px;margin:-19px 0 0 -19px;border:1.5px solid #fff;transition:width .3s,height .3s,margin .3s,background .3s}
  .fx-ring.hov{width:70px;height:70px;margin:-35px 0 0 -35px;background:rgba(255,255,255,.9)}
  body.fx-cur,body.fx-cur *{cursor:none!important}
  .navbar{transition:transform .5s cubic-bezier(.2,.8,.2,1),background .3s,backdrop-filter .3s}
  .navbar.fx-solid{background:rgba(5,5,5,.7);backdrop-filter:blur(16px);padding-top:1rem;padding-bottom:1rem}
  .navbar.fx-hide{transform:translateY(-110%)}
  .hero-name,.hero-role{background-size:250% 100%;animation:fxShift 6s ease-in-out infinite alternate}
  @keyframes fxShift{to{background-position:100% 0}}
  .hero-name{position:relative}
  .hero-name::before,.hero-name::after{content:attr(data-t);position:absolute;inset:0;opacity:0;pointer-events:none}
  .hero-name.glitch::before{opacity:.8;color:#00e5ff;-webkit-text-fill-color:#00e5ff;transform:translate(-4px,2px);clip-path:inset(20% 0 55% 0)}
  .hero-name.glitch::after{opacity:.8;color:#ff2d95;-webkit-text-fill-color:#ff2d95;transform:translate(4px,-2px);clip-path:inset(60% 0 10% 0)}
  .video-card video{filter:brightness(.45) contrast(1.15) sepia(.9) saturate(2.2) hue-rotate(-15deg)!important}
  .video-card{will-change:transform}
  .fx-spot{position:relative}
  .fx-spot::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(320px circle at var(--mx,50%) var(--my,50%),rgba(110,142,251,.2),transparent 60%)}
  .fx-spot:hover::after{opacity:1}
  .fx-marquee{position:relative;z-index:20;background:#050505;border-block:1px solid rgba(255,255,255,.06);overflow:hidden;padding:1.6rem 0}
  .fx-skew{will-change:transform}
  .fx-track{display:flex;width:max-content;animation:fxMar 28s linear infinite}
  .fx-marquee:hover .fx-track{animation-play-state:paused}
  .fx-track span{font:400 clamp(2.5rem,6vw,5rem)/1 'Anton',sans-serif;text-transform:uppercase;letter-spacing:3px;padding-right:3rem;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.28);white-space:nowrap;transition:color .3s}
  .fx-track span:nth-child(even){-webkit-text-stroke:0;background:linear-gradient(90deg,#00e5ff,#a777e3);-webkit-background-clip:text;background-clip:text}
  @keyframes fxMar{to{transform:translateX(-50%)}}
  .fx-ready .fx-tl{opacity:0;transition:opacity 1s ease,transform 1s cubic-bezier(.2,.8,.2,1)}
  .fx-ready .fx-tl:nth-child(odd){transform:translateX(-60px)}
  .fx-ready .fx-tl:nth-child(even){transform:translateX(60px)}
  .fx-ready .fx-tl.in{opacity:1;transform:none}
  .fx-ready .fx-blur{opacity:0;filter:blur(12px)}
  .fx-ready .fx-blur.in{opacity:1;filter:none;transition:opacity .9s ease var(--d,0s),filter .9s ease var(--d,0s),transform .4s ease,drop-shadow .4s}
  .timeline::before{background:linear-gradient(to bottom,transparent,#6e8efb,#a777e3,transparent)!important;opacity:.45}
  @property --fxa{syntax:'<angle>';inherits:false;initial-value:0deg}
  .section-title,.work-title{background:linear-gradient(100deg,#f0f0f0 40%,#9db4ff 50%,#f0f0f0 60%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:fxShine 5s linear infinite}
  @keyframes fxShine{from{background-position:150% 0}to{background-position:-50% 0}}
  .hero-role{min-height:1.2em}
  .fx-caret::after{content:'|';margin-left:4px;-webkit-text-fill-color:#00e5ff;animation:fxBlink 1s steps(1) infinite}
  @keyframes fxBlink{50%{opacity:0}}
  .logo:hover{animation:fxJit .3s steps(2) 2}
  @keyframes fxJit{50%{transform:translate(2px,-1px);text-shadow:-2px 0 #00e5ff,2px 0 #ff2d95}}
  .nav-links li a{transition:color .3s,letter-spacing .3s}.nav-links li a:hover{letter-spacing:3.5px}
  .skill-card{animation:fxFloat 5s ease-in-out infinite}
  .skill-card:nth-child(odd){animation-delay:-2s}.skill-card:nth-child(3n){animation-delay:-3.5s}
  @keyframes fxFloat{50%{translate:0 -10px}}
  .timeline-dot{animation:fxPulse 2.2s ease-out infinite}
  @keyframes fxPulse{0%{box-shadow:0 0 0 0 rgba(110,142,251,.7)}100%{box-shadow:0 0 0 22px rgba(110,142,251,0)}}
  .fx-conic{border:1px solid transparent!important;background:linear-gradient(#0b0b10,#0b0b10) padding-box,conic-gradient(from var(--fxa),#00e5ff,#a777e3,#6e8efb,#00e5ff) border-box!important;animation:fxSpin 6s linear infinite}
  @keyframes fxSpin{to{--fxa:360deg}}
  .fx-ready .fx-pop{opacity:0;scale:.5}
  .fx-ready .fx-pop.in{opacity:1;scale:1;transition:opacity .5s var(--d,0s),scale .6s cubic-bezier(.34,1.56,.64,1) var(--d,0s),background .2s,transform .2s}
  .fx-rip{position:fixed;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;border:2px solid #6e8efb;pointer-events:none;z-index:10003;animation:fxRip .8s ease-out forwards}
  @keyframes fxRip{to{transform:scale(10);opacity:0}}
  @media(max-width:1024px){.fx-ready .fx-tl:nth-child(n){transform:translateY(40px)}.fx-ready .fx-tl.in{transform:none}}
`;
  var st = document.createElement('style'); st.textContent = theme(css); document.head.appendChild(st);
  function mk(tag, cls, html) { var e = document.createElement(tag); e.className = cls; if (html) e.innerHTML = html; document.body.appendChild(e); return e; }

  /* ---------- Cinematic preloader (letterbox open) ---------- */
  var pre = mk('div', 'fx-pre', '<i></i><i></i><b>ARAVIND</b>');
  document.body.style.overflow = 'hidden';
  setTimeout(function () { pre.classList.add('go'); }, 1300);
  setTimeout(function () { pre.remove(); document.body.style.overflow = ''; }, 2700);

  /* ---------- Vignette + progress bar ---------- */
  mk('div', 'fx-vig');
  var bar = mk('div', 'fx-bar');

  /* ---------- Hero: animated gradient, glitch, text parallax ---------- */
  var name = document.querySelector('.hero-name');
  if (name) {
    name.setAttribute('data-t', name.textContent);
    if (!reduce) setInterval(function () {
      name.classList.add('glitch'); setTimeout(function () { name.classList.remove('glitch'); }, 140);
    }, 3800);
  }
  var tg = document.querySelector('.hero-text-group');
  if (tg && fine && !reduce) addEventListener('mousemove', function (e) {
    var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    tg.style.transform = 'translate(' + (-x * 24) + 'px,' + (-y * 16) + 'px)';
  });

  /* ---------- Skills marquee between Home and Stack ---------- */
  var stack = document.getElementById('stack');
  var skew = null;
  if (stack) {
    var words = ['React.js', 'Kotlin', 'JavaScript', 'Android', 'PHP', 'MySQL', 'Python', 'Java', 'Git'];
    var line = words.map(function (w) { return '<span>' + w + '</span>'; }).join('');
    var m = document.createElement('div'); m.className = 'fx-marquee';
    m.innerHTML = '<div class="fx-skew"><div class="fx-track">' + line + line + line + line + '</div></div>';
    stack.parentNode.insertBefore(m, stack); skew = m.firstChild;
  }

  /* ---------- Scroll: progress, navbar, hero zoom-out, marquee skew ---------- */
  var vc = document.querySelector('.video-card'), nav = document.querySelector('.navbar'), lastY = scrollY, vel = 0;
  function onScroll() {
    var y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (nav) {
      nav.classList.toggle('fx-solid', y > 40);
      nav.classList.toggle('fx-hide', y > lastY && y > 300 && !document.body.style.overflow);
    }
    vel += (y - lastY - vel) * .2; lastY = y;
    if (vc && !reduce) {
      var p = Math.min(y / innerHeight, 1);
      vc.style.transform = 'scale(' + (1 - p * .1) + ')'; vc.style.opacity = 1 - p * .5;
    }
    if (skew && !reduce) skew.style.transform = 'skewX(' + Math.max(-12, Math.min(12, -vel * .35)) + 'deg)';
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  (function decay() { vel *= .92; if (skew && !reduce && Math.abs(vel) > .05) skew.style.transform = 'skewX(' + Math.max(-12, Math.min(12, -vel * .35)) + 'deg)'; requestAnimationFrame(decay); })();

  /* ---------- Reveal on scroll: timeline slide, skill-card blur-in ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('fx-ready');
    $('.timeline-item').forEach(function (e) { e.classList.add('fx-tl'); });
    $('.skill-card').forEach(function (e, i) { e.classList.add('fx-blur'); e.style.setProperty('--d', (i % 4) * .12 + 's'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15 });
    $('.fx-tl,.fx-blur').forEach(function (e) { io.observe(e); });
  }

  /* ---------- Text scramble on titles ---------- */
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&';
  function scramble(el) {
    var txt = el.getAttribute('data-orig') || el.textContent; el.setAttribute('data-orig', txt);
    var f = 0, total = 24;
    var t = setInterval(function () {
      f++; var keep = Math.floor(txt.length * f / total);
      el.textContent = txt.split('').map(function (c, i) { return i < keep || c === ' ' ? c : chars[Math.random() * chars.length | 0]; }).join('');
      if (f >= total) { clearInterval(t); el.textContent = txt; }
    }, 35);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { scramble(e.target); so.unobserve(e.target); } });
    }, { threshold: .6 });
    $('.section-title,.work-title').forEach(function (e) { so.observe(e); });
  }

  /* ---------- Count-up numbers ---------- */
  function count(el) {
    var raw = el.textContent.trim(); if (!/^\d+(\.\d+)?$/.test(raw)) return;
    var to = parseFloat(raw), dec = (raw.split('.')[1] || '').length, t0 = performance.now();
    (function step(n) {
      var p = Math.min((n - t0) / 1600, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * e).toFixed(dec); if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; co.unobserve(e.target);
        var hero = e.target.closest('.home-section');
        hero ? setTimeout(function () { count(e.target); }, 6200) : count(e.target);
      });
    }, { threshold: .5 });
    $('.stat-value,.info-num').forEach(function (e) { co.observe(e); });
  }

  /* ---------- Mouse-driven: spotlight, 3D tilt, magnetic buttons ---------- */
  $('.project-card,.timeline-content,.skill-group,.info-tile,.stat-box,.edu-card').forEach(function (el) {
    el.classList.add('fx-spot');
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });
  if (fine && !reduce) {
    $('.stat-box,.info-tile,.skill-group,.edu-card,.skill-box').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = 'perspective(700px) rotateX(' + (-y * 12) + 'deg) rotateY(' + (x * 14) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
    $('.btn-primary,.btn-secondary,.btn-talk,.contact-links a').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .3 + 'px,' + (e.clientY - r.top - r.height / 2) * .4 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });

    /* ---------- Custom cursor ---------- */
    var dot = mk('div', 'fx-dot'), ring = mk('div', 'fx-ring'), mx = -100, my = -100, rx = -100, ry = -100;
    document.body.classList.add('fx-cur');
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)'; });
    (function loop() { rx += (mx - rx) * .15; ry += (my - ry) * .15; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) { ring.classList.toggle('hov', !!e.target.closest('a,button,.clickable,.burger,input,textarea')); });
  }

  /* ---------- v2: typewriter that cycles your roles ---------- */
  var role = document.querySelector('.hero-role');
  if (role && !reduce) {
    var roles = ['Web & Android Developer', 'Kotlin App Builder', 'Full-Stack Developer'], ri = 0, first = true;
    role.classList.add('fx-caret');
    var typeTo = function (txt, done) {
      var s = role.textContent, d = setInterval(function () {
        if (s.length) { s = s.slice(0, -1); role.textContent = s; return; }
        clearInterval(d); var k = 0, t = setInterval(function () {
          k++; role.textContent = txt.slice(0, k); if (k >= txt.length) { clearInterval(t); done(); }
        }, 70);
      }, 35);
    };
    (function cycle() {
      setTimeout(function () { ri = (ri + 1) % roles.length; typeTo(roles[ri], cycle); }, first ? 8000 : 2200); first = false;
    })();
  }

  /* ---------- v2: scroll-linked word-by-word text reveal ---------- */
  var wr = [];
  function splitWords(el) {
    var w = [];
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span'); s.textContent = p; s.style.opacity = .18; s.style.transition = 'opacity .25s'; f.appendChild(s); w.push(s);
          });
          n.replaceChild(f, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(el);
    wr.push({ el: el, w: w });
  }
  function updWords() {
    wr.forEach(function (o) {
      var r = o.el.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .9 - r.top) / (innerHeight * .45))), n = p * o.w.length;
      o.w.forEach(function (s, i) { s.style.opacity = .18 + .82 * Math.max(0, Math.min(1, n - i)); });
    });
  }
  if (!reduce) {
    $('.section-desc,.about-text p').forEach(splitWords);
    addEventListener('scroll', updWords, { passive: true }); updWords();
  }

  /* ---------- v2: wave parallax, chip pop-in, spinning borders, click ripple ---------- */
  var wave = document.querySelector('.bg-wave');
  if (wave && stack && !reduce) {
    wave.style.scale = '1.12';
    addEventListener('scroll', function () { wave.style.translate = (stack.getBoundingClientRect().top / innerHeight * 60) + 'px 0'; }, { passive: true });
  }
  if ('IntersectionObserver' in window && !reduce) {
    $('.skill-group').forEach(function (g) { $('.chip', g).forEach(function (c, i) { c.classList.add('fx-pop'); c.style.setProperty('--d', i * .07 + 's'); }); });
    var po = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { $('.fx-pop', e.target).forEach(function (c) { c.classList.add('in'); }); po.unobserve(e.target); } });
    }, { threshold: .3 });
    $('.skill-group').forEach(function (g) { po.observe(g); });
  }
  if (!reduce) $('.edu-card,.contact-card').forEach(function (e) { e.classList.add('fx-conic'); });
  addEventListener('click', function (e) {
    var r = document.createElement('div'); r.className = 'fx-rip'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    document.body.appendChild(r); setTimeout(function () { r.remove(); }, 800);
  });

  /* ---------- Tech stack: real brand logos (falls back to the text badge if offline) ---------- */
  var ICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';
  var logos = {
    'react.js': ['react', '#61dafb'], 'javascript': ['javascript', '#f7df1e'], 'html5': ['html5', '#e34f26'],
    'css3': ['css3', '#2d9cf0'], 'python': ['python', '#ffd43b'], 'java': ['java', '#f89820'],
    'mysql': ['mysql', '#4aa3d8'], 'git': ['git', '#f05032']
  };
  var ls = document.createElement('style');
  ls.textContent = '.skill-box img{width:56%;height:56%;object-fit:contain;pointer-events:none;filter:drop-shadow(0 4px 10px rgba(0,0,0,.5));transition:transform .45s cubic-bezier(.34,1.56,.64,1),filter .4s}' +
    '.skill-card:hover .skill-box img{transform:scale(1.2) rotate(-6deg);filter:drop-shadow(0 0 16px var(--c))}' +
    '.skill-card:hover .skill-box{box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 34px -4px var(--c),inset 0 1px 0 rgba(255,255,255,.1)}';
  document.head.appendChild(ls);
  $('.skill-card').forEach(function (card) {
    var nm = card.querySelector('.skill-name'), box = card.querySelector('.skill-box');
    var l = nm && logos[nm.textContent.trim().toLowerCase()];
    if (!l || !box) return;
    var img = new Image(); img.alt = nm.textContent.trim() + ' logo'; card.style.setProperty('--c', l[1]);
    img.onload = function () { box.textContent = ''; box.appendChild(img); };
    img.src = ICON + l[0] + '/' + l[0] + '-original.svg';
  });

  /* ---------- Particle network (reacts to the mouse) ---------- */
  {
    var spd = reduce ? .4 : 1;
    var cv = mk('canvas', 'fx-canvas'), c = cv.getContext('2d'), W, H, pts = [], pm = { x: -999, y: -999 };
    function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; pts = []; for (var n = 0; n < Math.min(70, W / 22); n++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }); }
    size(); addEventListener('resize', size);
    addEventListener('mousemove', function (e) { pm.x = e.clientX; pm.y = e.clientY; });
    (function draw() {
      c.clearRect(0, 0, W, H);
      pts.forEach(function (p, i) {
        p.x += p.vx * spd; p.y += p.vy * spd;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        c.fillStyle = 'rgba(255,170,40,.95)'; c.beginPath(); c.arc(p.x, p.y, 1.8, 0, 6.3); c.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) { c.strokeStyle = 'rgba(255,179,0,' + (1 - d / 120) * .25 + ')'; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke(); }
        }
        var dm = Math.hypot(p.x - pm.x, p.y - pm.y);
        if (dm < 160) { c.strokeStyle = 'rgba(255,74,46,' + (1 - dm / 160) * .5 + ')'; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(pm.x, pm.y); c.stroke(); }
      });
      requestAnimationFrame(draw);
    })();
  }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();