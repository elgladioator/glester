/* ==========================================================================
   Gletser Indonesia — interactions
   ========================================================================== */

(function () {
    'use strict';

    var WA_NUMBER = '6281331112311';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var waLink = function (message) {
        return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
    };

    /* ---------------------------------------------------------------- Header */
    var header = document.getElementById('siteHeader');
    var menuToggle = document.getElementById('menuToggle');
    var navMenu = document.getElementById('navMenu');
    var navOverlay = document.getElementById('navOverlay');
    var scrollBar = document.getElementById('scrollBar');
    var toTop = document.getElementById('toTop');

    function openNav() {
        navMenu.classList.add('open');
        navOverlay.classList.add('show');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Tutup menu navigasi');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        navMenu.classList.remove('open');
        navOverlay.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Buka menu navigasi');
        document.body.style.overflow = '';
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            if (navMenu.classList.contains('open')) {
                closeNav();
            } else {
                openNav();
            }
        });

        navOverlay.addEventListener('click', closeNav);

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeNav();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 920) {
                closeNav();
            }
        });
    }

    /* ------------------------------------------------- Scroll progress / UI */
    function onScroll() {
        var top = window.scrollY || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollBar) {
            scrollBar.style.width = (height > 0 ? (top / height) * 100 : 0) + '%';
        }

        if (header) {
            header.classList.toggle('scrolled', top > 8);
        }

        if (toTop) {
            toTop.classList.toggle('show', top > 600);
        }

        updateActiveLink(top);
    }

    /* ------------------------------------------------------- Active nav link */
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var navLinks = navMenu
        ? Array.prototype.slice.call(navMenu.querySelectorAll('a[href^="#"]:not(.btn)'))
        : [];

    function updateActiveLink(scrollTop) {
        if (!sections.length || !navLinks.length) {
            return;
        }

        var offset = (header ? header.offsetHeight : 76) + 60;
        var currentId = '';

        sections.forEach(function (section) {
            if (section.offsetTop <= scrollTop + offset) {
                currentId = section.id;
            }
        });

        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }

    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ------------------------------------------------------------- Reveals */
    var revealItems = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add('in');
        });
    }

    /* ------------------------------------------------------------ Counters */
    var counters = document.querySelectorAll('[data-count]');

    function animateCounter(element) {
        var target = parseFloat(element.getAttribute('data-count'));
        var duration = 1400;
        var start = null;

        function frame(now) {
            if (start === null) {
                start = now;
            }

            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(frame);
    }

    if (counters.length) {
        if ('IntersectionObserver' in window && !reduceMotion) {
            var counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });

            counters.forEach(function (counter) {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach(function (counter) {
                counter.textContent = counter.getAttribute('data-count');
            });
        }
    }

    /* --------------------------------------------------------- Testimonials */
    var testiSwiper = document.querySelector('.testi-swiper');

    if (testiSwiper) {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.testi-swiper', {
                slidesPerView: 1,
                spaceBetween: 18,
                loop: true,
                speed: reduceMotion ? 0 : 700,
                grabCursor: true,
                autoplay: reduceMotion ? false : {
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                pagination: {
                    el: '.testi-swiper .swiper-pagination',
                    clickable: true
                },
                breakpoints: {
                    700: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }
            });
        } else {
            testiSwiper.classList.add('swiper-fallback');
        }
    }

    /* ------------------------------------------------------- FAQ accordion */
    var faqItems = document.querySelectorAll('.faq-item');

    function closeFaq(item) {
        item.classList.remove('open');
        var question = item.querySelector('.faq-q');
        var answer = item.querySelector('.faq-a');

        if (question) {
            question.setAttribute('aria-expanded', 'false');
        }

        if (answer) {
            answer.style.maxHeight = '';
        }
    }

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-q');
        var answer = item.querySelector('.faq-a');

        if (!question || !answer) {
            return;
        }

        question.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');

            faqItems.forEach(function (other) {
                if (other !== item) {
                    closeFaq(other);
                }
            });

            if (isOpen) {
                closeFaq(item);
            } else {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    window.addEventListener('resize', function () {
        document.querySelectorAll('.faq-item.open .faq-a').forEach(function (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        });
    });

    /* --------------------------------------------------- Kebutuhan estimator */
    var estimatorForm = document.getElementById('estimatorForm');

    if (estimatorForm) {
        var rangeInput = document.getElementById('kapasitas');
        var rangeValue = document.getElementById('kapasitasVal');
        var hint = document.getElementById('estimatorHint');
        var segmentedLabels = Array.prototype.slice.call(
            estimatorForm.querySelectorAll('.segmented label')
        );

        function formatTons(value) {
            var text = value % 1 === 0 ? String(value) : String(value).replace('.', ',');
            return text + ' ton';
        }

        function syncEstimator() {
            var value = parseFloat(rangeInput.value);
            var min = parseFloat(rangeInput.min);
            var max = parseFloat(rangeInput.max);
            var percent = ((value - min) / (max - min)) * 100;
            var selected = estimatorForm.querySelector('input[name="jenis"]:checked');
            var jenis = selected ? selected.value : 'Es Tube';

            rangeValue.textContent = formatTons(value);
            rangeInput.style.setProperty('--fill', percent + '%');

            if (hint) {
                hint.textContent = jenis === 'Belum yakin'
                    ? 'Kami bantu pilih jenis es yang paling menguntungkan untuk bisnis Anda.'
                    : 'Rekomendasi: Mesin ' + jenis + ' untuk kebutuhan \u00b1 ' + formatTons(value) + ' per hari.';
            }

            segmentedLabels.forEach(function (label) {
                var input = label.querySelector('input');
                label.classList.toggle('active', !!(input && input.checked));
            });
        }

        rangeInput.addEventListener('input', syncEstimator);

        estimatorForm.querySelectorAll('input[name="jenis"]').forEach(function (radio) {
            radio.addEventListener('change', syncEstimator);
        });

        syncEstimator();

        estimatorForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var selected = estimatorForm.querySelector('input[name="jenis"]:checked');
            var jenis = selected ? selected.value : 'Es Tube';
            var kapasitas = formatTons(parseFloat(rangeInput.value));
            var kotaInput = document.getElementById('kota');
            var kota = kotaInput ? kotaInput.value.trim() : '';

            var message = 'Halo Gletser Indonesia, saya ingin konsultasi mesin es.\n\n' +
                '\u2022 Jenis es: ' + jenis + '\n' +
                '\u2022 Estimasi kebutuhan: ' + kapasitas + ' per hari\n' +
                (kota ? '\u2022 Lokasi pemasangan: ' + kota + '\n' : '') +
                '\nMohon info harga dan rekomendasi kapasitas yang tepat. Terima kasih.';

            window.open(waLink(message), '_blank', 'noopener');
        });
    }

    /* ---------------------------------------------------------- Contact form */
    var contactForm = document.getElementById('contactForm');

    if (contactForm) {
        var formStatus = document.getElementById('formStatus');

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var nama = contactForm.querySelector('#nama').value.trim();
            var telepon = contactForm.querySelector('#wa').value.trim();
            var produk = contactForm.querySelector('#produk').value;
            var pesan = contactForm.querySelector('#pesan').value.trim();

            if (!nama || !telepon || !pesan) {
                if (formStatus) {
                    formStatus.style.color = '#dc2626';
                    formStatus.textContent = 'Mohon lengkapi nama, nomor WhatsApp, dan pesan Anda.';
                }
                return;
            }

            if (telepon.replace(/[^0-9]/g, '').length < 9) {
                if (formStatus) {
                    formStatus.style.color = '#dc2626';
                    formStatus.textContent = 'Nomor WhatsApp yang dimasukkan belum valid.';
                }
                return;
            }

            var message = 'Halo Gletser Indonesia, saya ' + nama + '.\n\n' +
                '\u2022 Produk: ' + produk + '\n' +
                '\u2022 WhatsApp: ' + telepon + '\n\n' +
                pesan;

            window.open(waLink(message), '_blank', 'noopener');

            if (formStatus) {
                formStatus.style.color = '';
                formStatus.textContent = 'Terima kasih! WhatsApp sedang dibuka untuk menyelesaikan pengiriman pesan.';
            }

            contactForm.reset();
        });
    }

    /* ---------------------------------------------------------- Ripple effect */
    if (!reduceMotion) {
        document.querySelectorAll('.btn').forEach(function (button) {
            button.addEventListener('click', function (event) {
                var rect = button.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var ripple = document.createElement('span');

                ripple.className = 'ripple';
                ripple.style.width = size + 'px';
                ripple.style.height = size + 'px';
                ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';

                button.appendChild(ripple);
                window.setTimeout(function () {
                    ripple.remove();
                }, 650);
            });
        });
    }

    /* --------------------------------------------------------- Hero parallax */
    var heroTilt = document.getElementById('heroTilt');

    if (heroTilt && finePointer && !reduceMotion) {
        heroTilt.addEventListener('mousemove', function (event) {
            var rect = heroTilt.getBoundingClientRect();
            var x = (event.clientX - rect.left) / rect.width - 0.5;
            var y = (event.clientY - rect.top) / rect.height - 0.5;

            heroTilt.style.setProperty('--ry', (x * 7).toFixed(2));
            heroTilt.style.setProperty('--rx', (-y * 7).toFixed(2));
        });

        heroTilt.addEventListener('mouseleave', function () {
            heroTilt.style.setProperty('--ry', 0);
            heroTilt.style.setProperty('--rx', 0);
        });
    }
})();
