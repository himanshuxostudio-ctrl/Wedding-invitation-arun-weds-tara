#!/usr/bin/env node
/*
 * Builds the dedicated Hindi invitation (hi/index.html) from index.html.
 *
 *   node tools/build-hindi.js          write hi/index.html
 *   node tools/build-hindi.js --check  exit 1 if hi/index.html is out of date
 *
 * The Hindi page is the same document with:
 *   - <html lang="hi" data-lang-lock="hi">  → js/i18n.js renders Hindi before
 *     first paint, never reads or writes the saved language choice
 *   - Hindi <title> and share-preview text (WhatsApp etc. don't run JS)
 *   - no EN | हिंदी switch
 *   - asset paths pointing one folder up, so every file is shared
 *
 * All wording comes from js/i18n.js; edit copy there or in index.html, then
 * re-run this script. No dependencies — plain Node.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var root = path.resolve(__dirname, '..');
var srcFile = path.join(root, 'index.html');
var outFile = path.join(root, 'hi', 'index.html');

// Load the translation table from js/i18n.js with a tiny stand-in document.
function loadTranslations() {
  var noop = function () {};
  var fakeRoot = { getAttribute: function () { return null; }, classList: { add: noop, remove: noop }, offsetWidth: 0 };
  var sandbox = {
    document: { documentElement: fakeRoot, querySelectorAll: function () { return []; }, getElementById: function () { return null; }, dispatchEvent: noop },
    localStorage: { getItem: function () { return null; }, setItem: noop },
    addEventListener: noop, setTimeout: setTimeout, clearTimeout: clearTimeout, pageYOffset: 0
  };
  sandbox.window = sandbox;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'js', 'i18n.js'), 'utf8').replace(/\}\)\(window\);\s*$/, '})(this);'), sandbox);
  return sandbox.WeddingI18n.translations;
}

function attr(s) { return s.replace(/&(?!amp;|lt;|gt;|quot;)/g, '&amp;').replace(/"/g, '&quot;'); }

function replaceOnce(html, pattern, replacement, what) {
  var count = 0;
  var out = html.replace(pattern, function () { count++; return typeof replacement === 'function' ? replacement.apply(null, arguments) : replacement; });
  if (count !== 1) throw new Error('build-hindi: expected exactly one ' + what + ' in index.html, found ' + count);
  return out;
}

function build() {
  var hi = loadTranslations().hi;
  var html = fs.readFileSync(srcFile, 'utf8');

  html = replaceOnce(html, '<html lang="en">',
    '<!-- GENERATED from ../index.html by tools/build-hindi.js — edit the source, then re-run the script. -->\n<html lang="hi" data-lang-lock="hi">', '<html lang="en">');
  html = replaceOnce(html, /<title>[^<]*<\/title>/, '<title>' + hi.pageTitle + '</title>', '<title>');
  html = replaceOnce(html, /(<meta name="description" content=")[^"]*(">)/, function (m, a, b) { return a + attr(hi.metaDescription) + b; }, 'meta description');
  html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*(">)/, function (m, a, b) { return a + attr(hi.pageTitle) + b; }, 'og:title');
  html = replaceOnce(html, /(<meta property="og:description" content=")[^"]*(">)/, function (m, a, b) { return a + attr(hi.shareDescription) + b; }, 'og:description');
  html = replaceOnce(html, /<meta property="og:type" content="website">/, function (m) { return m + '\n  <meta property="og:locale" content="hi_IN">'; }, 'og:type');

  // the saved-choice check is irrelevant on a page that is always Hindi
  html = replaceOnce(html, /\s*<script>try\{if\(localStorage[^<]*<\/script>/, '', 'language pre-check script');
  // Hindi-only page: no language switch
  html = replaceOnce(html, /\s*<div class="lang-toggle"[\s\S]*?<\/div>\n/, '\n', 'language switch');

  // share every asset with the main page
  html = html.replace(/((?:src|href)=")(assets|css|js)\//g, '$1../$2/');

  return html;
}

var out = build();
if (process.argv.indexOf('--check') !== -1) {
  var current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';
  if (current !== out) {
    console.error('hi/index.html is out of date — run: node tools/build-hindi.js');
    process.exit(1);
  }
  console.log('hi/index.html is up to date.');
} else {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, out);
  console.log('Wrote ' + path.relative(root, outFile));
}
