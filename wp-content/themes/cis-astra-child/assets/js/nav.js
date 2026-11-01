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
