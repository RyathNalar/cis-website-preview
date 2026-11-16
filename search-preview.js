(function () {
  var BASE = 'https://ryathnalar.github.io/cis-website-preview';
  function norm(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  document.addEventListener('DOMContentLoaded', function () {
    var en = (document.documentElement.lang || '').indexOf('en') === 0;
    var form = document.querySelector('#cis-search form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = form.querySelector('input[name=s]').value.trim();
        if (q) location.href = BASE + (en ? '/en' : '') + '/search/?s=' + encodeURIComponent(q);
      });
    }
    if (!/\/search\/$/.test(location.pathname)) return;
    var q = new URLSearchParams(location.search).get('s') || '';
    var h1 = document.querySelector('h1');
    if (h1) h1.textContent = (en ? 'Search results: ' : 'Výsledky hledání: ') + q;
    var input = document.querySelector('#cis-search input[name=s]');
    if (input) input.value = q;
    var box = document.querySelector('main .wrap');
    if (!box) return;
    var words = norm(q).split(/\s+/).filter(Boolean);
    fetch(BASE + '/search-index.json').then(function (r) { return r.json(); }).then(function (all) {
      var kinds = { page: en ? 'Page' : 'Stránka', news: en ? 'News' : 'Zpráva', event: en ? 'Event' : 'Akce' };
      var hits = all.filter(function (d) {
        if (d.l !== (en ? 'en' : 'cs')) return false;
        var hay = norm(d.t + ' ' + d.x);
        return words.every(function (w) { return hay.indexOf(w) !== -1; });
      });
      hits.sort(function (a, b) {
        var at = words.every(function (w) { return norm(a.t).indexOf(w) !== -1; }) ? 0 : 1;
        var bt = words.every(function (w) { return norm(b.t).indexOf(w) !== -1; }) ? 0 : 1;
        return at - bt;
      });
      if (!hits.length) { box.innerHTML = '<p>' + (en ? 'Nothing found. Try another word.' : 'Nic jsme nenašli. Zkuste jiné slovo.') + '</p>'; return; }
      function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
      box.innerHTML = '<div class="cis-cards">' + hits.slice(0, 30).map(function (d) {
        var snip = d.x.length > 170 ? d.x.slice(0, 170) + '…' : d.x;
        return '<article class="cis-card"><div class="cis-card-date">' + kinds[d.k] + '</div><h2><a href="' + BASE + d.u + '">' + esc(d.t) + '</a></h2><p>' + esc(snip) + '</p><a class="more" href="' + BASE + d.u + '">' + (en ? 'Open →' : 'Otevřít →') + '</a></article>';
      }).join('') + '</div>';
    });
  });
})();
