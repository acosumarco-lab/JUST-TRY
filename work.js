// =============================================
// VNYX Studio — Work Page Script
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== DOM =====
    const menuTrigger = document.getElementById('menuTrigger');
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    const cursorFollower = document.getElementById('cursorFollower');
    const navbar = document.getElementById('navbar');
    const caseStudyOverlay = document.getElementById('caseStudyOverlay');
    const caseStudyClose = document.getElementById('caseStudyClose');
    const caseStudyScroll = document.getElementById('caseStudyScroll');
    const caseStudyHero = document.getElementById('caseStudyHero');
    const csCategory = document.getElementById('csCategory');
    const csTitle = document.getElementById('csTitle');
    const csDescription = document.getElementById('csDescription');
    const csCredits = document.getElementById('csCredits');
    const csGallery = document.getElementById('csGallery');


    // ===== Navbar Scroll =====
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


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

        document.querySelectorAll('a, button, .portfolio-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
        });
    }


    // ===== Fullscreen Menu =====
    if (menuTrigger && fullscreenMenu) {
        menuTrigger.addEventListener('click', () => {
            const isOpen = fullscreenMenu.classList.contains('active');
            if (isOpen) {
                fullscreenMenu.classList.remove('active');
                menuTrigger.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                fullscreenMenu.classList.add('active');
                menuTrigger.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        document.querySelectorAll('.menu-item').forEach(link => {
            link.addEventListener('click', () => {
                fullscreenMenu.classList.remove('active');
                menuTrigger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // ===== Portfolio Filters =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = '';
                    // Re-trigger staggered animation
                    item.classList.remove('revealed');
                    setTimeout(() => {
                        item.classList.add('revealed');
                    }, index * 60);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    // ===== Scroll Reveal (Staggered Fade-Up) =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });


    // ===== Project Data (Case Studies) =====
    const projectData = {
        1: {
            title: 'Obsidian Luxury',
            category: 'Branding',
            description: 'A complete rebrand for a premium lifestyle company, transforming their visual identity into a sleek, monochromatic presence that speaks sophistication without a single word. Every touchpoint — from business cards to flagship store signage — was reimagined to convey understated power.',
            role: 'Brand Strategy, Visual Identity, Art Direction',
            year: '2024',
            team: 'VNYX Creative Team',
            heroGradient: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 40%, #111 100%)',
            gallery: [
                { icon: '◆', class: 'gallery-item-wide' },
                { icon: '◇', class: '' },
                { icon: '□', class: 'gallery-item-tall' },
                { icon: '△', class: '' },
                { icon: '○', class: 'gallery-item-wide' },
                { icon: '⬡', class: '' },
            ]
        },
        2: {
            title: 'Noir Finance',
            category: 'UI/UX Design',
            description: 'A dark-mode-first fintech dashboard that makes complex financial data feel elegant and approachable. We redesigned the entire user journey — from onboarding to advanced analytics — with a focus on clean data visualization that meets premium aesthetics. The result: a 40% increase in daily active usage.',
            role: 'UX Research, UI Design, Prototyping',
            year: '2024',
            team: 'VNYX Digital Team',
            heroGradient: 'linear-gradient(135deg, #0a0a0a 0%, #151515 40%, #0d0d0d 100%)',
            gallery: [
                { icon: '□', class: '' },
                { icon: '◇', class: 'gallery-item-tall' },
                { icon: '△', class: 'gallery-item-wide' },
                { icon: '○', class: '' },
                { icon: '◆', class: '' },
                { icon: '⬡', class: 'gallery-item-wide' },
            ]
        },
        3: {
            title: 'Kinetic Reel',
            category: 'Motion Design',
            description: 'Our annual studio showreel — a cinematic exploration of movement, form, and rhythm. From subtle micro-animations to full 3D sequences, this reel captures the essence of what we do: bringing stillness to life. Featured at Jakarta Design Week 2024.',
            role: 'Motion Design, 3D Animation, Sound Design',
            year: '2024',
            team: 'VNYX Motion Lab',
            heroGradient: 'linear-gradient(135deg, #121212 0%, #0a0a0a 40%, #161616 100%)',
            gallery: [
                { icon: '▷', class: 'gallery-item-wide' },
                { icon: '△', class: 'gallery-item-tall' },
                { icon: '◇', class: '' },
                { icon: '□', class: 'gallery-item-wide' },
                { icon: '○', class: '' },
                { icon: '◆', class: '' },
            ]
        },
        4: {
            title: 'Vertex Studio',
            category: '3D Visualization',
            description: 'Photorealistic 3D product visualization for a cutting-edge tech hardware company. We transformed engineering blueprints into stunning visual narratives — interactive walkthroughs, hero shots, and exploded views that reveal the beauty of precision engineering.',
            role: '3D Modeling, Rendering, Creative Direction',
            year: '2024',
            team: 'VNYX 3D Division',
            heroGradient: 'linear-gradient(135deg, #0d0d0d 0%, #181818 40%, #0a0a0a 100%)',
            gallery: [
                { icon: '⬡', class: 'gallery-item-tall' },
                { icon: '◆', class: 'gallery-item-wide' },
                { icon: '◇', class: '' },
                { icon: '△', class: '' },
                { icon: '□', class: 'gallery-item-wide' },
                { icon: '○', class: '' },
            ]
        },
        5: {
            title: 'Monolith Co.',
            category: 'Branding',
            description: 'Brand identity for an architecture firm specializing in brutalist design. The identity mirrors their philosophy — bold, structural, unapologetic. We created a visual system built on geometric precision, raw materials, and the power of negative space.',
            role: 'Brand Identity, Print Design, Environmental Graphics',
            year: '2023',
            team: 'VNYX Creative Team',
            heroGradient: 'linear-gradient(135deg, #141414 0%, #0b0b0b 40%, #171717 100%)',
            gallery: [
                { icon: '□', class: 'gallery-item-wide' },
                { icon: '△', class: '' },
                { icon: '◆', class: '' },
                { icon: '○', class: 'gallery-item-tall' },
                { icon: '◇', class: 'gallery-item-wide' },
                { icon: '⬡', class: '' },
            ]
        },
        6: {
            title: 'Shadow App',
            category: 'UI/UX Design',
            description: 'A dark-mode-first mobile application for productivity and deep focus. Every pixel was crafted for minimal eye strain and maximum clarity. We designed an entire design system from scratch — components, tokens, and patterns — that scales beautifully across platforms.',
            role: 'Product Design, Design System, Prototyping',
            year: '2024',
            team: 'VNYX Digital Team',
            heroGradient: 'linear-gradient(135deg, #0e0e0e 0%, #161616 40%, #0a0a0a 100%)',
            gallery: [
                { icon: '◇', class: '' },
                { icon: '□', class: 'gallery-item-wide' },
                { icon: '◆', class: 'gallery-item-tall' },
                { icon: '△', class: '' },
                { icon: '○', class: '' },
                { icon: '⬡', class: 'gallery-item-wide' },
            ]
        }
    };


    // ===== Case Study Overlay =====
    function openCaseStudy(projectId) {
        const project = projectData[projectId];
        if (!project) return;

        // Populate hero
        caseStudyHero.style.background = project.heroGradient;
        csCategory.textContent = project.category;
        csTitle.textContent = project.title;

        // Populate description
        csDescription.innerHTML = `
            <h3>About the Project</h3>
            <p>${project.description}</p>
        `;

        // Populate credits
        csCredits.innerHTML = `
            <div class="credit-item">
                <div class="credit-label">Role</div>
                <div class="credit-value">${project.role}</div>
            </div>
            <div class="credit-item">
                <div class="credit-label">Year</div>
                <div class="credit-value">${project.year}</div>
            </div>
            <div class="credit-item">
                <div class="credit-label">Team</div>
                <div class="credit-value">${project.team}</div>
            </div>
        `;

        // Populate gallery
        let galleryHTML = '<h3 class="gallery-title">Project Gallery</h3><div class="gallery-grid">';
        project.gallery.forEach(item => {
            galleryHTML += `
                <div class="gallery-item ${item.class}">
                    <div class="gallery-placeholder">
                        <span>${item.icon}</span>
                    </div>
                </div>
            `;
        });
        galleryHTML += '</div>';
        csGallery.innerHTML = galleryHTML;

        // Scroll to top of case study
        caseStudyScroll.scrollTop = 0;

        // Open overlay
        caseStudyOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCaseStudy() {
        caseStudyOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Click handlers
    document.querySelectorAll('.portfolio-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = btn.getAttribute('data-project');
            openCaseStudy(projectId);
        });
    });

    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const btn = item.querySelector('.portfolio-view');
            if (btn) {
                const projectId = btn.getAttribute('data-project');
                openCaseStudy(projectId);
            }
        });
    });

    caseStudyClose?.addEventListener('click', closeCaseStudy);


    // ===== Keyboard Navigation =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (caseStudyOverlay && caseStudyOverlay.classList.contains('active')) {
                closeCaseStudy();
            } else if (fullscreenMenu && fullscreenMenu.classList.contains('active')) {
                fullscreenMenu.classList.remove('active');
                menuTrigger.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });


    // ===== i18n Translation System =====
    const translations = {
        en: {
            'work.tag': 'Portfolio',
            'work.hero.title': 'Selected<br><em>Work</em>',
            'work.hero.subtitle': 'A curated showcase of projects where vision meets execution. Each piece represents a unique challenge solved through design.',
            'footer.tagline': 'Crafting visual excellence since 2024.',
            'footer.copy': '© 2024 VNYX Studio. All rights reserved.',
        },
        id: {
            'work.tag': 'Portofolio',
            'work.hero.title': 'Karya<br><em>Pilihan</em>',
            'work.hero.subtitle': 'Kurasi proyek di mana visi bertemu eksekusi. Setiap karya merepresentasikan tantangan unik yang diselesaikan melalui desain.',
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


    console.log('◆ VNYX Studio — Work page loaded');
});
