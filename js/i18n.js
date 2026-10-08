/*
 * English ↔ Hindi for the invitation.
 *
 * All language-specific copy lives in `translations` below; nothing else in
 * the site hard-codes Hindi. The HTML carries the English text plus a key:
 *
 *   data-i18n="key"                    → element content (may include <sup>, <br>, <em>)
 *   data-i18n-attr="aria-label:key;…"  → attributes (aria-label, alt, …)
 *
 * English is the default. The guest's choice is remembered in localStorage
 * and mirrored to <html lang>, which switches on the Hindi typography rules
 * in style.css. Map links and phone numbers never change.
 *
 * Public API (window.WeddingI18n): getLanguage, setLanguage, toggleLanguage,
 * applyLanguage, t. A `languagechange` event fires on document after a switch.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'tara-arun-language';
  var SUPPORTED = ['en', 'hi'];

  var translations = {
    en: {
      pageTitle: 'Tara Weds Arun · 21 November 2026',
      languageLabel: 'Language',

      // envelope
      envNames: 'Tara <em>&amp;</em> Arun',
      sealAria: 'Break the seal and open the invitation',
      openHint: 'Tap the seal to open',

      // cover + the card inside the envelope
      celebrationOf: 'The Wedding Celebration of',
      bride: 'Tara',
      groom: 'Arun',
      weds: 'weds',
      cardNames: '<span>Tara</span><em>weds</em><span>Arun</span>',
      cardDate: '21 · November · 2026',
      weddingDateLong: 'Saturday, 21<sup>st</sup> November 2026',
      coverArtAlt: 'Watercolour illustration of Arun in a wine sherwani smiling at Tara in blush pink',
      scrollDown: 'Scroll down',

      // the date + countdown
      theDate: 'The Date',
      dateAria: 'Saturday, 21st November 2026',
      saturday: 'Saturday',
      november: 'November',
      dateNum: '21<sup>st</sup>',
      countdownAria: 'Countdown to the wedding',
      countingDown: 'Counting Down',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',

      // welcome
      dearFamily: 'Dear Friends &amp; Family',
      welcomeText: 'With hearts full of happiness, we invite you to celebrate the beginning of a beautiful new chapter as Arun &amp; Tara begin their journey together.',
      proposalAlt: 'Illustration of Arun on one knee offering Tara a white rose beneath a wall of white flowers and candles',

      // family invitation
      brideParents: 'Mrs. Sunita &amp; Mr. Ravi Singh',
      request: 'request the pleasure of your gracious presence at the auspicious occasion of the wedding ceremony of their daughter',
      groomParents: '<span>Son of</span>Mrs. Sushma &amp; Late Shree Prithvi Singh',

      // seven steps
      promiseAlt: 'Illustration of Arun tenderly kissing Tara\'s hand',
      sevenSteps: 'The Seven Sacred Steps',
      step1: 'To provide for our household, keeping it pure and avoiding those things that might harm us.',
      step2: 'To develop our physical, mental &amp; spiritual power.',
      step3: 'To increase our wealth by righteous &amp; proper means.',
      step4: 'To acquire knowledge, wealth, happiness &amp; harmony by mutual love, respect &amp; trust.',
      step5: 'To be blessed with strong, virtuous &amp; heroic children.',
      step6: 'To strive for self-restraint &amp; longevity.',
      step7: 'To be true companions &amp; remain lifelong partners by this wedlock.',
      holyFire: 'In the presence of the holy fire,<br>they take their first steps into<br>a new life of togetherness.',

      // celebrations
      celebrations: 'The Celebrations',
      day1: 'Friday, 20<sup>th</sup> November 2026',
      haldi: 'Haldi',
      haldiTime: '11:00 AM',
      mehndiSangeet: 'Mehndi &amp; Sangeet',
      mehndiTime: '7:00 PM onwards',
      atHome: 'At Home',
      homeAddress: 'H.No 5, New Kushal Enclave<br>Near Shoki Jain Hospital<br>Bhabat, Zirakpur, Punjab',
      directions: 'Directions',
      day2: 'Saturday, 21<sup>st</sup> November 2026',
      swagatBarat: 'Swagat Barat',
      baratTime: '7:00 PM',
      dinner: 'Dinner',
      dinnerTime: '8:00 PM',
      doli: 'Doli',
      underStars: 'Under the Stars',
      followedBy: 'Followed by',
      dancePhere: 'Dance · Music · Phere',

      // venue
      theWedding: 'The Wedding',
      venueName: 'The Grand Nimantran',
      venueAddress: 'NH 7, Near Guru Nanak Service Station<br>Dhakoli, Zirakpur, Punjab – 160104',
      viewLocation: 'View Location',

      // RSVP
      rsvpTitle: 'We Would Love To Celebrate With You',
      rsvp: 'RSVP',
      anku: 'Anku Verma',
      callAnku: 'Call Anku',
      barkha: 'Barkha',
      callBarkha: 'Call Barkha',

      // blessings
      compliments: 'With Best Compliments From',
      bless1: 'Satpal Singh',
      bless2: 'Tulsi Ram',
      bless3: 'Amar Singh',
      bless4: 'Prem Pal',
      bless5: 'Chander Singh',
      bless6: 'Anku Verma',
      vermaFamily: '&amp; Whole Verma Family',
      littleStars: 'Little Stars',
      starsNames: 'Mahi, Devansh, Duggu &amp; Vani',

      // thank you
      togetherAlt: 'Watercolour illustration of Arun in a navy sherwani and Tara in blush pink, standing together before a floral arch with hanging lights',
      thankYou: 'Thank You',
      thanksText: 'For being a part of our story<br>and for celebrating this beautiful<br>beginning with us.',
      withLove: 'With Love,',
      signature: 'Arun &amp; Tara',

      // music (set from main.js)
      playMusic: 'Play music',
      pauseMusic: 'Pause music'
    },

    hi: {
      pageTitle: 'तारा संग अरुण · 21 नवंबर 2026',
      languageLabel: 'भाषा',

      envNames: 'तारा <em>संग</em> अरुण',
      sealAria: 'मुहर तोड़कर निमंत्रण खोलें',
      openHint: 'निमंत्रण खोलने के लिए मुहर छुएँ',

      celebrationOf: 'शुभ विवाह',
      bride: 'तारा',
      groom: 'अरुण',
      weds: 'संग',
      cardNames: '<span>तारा</span><em>संग</em><span>अरुण</span>',
      cardDate: '21 · नवंबर · 2026',
      weddingDateLong: 'शनिवार, 21 नवंबर 2026',
      coverArtAlt: 'जलरंग चित्र: वाइन रंग की शेरवानी में अरुण, गुलाबी परिधान में तारा को देखकर मुस्कुराते हुए',
      scrollDown: 'आगे देखें',

      theDate: 'शुभ तिथि',
      dateAria: 'शनिवार, 21 नवंबर 2026',
      saturday: 'शनिवार',
      november: 'नवंबर',
      dateNum: '21',
      countdownAria: 'विवाह की शुभ घड़ी तक शेष समय',
      countingDown: 'शुभ घड़ी की प्रतीक्षा',
      days: 'दिन',
      hours: 'घंटे',
      minutes: 'मिनट',
      seconds: 'सेकंड',

      dearFamily: 'प्रिय स्वजनों एवं मित्रों',
      welcomeText: 'हर्षित हृदय से हम आपको आमंत्रित करते हैं — अरुण और तारा के जीवन के इस सुंदर नए अध्याय के शुभारंभ में सम्मिलित होकर इस मंगल बेला को और भी विशेष बनाएँ।',
      proposalAlt: 'चित्र: सफ़ेद फूलों और मोमबत्तियों के बीच घुटने पर बैठकर तारा को सफ़ेद गुलाब भेंट करते अरुण',

      brideParents: 'श्रीमती सुनीता एवं श्री रवि सिंह',
      request: 'अपनी सुपुत्री के शुभ विवाह के पावन अवसर पर आपकी गरिमामयी उपस्थिति के सादर आकांक्षी हैं',
      groomParents: '<span>सुपुत्र</span>श्रीमती सुषमा एवं स्वर्गीय श्री पृथ्वी सिंह',

      promiseAlt: 'चित्र: स्नेह से तारा का हाथ चूमते अरुण',
      sevenSteps: 'सप्तपदी के सात वचन',
      step1: 'हम अपने घर-परिवार का पालन करें, उसे पवित्र रखें और हर अनिष्ट से दूर रहें।',
      step2: 'हम अपनी शारीरिक, मानसिक एवं आध्यात्मिक शक्ति का विकास करें।',
      step3: 'हम धर्म और सत्कर्म के मार्ग से अपनी समृद्धि बढ़ाएँ।',
      step4: 'परस्पर प्रेम, सम्मान एवं विश्वास से हम ज्ञान, सुख और सामंजस्य प्राप्त करें।',
      step5: 'हमें सबल, सद्गुणी एवं वीर संतान का आशीर्वाद मिले।',
      step6: 'हम संयम और दीर्घायु के लिए सदा प्रयत्नशील रहें।',
      step7: 'इस पावन बंधन में हम सच्चे साथी बनें और आजीवन एक-दूसरे का साथ निभाएँ।',
      holyFire: 'पवित्र अग्नि को साक्षी मानकर,<br>वे साथ-साथ अपने नए जीवन की<br>ओर पहले कदम बढ़ाते हैं।',

      celebrations: 'मांगलिक कार्यक्रम',
      day1: 'शुक्रवार, 20 नवंबर 2026',
      haldi: 'हल्दी',
      haldiTime: 'प्रातः 11:00 बजे',
      mehndiSangeet: 'मेहंदी एवं संगीत',
      mehndiTime: 'सायं 7:00 बजे से',
      atHome: 'निवास स्थान पर',
      homeAddress: 'मकान नं. 5, न्यू कुशल एन्क्लेव<br>शोकी जैन हॉस्पिटल के पास<br>भबात, ज़ीरकपुर, पंजाब',
      directions: 'रास्ता देखें',
      day2: 'शनिवार, 21 नवंबर 2026',
      swagatBarat: 'स्वागत बारात',
      baratTime: 'सायं 7:00 बजे',
      dinner: 'प्रीतिभोज',
      dinnerTime: 'रात्रि 8:00 बजे',
      doli: 'डोली',
      underStars: 'तारों की छाँव में',
      followedBy: 'तत्पश्चात',
      dancePhere: 'नृत्य · संगीत · फेरे',

      theWedding: 'शुभ विवाह',
      venueName: 'द ग्रैंड निमंत्रण',
      venueAddress: 'एन.एच. 7, गुरु नानक सर्विस स्टेशन के पास<br>ढकोली, ज़ीरकपुर, पंजाब – 160104',
      viewLocation: 'स्थान देखें',

      rsvpTitle: 'आपके आगमन की प्रतीक्षा रहेगी',
      rsvp: 'संपर्क सूत्र',
      anku: 'अंकु वर्मा',
      callAnku: 'अंकु को कॉल करें',
      barkha: 'बरखा',
      callBarkha: 'बरखा को कॉल करें',

      compliments: 'शुभेच्छु',
      bless1: 'सतपाल सिंह',
      bless2: 'तुलसी राम',
      bless3: 'अमर सिंह',
      bless4: 'प्रेम पाल',
      bless5: 'चंदर सिंह',
      bless6: 'अंकु वर्मा',
      vermaFamily: 'एवं समस्त वर्मा परिवार',
      littleStars: 'बाल मनुहार',
      starsNames: 'माही, देवांश, दुग्गू एवं वाणी',

      togetherAlt: 'जलरंग चित्र: फूलों के मेहराब और जगमगाती रोशनी के सामने साथ खड़े नेवी शेरवानी में अरुण और गुलाबी परिधान में तारा',
      thankYou: 'धन्यवाद',
      thanksText: 'हमारी कहानी का हिस्सा बनने<br>और इस सुंदर शुरुआत की खुशियों में<br>शामिल होने के लिए।',
      withLove: 'सप्रेम,',
      signature: 'अरुण एवं तारा',

      playMusic: 'संगीत चलाएँ',
      pauseMusic: 'संगीत रोकें'
    }
  };

  var currentLanguage = 'en';

  function readStored() {
    try { return global.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function store(lang) {
    try { global.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode etc. — still switches for this visit */ }
  }

  /** Translation for `key` in the current language, falling back to English. */
  function t(key) {
    var table = translations[currentLanguage] || translations.en;
    return table[key] != null ? table[key] : (translations.en[key] != null ? translations.en[key] : key);
  }

  function getLanguage() { return currentLanguage; }

  function applyLanguage() {
    var doc = global.document;
    doc.documentElement.lang = currentLanguage;
    doc.title = t('pageTitle');

    var nodes = doc.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var html = t(nodes[i].getAttribute('data-i18n'));
      if (nodes[i].innerHTML !== html) nodes[i].innerHTML = html; // trusted constants above
    }

    var attrNodes = doc.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrNodes.length; j++) {
      var pairs = attrNodes[j].getAttribute('data-i18n-attr').split(';');
      for (var k = 0; k < pairs.length; k++) {
        var p = pairs[k].split(':');
        if (p.length === 2) attrNodes[j].setAttribute(p[0].trim(), t(p[1].trim()));
      }
    }

    var buttons = doc.querySelectorAll('[data-lang-option]');
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].setAttribute('aria-pressed', buttons[b].getAttribute('data-lang-option') === currentLanguage ? 'true' : 'false');
    }
  }

  function setLanguage(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = 'en';
    var changed = lang !== currentLanguage;
    currentLanguage = lang;
    store(lang);
    if (!changed) return;

    var root = global.document.documentElement;
    root.classList.remove('lang-switching');
    void root.offsetWidth; // restart the cross-fade if the guest taps quickly
    root.classList.add('lang-switching');
    global.clearTimeout(setLanguage.timer);
    setLanguage.timer = global.setTimeout(function () { root.classList.remove('lang-switching'); }, 520);

    applyLanguage();
    var ev;
    try { ev = new CustomEvent('languagechange', { detail: { lang: lang } }); }
    catch (e) { ev = global.document.createEvent('CustomEvent'); ev.initCustomEvent('languagechange', false, false, { lang: lang }); }
    global.document.dispatchEvent(ev);
  }

  function toggleLanguage() { setLanguage(currentLanguage === 'en' ? 'hi' : 'en'); }

  // ---- the EN | हिंदी switch ----
  function initToggle() {
    var toggle = global.document.getElementById('langToggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-lang-option]') : null;
      if (btn) setLanguage(btn.getAttribute('data-lang-option'));
    });

    // Step aside while the guest scrolls down; return on scroll-up or near the top.
    var lastY = global.pageYOffset, away = false;
    global.addEventListener('scroll', function () {
      var y = global.pageYOffset;
      var next = y < 120 || y < lastY - 4 ? false : (y > lastY + 4 ? true : away);
      lastY = y;
      if (next !== away) { away = next; toggle.classList.toggle('is-away', away); }
    }, { passive: true });
  }

  // English unless the guest chose Hindi before (or storage is unavailable).
  currentLanguage = readStored() === 'hi' ? 'hi' : 'en';
  initToggle();
  applyLanguage();

  global.WeddingI18n = {
    translations: translations,
    getLanguage: getLanguage,
    setLanguage: setLanguage,
    toggleLanguage: toggleLanguage,
    applyLanguage: applyLanguage,
    t: t
  };
})(window);
