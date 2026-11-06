/* Shared behaviour for help.html and support.html: icons, contents, ⌘K search window, active section. */
(function () {
  var I = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var ICONS = {
    compass: I('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>'),
    calendar: I('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    trophy: I('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>'),
    box: I('<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>'),
    users: I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3a6.5 6.5 0 0 1 3.5 5.7"/>'),
    mail: I('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>'),
    chart: I('<path d="M5 20V11M11 20V5M17 20v-6M3 20h18"/>'),
    info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>'),
    download: I('<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>'),
    sync: I('<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M4 3v5h5M20 21v-5h-5"/>'),
    wrench: I('<path d="M14.5 5.5a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3l9-9a4 4 0 0 0-2-2z"/>'),
    help: I('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.3-2.5 3.8M12 17.2v.01"/>'),
    bulb: I('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'),
    search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>')
  };
  var HUBS = {
    'basics': ['compass', '#5d6470'], 'hub-planning': ['calendar', '#0a6cff'], 'hub-athletics': ['trophy', '#f76b15'],
    'hub-operations': ['box', '#12a594'], 'hub-people': ['users', '#8e4ec6'], 'hub-communication': ['mail', '#e93d82'],
    'hub-admin': ['chart', '#3e63dd'],
    'about': ['info', '#0a6cff'], 'install': ['download', '#12a594'], 'using': ['compass', '#f76b15'],
    'data': ['sync', '#8e4ec6'], 'troubleshooting': ['wrench', '#e93d82'], 'faq': ['help', '#3e63dd']
  };
  function meta(id) { var m = HUBS[id] || ['info', '#0a6cff']; return { icon: ICONS[m[0]], tint: m[1] }; }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var hubs = [].slice.call(document.querySelectorAll('section.hub'));
  hubs.forEach(function (hub) {
    var m = meta(hub.id), h2 = hub.querySelector(':scope > h2');
    hub.style.setProperty('--tint', m.tint);
    if (h2) {
      var head = document.createElement('div');
      head.className = 'hub-head';
      head.innerHTML = '<span class="ic">' + m.icon + '</span>';
      h2.parentNode.insertBefore(head, h2);
      head.appendChild(h2);
    }
  });

  // Module polish: anchor links and "Good to know" callouts.
  [].slice.call(document.querySelectorAll('article.module')).forEach(function (a) {
    var h3 = a.querySelector('h3');
    if (h3 && a.id) h3.insertAdjacentHTML('beforeend', '<a class="anchor" href="#' + a.id + '" aria-label="Link to this topic">#</a>');
    [].slice.call(a.querySelectorAll('h4')).forEach(function (h4) {
      if (!/good to know/i.test(h4.textContent)) return;
      var list = h4.nextElementSibling;
      if (!list || !/^(UL|OL|P)$/.test(list.tagName)) return;
      var box = document.createElement('div');
      box.className = 'callout';
      box.innerHTML = ICONS.bulb + '<div><b>Good to know</b></div>';
      h4.parentNode.insertBefore(box, h4);
      box.lastChild.appendChild(list);
      h4.remove();
    });
  });

  // Hub cards and the side contents.
  var cards = document.getElementById('cards');
  var nav = document.getElementById('sidenav');
  hubs.forEach(function (hub) {
    var m = meta(hub.id), title = hub.querySelector('h2').textContent;
    var mods = [].slice.call(hub.querySelectorAll('article.module'));
    var lead = hub.querySelector('.lead');
    if (cards && hub.dataset.card !== 'no') {
      var c = document.createElement('a');
      c.className = 'card'; c.href = '#' + hub.id; c.style.setProperty('--tint', m.tint);
      c.innerHTML = '<span class="ic">' + m.icon + '</span><span><b>' + esc(title) + '</b><small>' + esc(lead ? lead.textContent : '') +
        '</small><em>' + (mods.length > 1 ? mods.length + ' topics' : 'Read') + ' →</em></span>';
      cards.appendChild(c);
    }
    if (nav) {
      var ul = document.createElement('ul');
      ul.style.setProperty('--tint', m.tint);
      var html = '<li><a class="hub-link" href="#' + hub.id + '"><i>' + m.icon + '</i>' + esc(title) + '</a></li>';
      if (mods.length > 1) mods.forEach(function (a) {
        html += '<li><a class="mod-link" data-for="' + a.id + '" href="#' + a.id + '">' + esc(a.querySelector('h3').childNodes[0].textContent) + '</a></li>';
      });
      ul.innerHTML = html;
      nav.appendChild(ul);
    }
  });

  // Search index: every module.
  function norm(s) { return s.toLowerCase().replace(/licen[cs]e/g, 'licen').replace(/colou?r/g, 'colr').replace(/organi[sz]/g, 'organi_').replace(/[‘’]/g, "'"); }
  function pattern(t) {
    if (t === 'licen') return 'licen[cs]e';
    if (t === 'colr') return 'colou?r';
    return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('organi_', 'organi[sz]');
  }
  var index = [].slice.call(document.querySelectorAll('article.module')).map(function (a) {
    var hub = a.closest('section.hub'), h3 = a.querySelector('h3');
    var title = h3 ? h3.childNodes[0].textContent.trim() : '';
    var body = (a.textContent || '').replace(/\s+/g, ' ').replace(title, '').replace(/#$/, '').trim();
    return { el: a, id: a.id, title: title, hub: hub ? hub.querySelector('h2').textContent : '', hubId: hub ? hub.id : '',
      t: norm(title), b: norm(body), body: body };
  });
  // Words match at the start of a word ("out" finds "outside" but not "about"); the whole phrase ranks highest.
  function wordRe(t) { return new RegExp('(^|[^a-z0-9])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); }
  function search(q) {
    var phrase = norm(q.trim()).replace(/\s+/g, ' ');
    var terms = phrase.split(' ').filter(Boolean);
    if (!terms.length) return [];
    var res = terms.map(wordRe), whole = terms.length > 1 ? wordRe(phrase) : null, out = [];
    index.forEach(function (d) {
      var score = 0;
      for (var i = 0; i < res.length; i++) {
        var inT = res[i].test(d.t), inB = res[i].test(d.b);
        if (!inT && !inB) return;
        score += inT ? 10 : 1;
      }
      if (whole) { if (whole.test(d.t)) score += 40; else if (whole.test(d.b)) score += 20; }
      if (d.t.indexOf(terms[0]) === 0) score += 5;
      score += Math.min((d.b.match(new RegExp(res[0].source, 'g')) || []).length, 5) * 0.3;
      out.push({ d: d, score: score, terms: terms, whole: whole });
    });
    return out.sort(function (a, b) { return b.score - a.score; }).slice(0, 12);
  }
  function snippet(d, terms, whole) {
    var sentences = d.body.split(/(?<=[.!?])\s+/);
    var hit = (whole && sentences.find(function (s) { return whole.test(norm(s)); })) ||
      sentences.find(function (s) { var n = norm(s); return terms.some(function (t) { return wordRe(t).test(n); }); }) || sentences[0] || '';
    if (hit.length > 150) hit = hit.slice(0, 147) + '…';
    var re = new RegExp('\\b(' + terms.map(pattern).join('|') + ')', 'gi');
    return esc(hit).replace(re, '<mark>$1</mark>');
  }

  // Search window.
  var sk = document.createElement('div');
  sk.className = 'sk'; sk.setAttribute('role', 'dialog'); sk.setAttribute('aria-modal', 'true'); sk.setAttribute('aria-label', 'Search');
  sk.innerHTML = '<div class="sk-box"><label class="sk-field">' + ICONS.search.replace('<svg', '<svg width="20" height="20"') +
    '<span class="sr">Search</span><input type="search" placeholder="Search help…" autocomplete="off" spellcheck="false" aria-controls="sk-list"><kbd>esc</kbd></label>' +
    '<ul class="sk-list" id="sk-list" role="listbox"></ul>' +
    '<div class="sk-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to open</span><span><kbd>esc</kbd> to close</span></div></div>';
  document.body.appendChild(sk);
  var input = sk.querySelector('input'), list = sk.querySelector('.sk-list'), results = [], cur = 0, lastFocus = null;

  function render() {
    results = search(input.value);
    cur = 0;
    if (!input.value.trim()) {
      list.innerHTML = '<li class="sk-group">Jump to</li>' + hubs.map(function (h) {
        var m = meta(h.id);
        return '<li><a class="sk-item" href="#' + h.id + '" style="--tint:' + m.tint + '"><span class="ic">' + m.icon + '</span><span><b>' +
          esc(h.querySelector('h2').textContent) + '</b></span></a></li>';
      }).join('');
      results = [].slice.call(list.querySelectorAll('.sk-item')).map(function (a) { return { href: a.getAttribute('href') }; });
      mark(); return;
    }
    if (!results.length) {
      list.innerHTML = '<li class="sk-empty">No results for “' + esc(input.value) + '”.<br>Try fewer words, or <a href="mailto:myworlddiscovered@gmail.com">ask us</a>.</li>';
      return;
    }
    var html = '', group = null;
    results.forEach(function (r, i) {
      var m = meta(r.d.hubId);
      if (r.d.hub !== group) { group = r.d.hub; html += '<li class="sk-group">' + esc(group) + '</li>'; }
      html += '<li><a class="sk-item" role="option" data-i="' + i + '" href="#' + r.d.id + '" style="--tint:' + m.tint + '"><span class="ic">' + m.icon +
        '</span><span><b>' + esc(r.d.title) + '</b><small>' + snippet(r.d, r.terms, r.whole) + '</small></span></a></li>';
      r.href = '#' + r.d.id;
    });
    list.innerHTML = html;
    mark();
  }
  function mark() {
    [].slice.call(list.querySelectorAll('.sk-item')).forEach(function (a, i) {
      a.classList.toggle('on', i === cur); a.setAttribute('aria-selected', i === cur);
      if (i === cur) a.scrollIntoView({ block: 'nearest' });
    });
  }
  function go(href) {
    close();
    var t = document.querySelector(href);
    if (!t) return;
    history.pushState(null, '', href);
    t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash');
  }
  function open(q) {
    lastFocus = document.activeElement;
    sk.classList.add('open');
    input.value = q || '';
    render();
    setTimeout(function () { input.focus(); input.select(); }, 10);
  }
  function close() { sk.classList.remove('open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  input.addEventListener('input', render);
  input.addEventListener('keydown', function (e) {
    var n = list.querySelectorAll('.sk-item').length;
    if (e.key === 'ArrowDown') { e.preventDefault(); cur = Math.min(cur + 1, n - 1); mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cur = Math.max(cur - 1, 0); mark(); }
    else if (e.key === 'Enter') { e.preventDefault(); var a = list.querySelectorAll('.sk-item')[cur]; if (a) go(a.getAttribute('href')); }
  });
  list.addEventListener('click', function (e) { var a = e.target.closest('.sk-item'); if (a) { e.preventDefault(); go(a.getAttribute('href')); } });
  sk.addEventListener('mousedown', function (e) { if (e.target === sk) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sk.classList.contains('open')) { e.preventDefault(); close(); return; }
    var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); sk.classList.contains('open') ? close() : open(); }
  });
  [].slice.call(document.querySelectorAll('[data-search]')).forEach(function (b) {
    b.addEventListener('click', function () { open(b.getAttribute('data-search') || ''); });
  });
  var q = new URLSearchParams(location.search).get('q');
  if (q) open(q);
  // The cards and contents above change the page height, so land on a linked topic again.
  if (location.hash && document.querySelector(location.hash)) {
    var target = document.querySelector(location.hash);
    setTimeout(function () { target.scrollIntoView({ block: 'start', behavior: 'instant' }); }, 60);
  }

  // Mark the topic in view in the side contents.
  if (nav && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        [].slice.call(nav.querySelectorAll('.active')).forEach(function (a) { a.classList.remove('active'); });
        var a = nav.querySelector('[data-for="' + e.target.id + '"]');
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    index.forEach(function (d) { obs.observe(d.el); });
  }
})();
