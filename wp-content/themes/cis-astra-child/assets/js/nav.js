document.addEventListener('DOMContentLoaded', function () {

    var button = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.nav');

    if (button && nav) {
        button.addEventListener('click', function () {
            var open = nav.classList.toggle('mobile-open');
            button.setAttribute('aria-expanded', open);
        });
    }

    document.querySelectorAll('.nav-item > a').forEach(function (link) {
        link.addEventListener('click', function (event) {
            if (window.innerWidth > 900) return;

            var item = link.parentElement;
            if (!item.querySelector('.dropdown')) return;

            event.preventDefault();

            document.querySelectorAll('.nav-item.mobile-dropdown-open').forEach(function (other) {
                if (other !== item) other.classList.remove('mobile-dropdown-open');
            });

            item.classList.toggle('mobile-dropdown-open');
        });
    });

});

document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.cis-search-toggle');
    var panel = document.getElementById('cis-search');
    if (!toggle || !panel) return;
    function setOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            var input = panel.querySelector('input[type="search"]');
            if (input) input.focus();
        }
    }
    toggle.addEventListener('click', function () { setOpen(panel.hidden); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !panel.hidden) { setOpen(false); toggle.focus(); }
    });
});

/* Laureate list: a search box above it (added here so the page text stays plain). */
document.addEventListener('DOMContentLoaded', function () {
    var list = document.querySelector('.cis-names');
    if (!list) return;
    var en = (document.documentElement.lang || '').indexOf('en') === 0;
    var box = document.createElement('input');
    box.type = 'search';
    box.className = 'cis-names-filter';
    box.placeholder = en ? 'Search laureates…' : 'Hledat nositele…';
    box.setAttribute('aria-label', box.placeholder);
    list.parentNode.insertBefore(box, list);
    function norm(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
    box.addEventListener('input', function () {
        var q = norm(box.value.trim());
        Array.prototype.forEach.call(list.children, function (li) {
            li.classList.toggle('is-hidden', q !== '' && norm(li.textContent).indexOf(q) === -1);
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var menu = document.querySelector('.cis-member-menu');
    if (!menu) return;
    var icon = menu.querySelector('.cis-member-icon');
    icon.addEventListener('click', function (event) {
        // touch screens: the first tap opens the menu instead of leaving the page
        if (window.matchMedia('(hover: none)').matches) {
            event.preventDefault();
            var open = menu.classList.toggle('is-open');
            icon.setAttribute('aria-expanded', open);
        }
    });
    document.addEventListener('click', function (event) {
        if (!menu.contains(event.target)) menu.classList.remove('is-open');
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') menu.classList.remove('is-open');
    });
});
