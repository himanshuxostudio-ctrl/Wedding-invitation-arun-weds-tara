/*
 * Flora — a tiny SVG generator for the invitation's botanical artwork.
 * Everything decorative (embossed envelope roses, floral corners, gold
 * flourishes, arches, the venue facade) is drawn here so the page needs
 * no extra image files beyond the three couple illustrations.
 */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  // Deterministic random so the artwork is identical on every load.
  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return (s % 10000) / 10000;
    };
  }

  function f(n) { return Math.round(n * 10) / 10; }
  function rad(d) { return d * Math.PI / 180; }

  // Palettes: `emboss` is paper-on-paper (envelope), `color` is the
  // blush / ivory / sage watercolour look used on the invitation pages.
  var PALETTES = {
    emboss: {
      petal: '#f5ede3', petalIn: '#f1e7db', line: '#d5c1ab', lineSoft: '#e2d4c4',
      leaf: '#f3eadf', leafLine: '#d2bea8', stem: '#d9c7b3', dot: '#e8dccd'
    },
    color: {
      petal: '#fffaf5', petalIn: '#f6e3dc', line: '#c9a79a', lineSoft: '#dcc0b4',
      leaf: '#b3bf9f', leafLine: '#8d9b7c', stem: '#9aa88a', dot: '#e8c9c1',
      leaf2: '#cdd5bd', blush: '#f2d9d2'
    }
  };

  function rose(cx, cy, r, rot, p, opts) {
    opts = opts || {};
    var out = '<g transform="translate(' + f(cx) + ' ' + f(cy) + ') rotate(' + f(rot) + ')">';
    var petals = opts.petals || 6;
    // outer petals – overlapping lobes create the scalloped silhouette
    for (var i = 0; i < petals; i++) {
      var a = rad(i * 360 / petals);
      var d = r * 0.42;
      out += '<ellipse cx="' + f(Math.cos(a) * d) + '" cy="' + f(Math.sin(a) * d) +
        '" rx="' + f(r * 0.6) + '" ry="' + f(r * 0.46) + '" transform="rotate(' +
        f(i * 360 / petals) + ' ' + f(Math.cos(a) * d) + ' ' + f(Math.sin(a) * d) + ')" fill="' +
        (opts.fill || p.petal) + '" stroke="' + p.line + '" stroke-width="' + f(Math.max(0.6, r * 0.035)) + '"/>';
    }
    // middle cup
    out += '<circle r="' + f(r * 0.62) + '" fill="' + (opts.fillIn || p.petalIn) + '" stroke="' + p.line +
      '" stroke-width="' + f(Math.max(0.6, r * 0.035)) + '"/>';
    // inner swirl petals
    var sw = f(Math.max(0.6, r * 0.04));
    out += '<path d="M' + f(-r * 0.5) + ' ' + f(r * 0.1) + ' C' + f(-r * 0.5) + ' ' + f(-r * 0.45) + ' ' +
      f(r * 0.35) + ' ' + f(-r * 0.55) + ' ' + f(r * 0.48) + ' ' + f(-r * 0.05) + '" fill="none" stroke="' + p.line + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
    out += '<path d="M' + f(r * 0.45) + ' ' + f(r * 0.05) + ' C' + f(r * 0.42) + ' ' + f(r * 0.48) + ' ' +
      f(-r * 0.3) + ' ' + f(r * 0.52) + ' ' + f(-r * 0.38) + ' ' + f(r * 0.12) + '" fill="none" stroke="' + p.line + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
    out += '<path d="M' + f(-r * 0.28) + ' ' + f(-r * 0.05) + ' C' + f(-r * 0.25) + ' ' + f(-r * 0.32) + ' ' +
      f(r * 0.22) + ' ' + f(-r * 0.3) + ' ' + f(r * 0.24) + ' ' + f(-r * 0.02) + ' C' + f(r * 0.25) + ' ' + f(r * 0.22) + ' ' +
      f(-r * 0.12) + ' ' + f(r * 0.25) + ' ' + f(-r * 0.14) + ' ' + f(r * 0.04) + '" fill="none" stroke="' + p.line + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
    out += '<path d="M' + f(-r * 0.08) + ' ' + f(-r * 0.02) + ' c' + f(r * 0.05) + ' ' + f(-r * 0.1) + ' ' + f(r * 0.16) + ' ' + f(-r * 0.04) + ' ' +
      f(r * 0.12) + ' ' + f(r * 0.06) + '" fill="none" stroke="' + p.line + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
    return out + '</g>';
  }

  function leaf(x, y, len, ang, p, alt) {
    var w = len * 0.34;
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(ang) + ')">' +
      '<path d="M0 0 C' + f(len * 0.3) + ' ' + f(-w) + ' ' + f(len * 0.75) + ' ' + f(-w * 0.8) + ' ' + f(len) + ' 0 C' +
      f(len * 0.75) + ' ' + f(w * 0.8) + ' ' + f(len * 0.3) + ' ' + f(w) + ' 0 0Z" fill="' + (alt && p.leaf2 ? p.leaf2 : p.leaf) +
      '" stroke="' + p.leafLine + '" stroke-width="0.7"/>' +
      '<path d="M0 0 L' + f(len * 0.88) + ' 0" stroke="' + p.leafLine + '" stroke-width="0.6" fill="none"/>' +
      '</g>';
  }

  function bud(x, y, s, ang, p) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(ang) + ')">' +
      '<path d="M0 0 C' + f(-s * 0.5) + ' ' + f(-s * 0.4) + ' ' + f(-s * 0.35) + ' ' + f(-s * 1.1) + ' 0 ' + f(-s * 1.3) +
      ' C' + f(s * 0.35) + ' ' + f(-s * 1.1) + ' ' + f(s * 0.5) + ' ' + f(-s * 0.4) + ' 0 0Z" fill="' + p.petal + '" stroke="' + p.line + '" stroke-width="0.7"/>' +
      '<path d="M0 0 C' + f(-s * 0.4) + ' ' + f(-s * 0.2) + ' ' + f(-s * 0.45) + ' ' + f(-s * 0.6) + ' ' + f(-s * 0.3) + ' ' + f(-s * 0.75) +
      ' M0 0 C' + f(s * 0.4) + ' ' + f(-s * 0.2) + ' ' + f(s * 0.45) + ' ' + f(-s * 0.6) + ' ' + f(s * 0.3) + ' ' + f(-s * 0.75) +
      '" fill="none" stroke="' + p.leafLine + '" stroke-width="0.8"/></g>';
  }

  function blossom(x, y, s, p) {
    var out = '<g transform="translate(' + f(x) + ' ' + f(y) + ')">';
    for (var i = 0; i < 5; i++) {
      var a = rad(i * 72 - 90);
      out += '<circle cx="' + f(Math.cos(a) * s * 0.55) + '" cy="' + f(Math.sin(a) * s * 0.55) + '" r="' + f(s * 0.45) +
        '" fill="' + (p.blush || p.petal) + '" stroke="' + p.lineSoft + '" stroke-width="0.5"/>';
    }
    return out + '<circle r="' + f(s * 0.22) + '" fill="' + p.line + '" opacity=".6"/></g>';
  }

  // A stem following a quadratic curve with alternating leaves.
  function branch(x0, y0, cx, cy, x1, y1, p, opts) {
    opts = opts || {};
    var rand = opts.rand || Math.random;
    var out = '<path d="M' + f(x0) + ' ' + f(y0) + ' Q' + f(cx) + ' ' + f(cy) + ' ' + f(x1) + ' ' + f(y1) +
      '" fill="none" stroke="' + p.stem + '" stroke-width="' + (opts.sw || 1.1) + '" stroke-linecap="round"/>';
    var n = opts.leaves || 6;
    var size = opts.size || 16;
    for (var i = 1; i <= n; i++) {
      var t = i / (n + 1);
      var x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
      var y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
      var dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
      var dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
      var ang = Math.atan2(dy, dx) * 180 / Math.PI;
      var side = i % 2 ? 1 : -1;
      var len = size * (1 - t * 0.45) * (0.85 + rand() * 0.3);
      out += leaf(x, y, len, ang + side * (40 + rand() * 15), p, rand() > 0.6);
    }
    if (opts.tipBud) {
      var ta = Math.atan2(y1 - cy, x1 - cx) * 180 / Math.PI;
      out += bud(x1, y1, size * 0.55, ta + 90, p);
    } else {
      var tl = Math.atan2(y1 - cy, x1 - cx) * 180 / Math.PI;
      out += leaf(x1, y1, size * 0.6, tl, p);
    }
    return out;
  }

  /**
   * A rose cluster with radiating branches. `spread` is the bounding radius.
   * dir (degrees) biases where the trailing branches go.
   */
  function cluster(cx, cy, spread, seed, p, opts) {
    opts = opts || {};
    var rand = rng(seed);
    var back = '', front = '';
    var dirs = opts.dirs || [200, 250, 290, 340, 20, 160, 110, 60];
    for (var i = 0; i < dirs.length; i++) {
      var a = rad(dirs[i] + (rand() - 0.5) * 18);
      var L = spread * (0.75 + rand() * 0.35);
      var bend = (rand() - 0.5) * spread * 0.5;
      var ex = cx + Math.cos(a) * L, ey = cy + Math.sin(a) * L;
      var mx = cx + Math.cos(a) * L * 0.5 - Math.sin(a) * bend;
      var my = cy + Math.sin(a) * L * 0.5 + Math.cos(a) * bend;
      back += branch(cx, cy, mx, my, ex, ey, p, {
        rand: rand, leaves: 4 + Math.floor(rand() * 3), size: spread * 0.2, tipBud: rand() > 0.55
      });
    }
    var R = spread * 0.26;
    var roses = opts.roses || [
      [0, 0, 1], [-1.25, 0.55, 0.72], [1.2, 0.5, 0.7], [-0.45, -1.05, 0.6], [0.7, -0.95, 0.55], [0.05, 1.25, 0.6]
    ];
    for (var j = 0; j < roses.length; j++) {
      var rr = roses[j];
      front += rose(cx + rr[0] * R, cy + rr[1] * R, R * rr[2], rand() * 360, p);
    }
    if (p.blush) {
      for (var k = 0; k < 6; k++) {
        var ba = rand() * Math.PI * 2, bd = R * (1.6 + rand() * 0.8);
        front += blossom(cx + Math.cos(ba) * bd, cy + Math.sin(ba) * bd, R * 0.18, p);
      }
    }
    return back + front;
  }

  /** Corner spray: dense roses in a corner with vines along both edges. */
  function corner(seed, p, w, h) {
    w = w || 220; h = h || 220;
    var rand = rng(seed);
    var out = '';
    out += branch(30, 30, w * 0.55, 10, w - 6, 26, p, { rand: rand, leaves: 9, size: 20, tipBud: true });
    out += branch(30, 30, 8, h * 0.55, 22, h - 6, p, { rand: rand, leaves: 9, size: 20, tipBud: true });
    out += branch(40, 40, w * 0.45, h * 0.3, w * 0.62, h * 0.48, p, { rand: rand, leaves: 5, size: 17 });
    out += cluster(48, 48, 70, seed + 7, p, {
      dirs: [15, 60, 75, 35],
      roses: [[0, 0, 1.15], [1.35, 0.15, 0.75], [0.1, 1.4, 0.78], [1.05, 1.1, 0.62], [-0.7, 0.5, 0.6], [0.5, -0.7, 0.55]]
    });
    return out;
  }

  function svg(viewW, viewH, body, cls, extra) {
    return '<svg xmlns="' + NS + '" viewBox="0 0 ' + viewW + ' ' + viewH + '" class="' + (cls || '') +
      '" aria-hidden="true" focusable="false" ' + (extra || '') + '>' + body + '</svg>';
  }

  // ---------- Gold line ornaments ----------

  function flourish(w) {
    w = w || 240;
    var c = w / 2;
    var g = 'stroke="currentColor" fill="none" stroke-width="1" stroke-linecap="round"';
    return svg(w, 30,
      '<path ' + g + ' d="M' + (c - 16) + ' 15 C' + (c - 40) + ' 15 ' + (c - 50) + ' 4 ' + (c - 70) + ' 9 C' + (c - 84) + ' 13 ' + (c - 78) + ' 24 ' + (c - 68) + ' 20 C' + (c - 60) + ' 17 ' + (c - 66) + ' 10 ' + (c - 74) + ' 13"/>' +
      '<path ' + g + ' d="M' + (c + 16) + ' 15 C' + (c + 40) + ' 15 ' + (c + 50) + ' 4 ' + (c + 70) + ' 9 C' + (c + 84) + ' 13 ' + (c + 78) + ' 24 ' + (c + 68) + ' 20 C' + (c + 60) + ' 17 ' + (c + 66) + ' 10 ' + (c + 74) + ' 13"/>' +
      '<path ' + g + ' d="M' + (c - 70) + ' 15 L6 15 M' + (c + 70) + ' 15 L' + (w - 6) + ' 15" opacity=".55"/>' +
      '<path fill="currentColor" d="M' + c + ' 7 L' + (c + 6) + ' 15 L' + c + ' 23 L' + (c - 6) + ' 15Z"/>' +
      '<circle cx="' + (c - 12) + '" cy="15" r="1.6" fill="currentColor"/><circle cx="' + (c + 12) + '" cy="15" r="1.6" fill="currentColor"/>' +
      '<circle cx="4" cy="15" r="1.4" fill="currentColor"/><circle cx="' + (w - 4) + '" cy="15" r="1.4" fill="currentColor"/>',
      'flourish');
  }

  // Ogee / Mughal arch top. Drawn to sit on two straight side rules.
  function archTop(w, h) {
    w = w || 360; h = h || 170;
    var s = h * 0.98; // spring line
    function arch(inset) {
      var x0 = inset, x1 = w - inset, cx = w / 2, top = inset * 1.2 + 14;
      return 'M' + x0 + ' ' + h + ' L' + x0 + ' ' + (s * 0.72) +
        ' C' + x0 + ' ' + (s * 0.42) + ' ' + (cx - w * 0.2) + ' ' + (s * 0.36) + ' ' + (cx - w * 0.06) + ' ' + (top + 26) +
        ' C' + (cx - w * 0.02) + ' ' + (top + 14) + ' ' + cx + ' ' + (top + 6) + ' ' + cx + ' ' + top +
        ' C' + cx + ' ' + (top + 6) + ' ' + (cx + w * 0.02) + ' ' + (top + 14) + ' ' + (cx + w * 0.06) + ' ' + (top + 26) +
        ' C' + (cx + w * 0.2) + ' ' + (s * 0.36) + ' ' + x1 + ' ' + (s * 0.42) + ' ' + x1 + ' ' + (s * 0.72) +
        ' L' + x1 + ' ' + h;
    }
    var g = 'fill="none" stroke="currentColor" vector-effect="non-scaling-stroke"';
    var cx = w / 2;
    return svg(w, h,
      '<path ' + g + ' stroke-width="1.2" d="' + arch(1) + '"/>' +
      '<path ' + g + ' stroke-width="0.8" opacity=".7" d="' + arch(7) + '"/>' +
      // finial
      '<path fill="currentColor" d="M' + cx + ' 0 C' + (cx + 3) + ' 5 ' + (cx + 4) + ' 8 ' + cx + ' 14 C' + (cx - 4) + ' 8 ' + (cx - 3) + ' 5 ' + cx + ' 0Z"/>' +
      '<circle cx="' + cx + '" cy="17" r="1.6" fill="currentColor"/>',
      'arch-top', 'preserveAspectRatio="none"');
  }

  // Small line icons for the timeline.
  var ICONS = {
    haldi: '<circle cx="24" cy="24" r="6"/><g>' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) {
      return '<ellipse cx="24" cy="12" rx="4" ry="7" transform="rotate(' + a + ' 24 24)"/>';
    }).join('') + '</g>',
    mehndi: '<path d="M24 6 C34 14 38 24 32 34 C28 41 18 42 14 35 C10 28 18 22 24 26 C28 29 25 34 21 32"/><path d="M24 6 C22 12 18 15 15 17"/><circle cx="31" cy="20" r="1.4"/><circle cx="34" cy="27" r="1.2"/>',
    sangeet: '<path d="M18 34 V12 L36 8 V30"/><circle cx="14" cy="34" r="4"/><circle cx="32" cy="30" r="4"/><path d="M18 18 L36 14"/>',
    home: '<path d="M8 24 L24 10 L40 24"/><path d="M12 21 V40 H36 V21"/><path d="M20 40 V30 C20 26 28 26 28 30 V40"/>',
    barat: '<path d="M8 40 V20 C8 12 16 8 24 8 C32 8 40 12 40 20 V40"/><path d="M14 40 V22 C14 17 19 14 24 14 C29 14 34 17 34 22 V40"/><path d="M8 22 C13 26 18 26 24 22 C30 26 35 26 40 22"/><circle cx="24" cy="5" r="1.5"/>',
    dinner: '<circle cx="24" cy="26" r="11"/><circle cx="24" cy="26" r="6"/><path d="M6 12 V22 M9 12 V22 M12 12 V22 M6 22 C6 25 12 25 12 22 M9 24 V40"/><path d="M40 12 C36 14 36 22 40 24 V40"/>',
    doli: '<path d="M4 18 H44"/><path d="M12 18 C12 12 18 8 24 8 C30 8 36 12 36 18"/><path d="M14 18 V36 H34 V18"/><path d="M19 36 V24 C19 21 29 21 29 24 V36"/><circle cx="24" cy="6" r="1.4"/><path d="M14 36 L12 40 M34 36 L36 40"/>',
    stars: '<path d="M30 8 C22 10 18 18 20 26 C22 34 30 38 38 36 C30 40 18 38 13 30 C8 21 13 11 22 8 C25 7 28 7 30 8Z"/><path d="M36 14 L37 17 L40 18 L37 19 L36 22 L35 19 L32 18 L35 17Z"/><path d="M40 26 L40.6 27.6 L42 28 L40.6 28.4 L40 30 L39.4 28.4 L38 28 L39.4 27.6Z"/>',
    phere: '<path d="M24 8 C30 16 34 20 32 28 C31 33 27 36 24 36 C21 36 17 33 16 28 C14 20 18 16 24 8Z"/><path d="M24 22 C27 26 27 30 24 32 C21 30 21 26 24 22Z"/><path d="M10 40 H38 M14 36 L10 40 M34 36 L38 40"/>'
  };

  function icon(name) {
    return svg(48, 48, '<g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</g>', 'icon');
  }

  // Line-art palace facade for the venue page.
  function venue() {
    var g = 'fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"';
    function dome(cx, base, r, h) {
      return '<path d="M' + (cx - r) + ' ' + base + ' C' + (cx - r) + ' ' + (base - h * 0.7) + ' ' + (cx - r * 0.25) + ' ' + (base - h * 0.8) + ' ' + cx + ' ' + (base - h) +
        ' C' + (cx + r * 0.25) + ' ' + (base - h * 0.8) + ' ' + (cx + r) + ' ' + (base - h * 0.7) + ' ' + (cx + r) + ' ' + base + '"/>' +
        '<path d="M' + cx + ' ' + (base - h) + ' V' + (base - h - 10) + '"/><circle cx="' + cx + '" cy="' + (base - h - 12) + '" r="1.6"/>' +
        '<path d="M' + (cx - r - 4) + ' ' + base + ' H' + (cx + r + 4) + '"/>';
    }
    function cusped(x, y, w, h) {
      var c = x + w / 2, sp = y + h * 0.42;
      return '<path d="M' + x + ' ' + (y + h) + ' V' + sp + ' C' + x + ' ' + (y + h * 0.18) + ' ' + (c - w * 0.15) + ' ' + (y + h * 0.1) + ' ' + c + ' ' + y +
        ' C' + (c + w * 0.15) + ' ' + (y + h * 0.1) + ' ' + (x + w) + ' ' + (y + h * 0.18) + ' ' + (x + w) + ' ' + sp + ' V' + (y + h) + '"/>';
    }
    var b = '';
    b += '<path d="M10 200 H330"/><path d="M20 196 H320"/>';
    // main block
    b += '<path d="M40 196 V96 H300 V196"/><path d="M36 96 H304 M40 90 H300"/>';
    // central dome + drum
    b += '<path d="M130 90 V78 H210 V90"/>' + dome(170, 78, 36, 44);
    // chhatris
    b += '<path d="M48 90 V70 H82 V90 M52 70 V90 M78 70 V90"/>' + dome(65, 70, 16, 20);
    b += '<path d="M258 90 V70 H292 V90 M262 70 V90 M288 70 V90"/>' + dome(275, 70, 16, 20);
    // minarets
    b += '<path d="M24 196 V60 M34 196 V60 M22 60 H36"/>' + dome(29, 60, 6, 14);
    b += '<path d="M306 196 V60 M316 196 V60 M304 60 H318"/>' + dome(311, 60, 6, 14);
    // arches
    b += cusped(140, 112, 60, 84);
    b += cusped(148, 122, 44, 74);
    b += cusped(60, 132, 34, 64) + cusped(98, 132, 34, 64) + cusped(208, 132, 34, 64) + cusped(246, 132, 34, 64);
    b += '<path d="M60 110 H128 M212 110 H280"/>';
    b += '<path d="M150 196 L120 214 H220 L190 196"/>';
    return svg(340, 216, '<g ' + g + '>' + b + '</g>', 'venue-art');
  }

  global.Flora = {
    PALETTES: PALETTES,
    rng: rng,
    rose: rose,
    leaf: leaf,
    branch: branch,
    cluster: cluster,
    corner: corner,
    svg: svg,
    flourish: flourish,
    archTop: archTop,
    icon: icon,
    venue: venue
  };
})(window);
