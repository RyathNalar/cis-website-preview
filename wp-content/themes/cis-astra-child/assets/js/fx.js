/* Visual effects: sticky header shadow, reveal on scroll, count-up.
   Everything is switched off for visitors who prefer reduced motion. */
(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasIO = 'IntersectionObserver' in window;

    /* Header shadow once the page is scrolled */
    var header = document.querySelector('header');
    var dock = document.querySelector('.cis-dock');
    function onScroll() {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 10);
        if (dock) dock.classList.toggle('show', window.scrollY > 420);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (reduce) return;

    if (!hasIO) return;

    /* Reveal on scroll */
    var selector = '.feature, .event-link, .cis-card, .fee, .spot-event, .glance-tile, .issue, .news-card, .spot-tile, .cis-fact, .cis-person, .cis-timeline li, .cis-callout, .cis-content details, .cis-table';
    var items = document.querySelectorAll(selector);
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            io.unobserve(el);
            el.classList.add('in');
            setTimeout(function () {
                el.classList.remove('reveal', 'in');
                el.style.transitionDelay = '';
            }, 1300);
        });
    }, { threshold: 0.12 });

    items.forEach(function (el) {
        var index = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.transitionDelay = (index % 6) * 70 + 'ms';
        el.classList.add('reveal');
        io.observe(el);
    });

    /* Count-up for the key figures (years are left alone) */
    document.querySelectorAll('.cis-fact strong').forEach(function (el) {
        var target = parseInt(el.textContent.replace(/\D/g, ''), 10);
        if (!target || target > 1900) return;
        var shown = false;
        var counter = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting || shown) return;
            shown = true;
            counter.disconnect();
            var start = null;
            function step(ts) {
                if (!start) start = ts;
                var t = Math.min((ts - start) / 1200, 1);
                el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
                if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
        counter.observe(el);
    });
})();
