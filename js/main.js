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

  function setMusicUI(playing) {
    musicBtn.classList.toggle('is-playing', playing);
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicBtn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  }

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
  var env = document.getElementById('env');
  var opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;
    playMusic(); // inside the user gesture, so browsers allow it

    var t = reduceMotion ? 0.25 : 1;
    env.classList.add('is-opening');
    envelope.classList.add('is-opening');
    setTimeout(function () { body.classList.add('is-revealed'); }, 1500 * t);
    setTimeout(function () { envelope.classList.add('is-fading'); }, 2150 * t);
    setTimeout(function () {
      envelope.classList.add('is-gone');
      body.classList.remove('is-sealed');
      musicBtn.classList.add('is-visible');
    }, 3100 * t);
  }

  document.getElementById('seal').addEventListener('click', openEnvelope);
  document.getElementById('openBtn').addEventListener('click', openEnvelope);

  /* ------------------------------------------------------------------
   * 4. Scroll reveals
   * ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.style.setProperty('--d', (n++ * 110) + 'ms');
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
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
  parallax();

  /* ------------------------------------------------------------------
   * 6. Scratch-to-reveal date
   * ---------------------------------------------------------------- */
  var cards = document.querySelectorAll('.scratch-card');
  var revealedCount = 0;

  function paintFoil(ctx, w, h, seed) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#f3e2bd');
    g.addColorStop(0.3, '#ddbd83');
    g.addColorStop(0.55, '#f6e8c8');
    g.addColorStop(0.8, '#cfa967');
    g.addColorStop(1, '#e9d2a2');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var r = F.rng(seed);
    for (var i = 0; i < w * h / 18; i++) {
      ctx.fillStyle = r() > 0.5 ? 'rgba(255,248,230,' + (r() * 0.35) + ')' : 'rgba(150,110,55,' + (r() * 0.18) + ')';
      ctx.fillRect(r() * w, r() * h, 1, 1);
    }
    // soft centre ornament
    ctx.strokeStyle = 'rgba(255,250,236,.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    ctx.fillStyle = 'rgba(255,250,236,.75)';
    ctx.font = '16px "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', w / 2, h / 2);
  }

  function finishCard(card) {
    if (card.classList.contains('revealed')) return;
    card.classList.add('revealed');
    revealedCount++;
    if (revealedCount === cards.length) {
      document.getElementById('dateAfter').classList.add('in');
      document.querySelector('.scratch-row').classList.add('all-revealed');
    }
  }

  Array.prototype.forEach.call(cards, function (card, idx) {
    var canvas = card.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = 1;
    var drawing = false, last = null, moved = 0, strokes = 0;

    function size() {
      if (card.classList.contains('revealed')) return;
      var rect = card.getBoundingClientRect();
      // Mobile browsers fire resize when the URL bar hides; keep scratches.
      if (!rect.width || (rect.width === w && rect.height === h)) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil(ctx, w, h, idx + 3);
    }

    function pt(e) {
      var rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function scratchLine(a, b) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 26;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x + 0.01, b.y);
      ctx.stroke();
    }

    function cleared() {
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var clear = 0, total = 0;
      for (var i = 3; i < data.length; i += 4 * 12) { total++; if (data[i] < 40) clear++; }
      return clear / total;
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (card.classList.contains('revealed')) return;
      drawing = true; moved = 0;
      last = pt(e);
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      card.classList.add('touched');
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pt(e);
      moved += Math.abs(p.x - last.x) + Math.abs(p.y - last.y);
      scratchLine(last, p);
      last = p;
      if (++strokes % 8 === 0 && cleared() > 0.45) { drawing = false; finishCard(card); }
    });
    function end() {
      if (!drawing) return;
      drawing = false;
      // A simple tap reveals the tile too — scratching is optional.
      if (moved < 8 || cleared() > 0.3) finishCard(card);
    }
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);

    size();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { w = 0; size(); });
    }
    window.addEventListener('resize', size);
  });
})();
