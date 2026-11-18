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

    /* --------------------------------------------------------- Cold storage */
    var coldSection = document.getElementById('paket-cold-storage');

    if (coldSection) {
        var COLD_TIERS = {
            low: {
                label: 'Low Budget',
                panel: 'EPS',
                condenser: 'Outdoor AC',
                prices: { 1: 48000000, 2: 55000000, 3: 62000000, 5: 76000000 }
            },
            medium: {
                label: 'Medium',
                panel: 'EPS',
                condenser: 'CDU',
                prices: { 1: 64000000, 2: 71000000, 3: 78000000, 5: 92000000 }
            },
            premium: {
                label: 'Premium',
                panel: 'PIR',
                condenser: 'CDU',
                prices: { 1: 68000000, 2: 75000000, 3: 82000000, 5: 96000000 }
            }
        };

        var COLD_CAPACITY = {
            1: { dims: '200 \u00d7 150 \u00d7 250 cm', power: '1.300 watt', fan: '1 kipas', pk: '1,5 PK' },
            2: { dims: '230 \u00d7 175 \u00d7 250 cm', power: '1.300 watt', fan: '1 kipas', pk: '1,5 PK' },
            3: { dims: '230 \u00d7 230 \u00d7 250 cm', power: '1.700 watt', fan: '2 kipas', pk: '2 PK' },
            5: { dims: '290 \u00d7 290 \u00d7 250 cm', power: '1.700 watt', fan: '2 kipas', pk: '2 PK' }
        };

        var coldLabels = Array.prototype.slice.call(
            coldSection.querySelectorAll('.cs-picker .segmented label')
        );
        var coldHint = document.getElementById('csHint');
        var coldCards = Array.prototype.slice.call(coldSection.querySelectorAll('[data-cs-tier]'));
        var coldRows = Array.prototype.slice.call(coldSection.querySelectorAll('[data-cs-row]'));

        function rupiah(value) {
            return 'Rp' + String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        function juta(value) {
            var amount = Math.round((value / 1000000) * 10) / 10;
            return 'Rp' + String(amount).replace('.', ',') + ' juta';
        }

        function setColdText(card, selector, text) {
            var element = card.querySelector(selector);

            if (element) {
                element.textContent = text;
            }
        }

        function syncColdStorage() {
            var checked = coldSection.querySelector('input[name="csKapasitas"]:checked');
            var cap = checked ? parseInt(checked.value, 10) : 2;
            var spec = COLD_CAPACITY[cap];

            coldLabels.forEach(function (label) {
                var input = label.querySelector('input');
                label.classList.toggle('active', !!(input && input.checked));
            });

            coldCards.forEach(function (card) {
                var tier = COLD_TIERS[card.getAttribute('data-cs-tier')];

                if (!tier) {
                    return;
                }

                var price = tier.prices[cap];

                setColdText(card, '[data-cs-price]', rupiah(price));
                setColdText(card, '[data-cs-cap]', cap);
                setColdText(card, '[data-cs-perton]', '\u00b1 ' + juta(price / cap) + ' per ton');
                setColdText(card, '[data-cs-panel]', tier.panel);
                setColdText(card, '[data-cs-condenser]', tier.condenser + ' ' + spec.pk);
                setColdText(card, '[data-cs-fan]', spec.fan);
                setColdText(card, '[data-cs-power]', spec.power);
                setColdText(card, '[data-cs-dims]', spec.dims);
                setColdText(card, '[data-cs-cta]', 'Pesan ' + tier.label + ' ' + cap + ' ton');

                var link = card.querySelector('[data-cs-link]');

                if (link) {
                    link.href = waLink(
                        'Halo Gletser Indonesia, saya ingin order Cold Storage ' + tier.label + ' ' + cap +
                        ' ton, harga ' + rupiah(price) + '. Mohon info ketersediaan dan jadwal pengiriman.'
                    );
                }
            });

            coldRows.forEach(function (row) {
                row.classList.toggle('is-active', row.getAttribute('data-cs-row') === String(cap));
            });

            if (coldHint) {
                coldHint.textContent = 'Kapasitas ' + cap + ' ton: ruang ' + spec.dims + ', daya ' +
                    spec.power + '. Harga mulai ' + rupiah(COLD_TIERS.low.prices[cap]) + ' (Low Budget).';
            }
        }

        coldSection.querySelectorAll('input[name="csKapasitas"]').forEach(function (radio) {
            radio.addEventListener('change', syncColdStorage);
        });

        syncColdStorage();
    }

    /* ------------------------------------------------------ Offer countdown */
    var countdowns = document.querySelectorAll('.js-countdown');

    if (countdowns.length) {
        var OFFER_KEY = 'gletser.coldStorageOfferDeadline';
        var OFFER_DURATION = 24 * 60 * 60 * 1000;
        var offerDeadline = 0;

        try {
            var cachedDeadline = parseInt(window.localStorage.getItem(OFFER_KEY), 10);

            if (cachedDeadline > Date.now() && cachedDeadline - Date.now() <= OFFER_DURATION) {
                offerDeadline = cachedDeadline;
            }
        } catch (error) {
            offerDeadline = 0;
        }

        if (!offerDeadline) {
            offerDeadline = Date.now() + OFFER_DURATION;

            try {
                window.localStorage.setItem(OFFER_KEY, String(offerDeadline));
            } catch (error) {
                // Storage can be blocked; the countdown still runs for this visit.
            }
        }

        function padTime(value) {
            return value < 10 ? '0' + value : String(value);
        }

        function renderCountdown() {
            var remaining = offerDeadline - Date.now();

            if (remaining <= 0) {
                offerDeadline = Date.now() + OFFER_DURATION;

                try {
                    window.localStorage.setItem(OFFER_KEY, String(offerDeadline));
                } catch (error) {
                    // ignore storage failures
                }

                remaining = offerDeadline - Date.now();
            }

            var total = Math.floor(remaining / 1000);
            var hours = padTime(Math.floor(total / 3600));
            var minutes = padTime(Math.floor((total % 3600) / 60));
            var seconds = padTime(total % 60);

            countdowns.forEach(function (timer) {
                var timeHours = timer.querySelector('[data-time="hours"]');
                var timeMinutes = timer.querySelector('[data-time="minutes"]');
                var timeSeconds = timer.querySelector('[data-time="seconds"]');

                if (timeHours) {
                    timeHours.textContent = hours;
                }

                if (timeMinutes) {
                    timeMinutes.textContent = minutes;
                }

                if (timeSeconds) {
                    timeSeconds.textContent = seconds;
                }
            });
        }

        renderCountdown();
        window.setInterval(renderCountdown, 1000);
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
