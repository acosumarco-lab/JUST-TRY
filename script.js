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
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const cursorFollower = document.getElementById('cursorFollower');
const portfolioGrid = document.getElementById('portfolioGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const testimonialTrack = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const contactForm = document.getElementById('contactForm');
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
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

// Mobile Nav
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
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


// ===== Project Modal =====
const projectData = {
    1: {
        title: 'Obsidian Luxury',
        description: 'A complete rebrand for a premium lifestyle company, transforming their visual identity into a sleek, monochromatic presence that speaks sophistication without a single word.',
        category: 'Branding',
        client: 'Obsidian Luxury',
        year: '2024'
    },
    2: {
        title: 'Noir Finance',
        description: 'A dark-mode-first fintech dashboard that makes complex financial data feel elegant and approachable. Clean data visualization meets premium aesthetics.',
        category: 'UI/UX Design',
        client: 'Noir Finance',
        year: '2024'
    },
    3: {
        title: 'Kinetic Reel',
        description: 'Our studio showreel showcasing motion design capabilities — from subtle micro-animations to full cinematic sequences.',
        category: 'Motion Design',
        client: 'VNYX Internal',
        year: '2024'
    },
    4: {
        title: 'Vertex Studio',
        description: '3D product visualization for a tech hardware company, turning engineering blueprints into photorealistic renders and interactive walkthroughs.',
        category: '3D Visualization',
        client: 'Vertex Studio',
        year: '2024'
    },
    5: {
        title: 'Monolith Co.',
        description: 'Brand identity for an architecture firm specializing in brutalist design. The identity mirrors their philosophy — bold, structural, unapologetic.',
        category: 'Branding',
        client: 'Monolith Co.',
        year: '2023'
    },
    6: {
        title: 'Shadow App',
        description: 'A dark-mode-first mobile application for productivity. Every pixel crafted for minimal eye strain and maximum focus.',
        category: 'UI/UX Design',
        client: 'Shadow Inc.',
        year: '2024'
    }
};

document.querySelectorAll('.portfolio-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = btn.getAttribute('data-project');
        if (projectId && projectData[projectId]) {
            const project = projectData[projectId];
            modalBody.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="modal-details-grid">
                    <div>
                        <div class="modal-detail-label">Category</div>
                        <div class="modal-detail-value">${project.category}</div>
                    </div>
                    <div>
                        <div class="modal-detail-label">Client</div>
                        <div class="modal-detail-value">${project.client}</div>
                    </div>
                    <div>
                        <div class="modal-detail-label">Year</div>
                        <div class="modal-detail-value">${project.year}</div>
                    </div>
                </div>
            `;
            projectModal.classList.add('active');
        }
    });
});

modalClose?.addEventListener('click', () => {
    projectModal.classList.remove('active');
});

projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal || e.target.classList.contains('modal-backdrop')) {
        projectModal.classList.remove('active');
    }
});


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
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        projectModal.classList.remove('active');
    }
});


console.log('◆ VNYX Studio — Monochrome Kinetic Luxury loaded');
