/* ========================================
   VNYX Studio — Monochrome Kinetic Luxury
   Three.js 3D Background + Interactions
   ======================================== */

// ===== Three.js 3D Background =====
const canvas = document.getElementById('bgCanvas');
let scene, camera, renderer;
let geometricObjects = [];
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let hoverIntensity = 0;
let targetHoverIntensity = 0;
let clock;

function initThreeJS() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.015);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 1);

    clock = new THREE.Clock();

    // Lighting — subtle, moody
    const ambientLight = new THREE.AmbientLight(0x222222, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x333333, 0.8);
    dirLight1.position.set(10, 10, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x1a1a1a, 0.4);
    dirLight2.position.set(-10, -5, -5);
    scene.add(dirLight2);

    // Create geometric objects
    createGeometricObjects();

    // Start animation loop
    animate();
}

function createGeometricObjects() {
    const geometries = [
        () => new THREE.BoxGeometry(1, 1, 1),
        () => new THREE.BoxGeometry(1.5, 0.5, 0.5),          // Balok
        () => new THREE.TetrahedronGeometry(0.8),              // Prisma segitiga
        () => new THREE.OctahedronGeometry(0.7),               // Oktahedron
        () => new THREE.IcosahedronGeometry(0.6),              // Icosahedron
        () => new THREE.BoxGeometry(0.4, 2, 0.4),             // Tall pillar
        () => new THREE.DodecahedronGeometry(0.6),             // Dodecahedron
        () => new THREE.ConeGeometry(0.5, 1.2, 4),            // Pyramid
    ];

    const count = 22;

    for (let i = 0; i < count; i++) {
        const geoFn = geometries[Math.floor(Math.random() * geometries.length)];
        const geometry = geoFn();

        // Mix of wireframe and solid objects
        const isWireframe = Math.random() > 0.45;
        const shade = 0.08 + Math.random() * 0.12; // 0.08 to 0.20 brightness

        let material;
        if (isWireframe) {
            material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(shade, shade, shade),
                wireframe: true,
                transparent: true,
                opacity: 0.25 + Math.random() * 0.3
            });
        } else {
            material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(shade, shade, shade),
                roughness: 0.8,
                metalness: 0.2,
                transparent: true,
                opacity: 0.3 + Math.random() * 0.35
            });
        }

        const mesh = new THREE.Mesh(geometry, material);

        // Random position spread across viewport
        mesh.position.x = (Math.random() - 0.5) * 50;
        mesh.position.y = (Math.random() - 0.5) * 35;
        mesh.position.z = (Math.random() - 0.5) * 30 - 5;

        // Random initial rotation
        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
        mesh.rotation.z = Math.random() * Math.PI * 2;

        // Random scale
        const scale = 0.5 + Math.random() * 2;
        mesh.scale.set(scale, scale, scale);

        // Store motion parameters
        mesh.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.003,
            rotSpeedY: (Math.random() - 0.5) * 0.003,
            rotSpeedZ: (Math.random() - 0.5) * 0.002,
            floatSpeed: 0.3 + Math.random() * 0.5,
            floatAmplitude: 0.3 + Math.random() * 0.7,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: mesh.position.y,
            parallaxFactor: 0.5 + Math.random() * 1.5,
        };

        scene.add(mesh);
        geometricObjects.push(mesh);
    }
}

function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Smooth mouse following
    targetMouseX += (mouseX - targetMouseX) * 0.05;
    targetMouseY += (mouseY - targetMouseY) * 0.05;

    // Smooth hover intensity
    hoverIntensity += (targetHoverIntensity - hoverIntensity) * 0.08;

    // Animate each object
    geometricObjects.forEach((obj) => {
        const ud = obj.userData;

        // Base rotation (slow, elegant)
        const speedMultiplier = 1 + hoverIntensity * 3;
        obj.rotation.x += ud.rotSpeedX * speedMultiplier;
        obj.rotation.y += ud.rotSpeedY * speedMultiplier;
        obj.rotation.z += ud.rotSpeedZ * speedMultiplier;

        // Floating sinusoidal motion (hypnotic)
        obj.position.y = ud.originalY + Math.sin(elapsed * ud.floatSpeed + ud.floatOffset) * ud.floatAmplitude;

        // Mouse parallax — subtle shift opposite to cursor
        const parallaxX = targetMouseX * ud.parallaxFactor * 0.5;
        const parallaxY = targetMouseY * ud.parallaxFactor * 0.5;
        obj.position.x += (parallaxX - obj.position.x) * 0.01;
    });

    // Subtle camera sway
    camera.position.x += (targetMouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-targetMouseY * 1.5 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Mouse tracking for parallax
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize Three.js
initThreeJS();


// ===== DOM Elements =====
const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const menuTrigger = document.getElementById('menuTrigger');
const fullscreenMenu = document.getElementById('fullscreenMenu');
const cursorFollower = document.getElementById('cursorFollower');
const portfolioGrid = document.getElementById('portfolioGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const testimonialTrack = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const contactForm = document.getElementById('contactForm');
const backToTop = document.getElementById('backToTop');


// ===== Loader =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }, 2200);
});


// ===== Custom Cursor =====
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

// Hover effect for interactive elements
function setupCursorHover() {
    document.querySelectorAll('a, button, .portfolio-item, .service-card, .social-link, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
    });
}
setupCursorHover();


// ===== Navbar =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Fullscreen Menu Toggle
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

// Close menu on anchor link click (except external links like initiatives.html)
document.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            fullscreenMenu.classList.remove('active');
            menuTrigger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});


// ===== Stats Counter =====
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            animateStats();
            statsAnimated = true;
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);


// ===== Portfolio Filter =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const items = document.querySelectorAll('.portfolio-item');

        items.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 60);
            } else {
                item.style.display = 'none';
            }
        });
    });
});


// ===== Portfolio Hover → 3D Background Reaction =====
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        targetHoverIntensity = 1;
    });
    item.addEventListener('mouseleave', () => {
        targetHoverIntensity = 0;
    });
});


// ===== Testimonial Slider =====
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const totalTestimonials = testimonialCards.length;

function updateTestimonialSlider() {
    if (!testimonialCards.length) return;
    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = 32;
    testimonialTrack.style.transform = `translateX(-${currentTestimonial * (cardWidth + gap)}px)`;
}

prevBtn?.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    updateTestimonialSlider();
});

nextBtn?.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    updateTestimonialSlider();
});

// Auto slide
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    updateTestimonialSlider();
}, 6000);


// ===== Case Study Overlay =====
const caseStudyOverlay = document.getElementById('caseStudyOverlay');
const caseStudyClose = document.getElementById('caseStudyClose');
const caseStudyScroll = document.getElementById('caseStudyScroll');
const csCategory = document.getElementById('csCategory');
const csTitle = document.getElementById('csTitle');
const csDescription = document.getElementById('csDescription');
const csCredits = document.getElementById('csCredits');
const csGallery = document.getElementById('csGallery');
const caseStudyHero = document.getElementById('caseStudyHero');

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

// Click handlers — both the arrow button AND the entire portfolio item open the case study
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


// ===== Contact Form =====
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
        submitBtn.innerHTML = '<span>Sent Successfully</span>';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 2000);
    }, 1500);
});


// ===== Back to Top =====
backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ===== Scroll Reveal (IntersectionObserver) =====
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


// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// ===== Hero Parallax on Scroll =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
});


// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseStudyOverlay.classList.contains('active')) {
        closeCaseStudy();
    }
});


// ===== Selected Works — Hover-Reveal Preview =====
document.querySelectorAll('.sw-item').forEach(item => {
    const preview = item.querySelector('.sw-preview');
    if (!preview) return;

    item.addEventListener('mousemove', (e) => {
        preview.style.left = (e.clientX + 20) + 'px';
        preview.style.top = (e.clientY - 110) + 'px';
    });
});


// ===== Selected Works — Parallax Scroll =====
(function () {
    const swItems = document.querySelectorAll('.sw-item[data-reveal]');
    if (swItems.length === 0) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        swItems.forEach((item, i) => {
            const rect = item.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const viewH = window.innerHeight;
            // Only apply parallax when item is in/near viewport
            if (center > -200 && center < viewH + 200) {
                const offset = (center - viewH / 2) * (0.03 + i * 0.01);
                item.style.transform = `translateY(${offset}px)`;
            }
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
})();


// ===== i18n Translation System =====
const translations = {
    en: {
        // Hero
        'hero.tag': 'Visual Agency — Est. 2024',
        'hero.line1': 'We Design',
        'hero.line2': 'Experiences',
        'hero.line3': 'That <em>Move</em>',
        'hero.subtitle': 'Bold visual storytelling for brands that refuse to blend in. We craft cinematic digital identities that command attention.',
        'hero.cta1': 'View Our Work',
        'hero.cta2': 'Get In Touch',
        'hero.stat1': 'Projects',
        'hero.stat2': 'Clients',
        'hero.stat3': 'Awards',
        'hero.scroll': 'Scroll',

        // Selected Works
        'sw.tag': 'Featured Projects',
        'sw.title': 'Selected Works',
        'sw.cta': 'VIEW ALL WORKS',

        // Services
        'svc.tag': 'What We Do',
        'svc.title': 'Our Expertise',
        'svc.subtitle': 'We don\'t just design — we architect visual experiences that define brands.',
        'svc.s1.title': 'Brand Identity',
        'svc.s1.desc': 'Complete visual identity systems — logos, typography, color, and guidelines that make your brand unmistakable.',
        'svc.s2.title': 'UI/UX Design',
        'svc.s2.desc': 'Interfaces that feel intuitive and look extraordinary. Web apps, mobile, and digital products.',
        'svc.s3.title': 'Motion & 3D',
        'svc.s3.desc': 'Cinematic motion graphics, 3D visualization, and animated content that breathes life into your story.',
        'svc.s4.title': 'Creative Direction',
        'svc.s4.desc': 'Strategic visual consulting for campaigns, launches, and brand transformations that demand impact.',

        // Testimonials
        'testi.tag': 'Client Voices',
        'testi.title': 'What They Say',
        'testi.t1': 'VNYX transformed our brand into something we didn\'t think was possible. The attention to detail is otherworldly.',
        'testi.t2': 'Working with VNYX felt like collaborating with artists who happen to understand business. The result speaks for itself.',
        'testi.t3': 'They don\'t just design — they create experiences. Our conversion rate jumped 340% after the redesign.',

        // Contact
        'contact.tag': 'Let\'s Talk',
        'contact.title': 'Start a Project',
        'contact.desc': 'Have a vision? We\'ll bring it to life. Drop us a line and let\'s create something extraordinary together.',
        'contact.name': 'Your Name',
        'contact.email': 'Your Email',
        'contact.message': 'Your Message',
        'contact.send': 'Send Message',

        // Footer
        'footer.tagline': 'Crafting visual excellence since 2024.',
        'footer.copy': '© 2024 VNYX Studio. All rights reserved.',
    },
    id: {
        // Hero
        'hero.tag': 'Agensi Visual — Est. 2024',
        'hero.line1': 'Kami Mendesain',
        'hero.line2': 'Pengalaman',
        'hero.line3': 'Yang <em>Menggerakkan</em>',
        'hero.subtitle': 'Visual storytelling yang berani untuk brand yang menolak tampil biasa. Kami menciptakan identitas digital sinematik yang menarik perhatian.',
        'hero.cta1': 'Lihat Karya Kami',
        'hero.cta2': 'Hubungi Kami',
        'hero.stat1': 'Proyek',
        'hero.stat2': 'Klien',
        'hero.stat3': 'Penghargaan',
        'hero.scroll': 'Gulir',

        // Selected Works
        'sw.tag': 'Proyek Unggulan',
        'sw.title': 'Karya Pilihan',
        'sw.cta': 'LIHAT SEMUA KARYA',

        // Services
        'svc.tag': 'Apa yang Kami Lakukan',
        'svc.title': 'Keahlian Kami',
        'svc.subtitle': 'Kami tidak sekadar mendesain — kami merancang pengalaman visual yang mendefinisikan brand.',
        'svc.s1.title': 'Identitas Brand',
        'svc.s1.desc': 'Sistem identitas visual lengkap — logo, tipografi, warna, dan panduan yang membuat brand Anda tak terlupakan.',
        'svc.s2.title': 'Desain UI/UX',
        'svc.s2.desc': 'Antarmuka yang terasa intuitif dan tampil luar biasa. Aplikasi web, mobile, dan produk digital.',
        'svc.s3.title': 'Motion & 3D',
        'svc.s3.desc': 'Motion graphics sinematik, visualisasi 3D, dan konten animasi yang menghidupkan cerita Anda.',
        'svc.s4.title': 'Arahan Kreatif',
        'svc.s4.desc': 'Konsultasi visual strategis untuk kampanye, peluncuran, dan transformasi brand yang menuntut dampak.',

        // Testimonials
        'testi.tag': 'Suara Klien',
        'testi.title': 'Kata Mereka',
        'testi.t1': 'VNYX mengubah brand kami menjadi sesuatu yang tidak kami kira mungkin. Perhatian terhadap detail sungguh luar biasa.',
        'testi.t2': 'Bekerja dengan VNYX terasa seperti berkolaborasi dengan seniman yang memahami bisnis. Hasilnya berbicara sendiri.',
        'testi.t3': 'Mereka tidak sekadar mendesain — mereka menciptakan pengalaman. Tingkat konversi kami melonjak 340% setelah redesain.',

        // Contact
        'contact.tag': 'Mari Bicara',
        'contact.title': 'Mulai Proyek',
        'contact.desc': 'Punya visi? Kami akan mewujudkannya. Kirim pesan dan mari ciptakan sesuatu yang luar biasa bersama.',
        'contact.name': 'Nama Anda',
        'contact.email': 'Email Anda',
        'contact.message': 'Pesan Anda',
        'contact.send': 'Kirim Pesan',

        // Footer
        'footer.tagline': 'Menciptakan keunggulan visual sejak 2024.',
        'footer.copy': '© 2024 VNYX Studio. Hak cipta dilindungi.',
    }
};

function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // Text content swaps
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            el.textContent = dict[key];
        }
    });

    // HTML content swaps (for elements with <em>, <strong>, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) {
            el.innerHTML = dict[key];
        }
    });

    document.documentElement.setAttribute('lang', lang);
}

// Language Switcher — click handlers
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        localStorage.setItem('vnyx-lang', lang);
        applyLanguage(lang);
    });
});

// Restore saved language preference on load
(function () {
    const savedLang = localStorage.getItem('vnyx-lang');
    if (savedLang && savedLang !== 'en') {
        document.querySelectorAll('.lang-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-lang') === savedLang);
        });
        applyLanguage(savedLang);
    }
})();


console.log('◆ VNYX Studio — Monochrome Kinetic Luxury loaded');

