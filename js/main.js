(function () {
  'use strict';

  var F = window.Flora;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ------------------------------------------------------------------
   * 1. Paint the botanical artwork into the placeholders
   * ---------------------------------------------------------------- */
  var sealCount = 0;

  function sealSVG() {
    var id = 'seal' + (sealCount++);
    var pts = [];
    for (var i = 0; i < 90; i++) {
      var t = i / 90 * Math.PI * 2;
      var r = 47 * (1 + 0.035 * Math.sin(7 * t) + 0.025 * Math.sin(11 * t + 0.7) + 0.018 * Math.sin(17 * t + 2));
      pts.push((50 + Math.cos(t) * r).toFixed(2) + ' ' + (50 + Math.sin(t) * r).toFixed(2));
    }
    var blob = 'M' + pts.join(' L') + 'Z';
    return F.svg(100, 100,
      '<defs>' +
        '<radialGradient id="' + id + 'w" cx="38%" cy="32%" r="75%">' +
          '<stop offset="0" stop-color="#fffaf1"/><stop offset=".45" stop-color="#f3e6d2"/>' +
          '<stop offset=".8" stop-color="#e2cdb0"/><stop offset="1" stop-color="#cdb08c"/></radialGradient>' +
        '<radialGradient id="' + id + 'i" cx="62%" cy="68%" r="80%">' +
          '<stop offset="0" stop-color="#fbf3e6"/><stop offset=".7" stop-color="#efe1cb"/><stop offset="1" stop-color="#dcc5a5"/></radialGradient>' +
      '</defs>' +
      '<path d="' + blob + '" fill="url(#' + id + 'w)"/>' +
      '<path d="' + blob + '" fill="none" stroke="#c6a57e" stroke-opacity=".45" stroke-width=".8"/>' +
      '<circle cx="50" cy="50" r="34" fill="url(#' + id + 'i)" stroke="#c9a77d" stroke-opacity=".6" stroke-width=".9"/>' +
      '<circle cx="50" cy="50" r="31" fill="none" stroke="#fffaf0" stroke-opacity=".8" stroke-width=".7"/>' +
      '<circle cx="50" cy="50" r="38.5" fill="none" stroke="#b89466" stroke-opacity=".35" stroke-width=".5" stroke-dasharray="1 2.2"/>',
      'seal-svg');
  }

  var E = F.PALETTES.emboss, C = F.PALETTES.color;

  var painters = {
    'emboss-top': function () {
      var r = F.rng(3);
      var body = F.cluster(150, 92, 92, 101, E, {
        dirs: [180, 200, 160, 0, 340, 20, 230, 310, 90, 60, 120]
      });
      body += F.branch(60, 60, 20, 30, 6, 4, E, { rand: r, leaves: 5, size: 14, tipBud: true });
      body += F.branch(240, 60, 280, 30, 294, 4, E, { rand: r, leaves: 5, size: 14, tipBud: true });
      return F.svg(300, 200, body);
    },
    'emboss-side': function () {
      var r = F.rng(9);
      var body = F.branch(40, 410, 90, 220, 36, 10, E, { rand: r, leaves: 13, size: 20, tipBud: true });
      body += F.branch(52, 300, 100, 250, 92, 170, E, { rand: r, leaves: 5, size: 15, tipBud: true });
      body += F.rose(60, 210, 20, 30, E) + F.rose(40, 240, 13, 120, E) + F.rose(70, 120, 12, 60, E) + F.rose(46, 330, 11, 10, E);
      return F.svg(120, 420, body);
    },
    'emboss-bottom': function () {
      var body = F.cluster(150, 120, 96, 205, E, {
        dirs: [180, 200, 165, 0, 345, 20, 240, 300, 270, 140, 40]
      });
      return F.svg(300, 230, body);
    },
    'seal': sealSVG,
    'corner': function (el) {
      return F.svg(230, 230, F.corner(+el.getAttribute('data-seed') || 1, C, 230, 230), 'corner-svg');
    },
    'spray': function (el) {
      var seed = +el.getAttribute('data-seed') || 1;
      return F.svg(320, 120, F.cluster(160, 60, 70, seed, C, {
        dirs: [178, 190, 168, 2, 350, 12, 210, 330, 150, 30],
        roses: [[0, 0, 1], [-1.3, 0.25, 0.7], [1.3, 0.2, 0.7], [-0.55, -0.85, 0.5], [0.6, 0.85, 0.5]]
      }), 'spray-svg');
    },
    'arch': function () { return F.archTop(360, 170); },
    'flourish': function () { return F.flourish(240); },
    'venue': function () { return F.venue(); }
  };

  Array.prototype.forEach.call(document.querySelectorAll('[data-flora]'), function (el) {
    var key = el.getAttribute('data-flora');
    var html;
    if (key.indexOf('icon:') === 0) html = F.icon(key.slice(5));
    else if (painters[key]) html = painters[key](el);
    if (html) el.insertAdjacentHTML('afterbegin', html);
  });

  /* ------------------------------------------------------------------
   * 2. Music
   * ---------------------------------------------------------------- */
  var audio = document.getElementById('bgm');
  var musicBtn = document.getElementById('music');
  var wantMusic = false;
  var fadeTimer = null;

  var i18n = window.WeddingI18n;
  function label(key, fallback) { return i18n ? i18n.t(key) : fallback; }

  function setMusicUI(playing) {
    musicBtn.classList.toggle('is-playing', playing);
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicBtn.setAttribute('aria-label', playing ? label('pauseMusic', 'Pause music') : label('playMusic', 'Play music'));
  }
  setMusicUI(false);
  document.addEventListener('languagechange', function () {
    setMusicUI(musicBtn.classList.contains('is-playing'));
  });

  function fadeIn() {
    clearInterval(fadeTimer);
    var v = 0;
    try { audio.volume = 0; } catch (e) { /* iOS: volume is read-only */ }
    fadeTimer = setInterval(function () {
      v = Math.min(0.75, v + 0.03);
      try { audio.volume = v; } catch (e) { clearInterval(fadeTimer); }
      if (v >= 0.75) clearInterval(fadeTimer);
    }, 80);
  }

  function playMusic() {
    wantMusic = true;
    var p = audio.play();
    if (p && p.then) {
      p.then(function () { setMusicUI(true); fadeIn(); })
       .catch(function () { setMusicUI(false); });
    } else {
      setMusicUI(true);
    }
  }

  function pauseMusic() {
    wantMusic = false;
    audio.pause();
    setMusicUI(false);
  }

  musicBtn.addEventListener('click', function () {
    if (audio.paused) playMusic(); else pauseMusic();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (!audio.paused) audio.pause(); }
    else if (wantMusic && audio.paused) { audio.play().catch(function () {}); }
  });

  /* ------------------------------------------------------------------
   * 3. Envelope opening
   * ---------------------------------------------------------------- */
  var envelope = document.getElementById('envelope');
  var card = envelope.querySelector('.env-card');
  var opened = false;

  // Seal reacts → cracks & falls → flap lifts → card rises → card becomes the page.
  function openEnvelope() {
    if (opened) return;
    opened = true;
    playMusic(); // inside the user gesture, so browsers allow it

    // ?slow=4 stretches the sequence for reviewing it frame by frame
    var slow = parseFloat((location.search.match(/[?&]slow=([\d.]+)/) || [])[1]) || 1;
    var k = (reduceMotion ? 0.3 : 1) * slow;
    function at(ms, fn) { setTimeout(fn, ms * k); }

    envelope.classList.add('is-pressed');
    at(190, function () { envelope.classList.add('is-released'); });
    at(650, function () { envelope.classList.add('is-lifting'); });
    at(1900, function () { envelope.classList.add('is-rising'); });
    at(3500, function () {
      // Grow the card from wherever it sits into the full invitation column.
      var r = card.getBoundingClientRect();
      var colW = Math.min(window.innerWidth, 480);
      var scale = colW / r.width;
      var dx = window.innerWidth / 2 - (r.left + r.width / 2);
      var dy = -r.top;
      var base = getComputedStyle(card).transform;
      card.style.transition = 'transform 1.4s cubic-bezier(.6,0,.2,1)';
      card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) ' + (base === 'none' ? '' : base) + ' scale(' + scale + ')';
      envelope.classList.add('is-expanding');
    });
    at(4500, function () { envelope.classList.add('is-fading'); });
    at(4600, function () { body.classList.add('is-revealed'); });
    at(5500, function () {
      envelope.classList.add('is-gone');
      body.classList.remove('is-sealed');
      musicBtn.classList.add('is-visible');
    });
  }

  document.getElementById('seal').addEventListener('click', openEnvelope);
  document.getElementById('openBtn').addEventListener('click', openEnvelope);

  /* ------------------------------------------------------------------
   * 4. Scroll reveals
   * ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // A fully clipped element has no visible area, so "unfold" panels are
    // watched through their parent instead.
    var watched = [];
    function revealTarget(el) { return el.getAttribute('data-reveal') === 'unfold' ? el.parentNode : el; }
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        watched.forEach(function (pair) {
          if (pair[1] !== en.target || pair[0].classList.contains('in')) return;
          pair[0].style.setProperty('--d', (n++ * 110) + 'ms');
          pair[0].classList.add('in');
        });
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(revealEls, function (el) {
      var t = revealTarget(el);
      watched.push([el, t]);
      io.observe(t);
    });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------------------------
   * 5. Gentle parallax
   * ---------------------------------------------------------------- */
  var parallaxEls = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function parallax() {
    ticking = false;
    var vh = window.innerHeight;
    for (var i = 0; i < parallaxEls.length; i++) {
      var el = parallaxEls[i];
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      var shift = (r.top + r.height / 2 - vh / 2) * parseFloat(el.getAttribute('data-parallax'));
      el.style.setProperty('--py', shift.toFixed(1) + 'px');
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
  }, { passive: true });
  window.addEventListener('resize', parallax);
  document.addEventListener('languagechange', parallax); // text length changes the layout
  parallax();

  /* ------------------------------------------------------------------
   * 6. Countdown — to the Swagat Barat, 7:00 PM IST on 21 November 2026
   * ---------------------------------------------------------------- */
  var WEDDING = Date.UTC(2026, 10, 21, 13, 30, 0); // 19:00 IST = 13:30 UTC
  var cdEls = {};
  Array.prototype.forEach.call(document.querySelectorAll('[data-cd]'), function (el) {
    cdEls[el.getAttribute('data-cd')] = el;
  });
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tick() {
    var left = Math.max(0, Math.floor((WEDDING - Date.now()) / 1000));
    var vals = {
      d: Math.floor(left / 86400),
      h: Math.floor(left % 86400 / 3600),
      m: Math.floor(left % 3600 / 60),
      s: left % 60
    };
    for (var key in vals) {
      var txt = pad(vals[key]);
      if (cdEls[key] && cdEls[key].textContent !== txt) cdEls[key].textContent = txt;
    }
    if (left > 0) setTimeout(tick, 1000 - Date.now() % 1000);
  }
  tick();
})();
