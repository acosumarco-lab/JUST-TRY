// =============================================
// VNYX Studio — Initiatives Horizontal Scroll
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== DOM =====
    const container = document.getElementById('hzContainer');
    const track = document.getElementById('hzTrack');
    const progressFill = document.getElementById('hzProgressFill');
    const scrollHint = document.getElementById('scrollHint');
    const menuTrigger = document.getElementById('menuTrigger');
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    const cursorFollower = document.getElementById('cursorFollower');

    if (!container || !track) {
        console.error('Missing elements:', { container, track });
        return;
    }

    // ===== State =====
    let hasScrolled = false;
    let menuOpen = false;

    // ===== Get max scroll =====
    function getMaxScroll() {
        return container.scrollWidth - container.clientWidth;
    }


    // ===== APPROACH: Native scrollLeft =====
    // The container has overflow-x: auto (scrollbar hidden via CSS).
    // We intercept wheel events and translate vertical delta → horizontal scrollLeft.

    container.addEventListener('wheel', (e) => {
        if (menuOpen) return;

        // Prevent default vertical scroll
        e.preventDefault();
        e.stopPropagation();

        // Use whichever axis has larger delta
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

        // Apply scroll directly to native scrollLeft
        container.scrollLeft += delta;

        // Hide scroll hint
        if (!hasScrolled && Math.abs(delta) > 2) {
            hasScrolled = true;
            if (scrollHint) scrollHint.classList.add('hidden');
        }
    }, { passive: false });


    // ===== Progress Bar + Parallax on scroll =====
    container.addEventListener('scroll', () => {
        const maxScroll = getMaxScroll();
        if (maxScroll > 0 && progressFill) {
            const progress = (container.scrollLeft / maxScroll) * 100;
            progressFill.style.width = progress + '%';
        }

        // Parallax
        applyParallax();
    });


    // ===== Parallax Effect =====
    const allPanels = document.querySelectorAll('.hz-cinematic, .hz-manifesto, .hz-split');

    function applyParallax() {
        allPanels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const viewCenter = window.innerWidth / 2;
            const offset = (centerX - viewCenter) / window.innerWidth;

            if (panel.classList.contains('hz-cinematic')) {
                const visual = panel.querySelector('.hz-cinematic-placeholder');
                if (visual) visual.style.transform = `translateX(${offset * -30}px)`;
            }

            if (panel.classList.contains('hz-split')) {
                const left = panel.querySelector('.hz-split-left');
                const right = panel.querySelector('.hz-split-right');
                if (left) left.style.transform = `translateX(${offset * -20}px)`;
                if (right) right.style.transform = `translateX(${offset * -50}px)`;
            }

            if (panel.classList.contains('hz-manifesto')) {
                const title = panel.querySelector('.hz-manifesto-title');
                if (title) title.style.transform = `translateX(${offset * -25}px)`;
            }
        });
    }


    // ===== Custom Cursor =====
    if (cursorFollower) {
        let cursorX = 0, cursorY = 0;
        let cursorTargetX = 0, cursorTargetY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorTargetX = e.clientX;
            cursorTargetY = e.clientY;
            cursorFollower.classList.add('visible');
        });

        document.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('visible');
        });

        function animateCursor() {
            cursorX += (cursorTargetX - cursorX) * 0.12;
            cursorY += (cursorTargetY - cursorY) * 0.12;
            cursorFollower.style.left = cursorX + 'px';
            cursorFollower.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .hz-cinematic, .hz-manifesto, .hz-split').forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
        });
    }


    // ===== Fullscreen Menu =====
    if (menuTrigger && fullscreenMenu) {
        menuTrigger.addEventListener('click', () => {
            menuOpen = !menuOpen;
            fullscreenMenu.classList.toggle('active', menuOpen);
            menuTrigger.classList.toggle('active', menuOpen);
        });
    }


    // ===== Keyboard =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenMenu && fullscreenMenu.classList.contains('active')) {
            fullscreenMenu.classList.remove('active');
            menuTrigger.classList.remove('active');
            menuOpen = false;
        }

        // Arrow keys scroll
        if (e.key === 'ArrowRight') container.scrollLeft += 300;
        if (e.key === 'ArrowLeft') container.scrollLeft -= 300;
    });


    // ===== Touch Support =====
    let touchStartX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        const deltaX = touchStartX - e.touches[0].clientX;
        if (Math.abs(deltaX) > 5) {
            container.scrollLeft += deltaX;
            touchStartX = e.touches[0].clientX;

            if (!hasScrolled) {
                hasScrolled = true;
                if (scrollHint) scrollHint.classList.add('hidden');
            }
        }
    }, { passive: true });


    // ===== i18n Translation System =====
    const translations = {
        en: {
            'init.header.tag': 'Beyond Client Work',
            'init.header.title': 'Our Initiatives',
            'init.header.subtitle': 'Self-initiated projects where we explore ideas, push creative boundaries, and build things we believe in.',
            'footer.tagline': 'Crafting visual excellence since 2024.',
            'footer.copy': '© 2024 VNYX Studio. All rights reserved.',
        },
        id: {
            'init.header.tag': 'Di Luar Klien',
            'init.header.title': 'Inisiatif Kami',
            'init.header.subtitle': 'Proyek mandiri di mana kami mengeksplorasi ide, mendorong batas kreativitas, dan membangun hal-hal yang kami yakini.',
            'footer.tagline': 'Menciptakan keunggulan visual sejak 2024.',
            'footer.copy': '© 2024 VNYX Studio. Hak cipta dilindungi.',
        }
    };

    function applyLanguage(lang) {
        const dict = translations[lang];
        if (!dict) return;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) el.textContent = dict[key];
        });
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (dict[key] !== undefined) el.innerHTML = dict[key];
        });
        document.documentElement.setAttribute('lang', lang);
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            localStorage.setItem('vnyx-lang', lang);
            applyLanguage(lang);
        });
    });

    const savedLang = localStorage.getItem('vnyx-lang');
    if (savedLang && savedLang !== 'en') {
        document.querySelectorAll('.lang-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-lang') === savedLang);
        });
        applyLanguage(savedLang);
    }


    console.log('◆ Initiatives loaded | scrollWidth:', container.scrollWidth, '| clientWidth:', container.clientWidth, '| maxScroll:', getMaxScroll());
});
