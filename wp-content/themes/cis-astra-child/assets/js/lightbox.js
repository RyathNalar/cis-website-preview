/* Click a photo in a gallery to see it large; arrows / swipe / Esc. */
(function () {
    var box, img, count, capEl, items = [], idx = 0, touchX = null;

    function build() {
        box = document.createElement('div');
        box.className = 'cis-lb';
        box.hidden = true;
        box.innerHTML = '<button class="cis-lb-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
            '<button class="cis-lb-prev" type="button" aria-label="Previous"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
            '<figure><img alt=""><figcaption><span class="cis-lb-cap"></span><span class="cis-lb-count"></span></figcaption></figure>' +
            '<button class="cis-lb-next" type="button" aria-label="Next"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
        document.body.appendChild(box);
        img = box.querySelector('img');
        capEl = box.querySelector('.cis-lb-cap');
        count = box.querySelector('.cis-lb-count');
        box.addEventListener('click', function (e) {
            var b = e.target.closest ? e.target.closest('button') : null;
            if (e.target === box || (b && b.classList.contains('cis-lb-close'))) close();
            else if (b && b.classList.contains('cis-lb-prev')) show(idx - 1);
            else if (b && b.classList.contains('cis-lb-next')) show(idx + 1);
        });
        box.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
        box.addEventListener('touchend', function (e) {
            if (touchX === null) return;
            var d = e.changedTouches[0].clientX - touchX;
            if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1));
            touchX = null;
        });
        document.addEventListener('keydown', function (e) {
            if (box.hidden) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(idx - 1);
            if (e.key === 'ArrowRight') show(idx + 1);
        });
    }

    function show(i) {
        idx = (i + items.length) % items.length;
        img.src = items[idx].src;
        img.alt = items[idx].alt;
        capEl.textContent = items[idx].cap;
        count.textContent = items.length > 1 ? (idx + 1) + ' / ' + items.length : '';
        box.classList.toggle('single', items.length < 2);
    }

    function open(list, i) {
        if (!box) build();
        items = list;
        box.hidden = false;
        document.documentElement.classList.add('cis-lb-open');
        show(i);
    }

    function close() {
        box.hidden = true;
        img.removeAttribute('src');
        document.documentElement.classList.remove('cis-lb-open');
    }

    document.addEventListener('click', function (e) {
        var g = e.target.closest ? e.target.closest('.cis-gallery') : null;
        if (!g) return;
        var node = e.target.closest('a, img');
        if (!node) return;
        var tiles = Array.prototype.slice.call(g.children);
        var list = tiles.map(function (t) {
            var im = t.tagName === 'IMG' ? t : t.querySelector('img');
            if (!im) return null;
            var src = t.tagName === 'A' ? t.getAttribute('href') : (im.currentSrc || im.src);
            return { src: src, alt: im.alt || '', cap: (t.getAttribute && t.getAttribute('data-caption')) || '', el: t };
        }).filter(Boolean);
        var at = -1;
        list.forEach(function (it, k) { if (it.el === node || it.el.contains(node)) at = k; });
        if (at < 0) return;
        e.preventDefault();
        open(list, at);
    });
})();
