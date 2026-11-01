/* Visual effects: sticky header shadow, floating particles in the hero, reveal on scroll, count-up.
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

    /* Floating particles over the hero */
    var canvas = document.querySelector('.hero-fx');
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
        var particles = [];
        var running = true;

        function resize() {
            W = canvas.clientWidth;
            H = canvas.clientHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function spawn(initial) {
            return {
                x: Math.random() * W,
                y: initial ? Math.random() * H : H + 20,
                r: 2 + Math.random() * 8,
                vy: 0.12 + Math.random() * 0.35,
                sway: Math.random() * Math.PI * 2,
                swaySpeed: 0.004 + Math.random() * 0.01,
                a: 0.10 + Math.random() * 0.26
            };
        }

        function init() {
            resize();
            var count = W < 700 ? 14 : 34;
            particles = [];
            for (var i = 0; i < count; i++) particles.push(spawn(true));
        }

        function frame() {
            if (running && !document.hidden) {
                ctx.clearRect(0, 0, W, H);
                for (var i = 0; i < particles.length; i++) {
                    var p = particles[i];
                    p.y -= p.vy;
                    p.sway += p.swaySpeed;
                    var x = p.x + Math.sin(p.sway) * 14;
                    if (p.y < -20) particles[i] = spawn(false);
                    var g = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.r * 2.6);
                    g.addColorStop(0, 'rgba(180,225,255,' + p.a + ')');
                    g.addColorStop(1, 'rgba(180,225,255,0)');
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(x, p.y, p.r * 2.6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            requestAnimationFrame(frame);
        }

        init();
        window.addEventListener('resize', init);
        if (hasIO) {
            new IntersectionObserver(function (entries) {
                running = entries[0].isIntersecting;
            }).observe(canvas);
        }
        requestAnimationFrame(frame);
    }

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
