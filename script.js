/* ============================================
   GROK Presentation Site — Ultra Animations
   Three.js cosmic background + GSAP ScrollTrigger
   ============================================ */

// ---------- NAVBAR ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---------- THREE.JS COSMIC BACKGROUND ----------
(function initThreeBG() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Stars
  const starCount = 1800;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 120;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;

    const colorChoice = Math.random();
    if (colorChoice < 0.6) {
      colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 1;
    } else if (colorChoice < 0.85) {
      colors[i3] = 0.7; colors[i3 + 1] = 0.5; colors[i3 + 2] = 1;
    } else {
      colors[i3] = 0.3; colors[i3 + 1] = 0.9; colors[i3 + 2] = 1;
    }
    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  // Nebula-like floating spheres
  const nebulaGroup = new THREE.Group();
  const sphereGeo = new THREE.SphereGeometry(1, 16, 16);

  function createNebula(color, x, y, z, scale) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(scale);
    nebulaGroup.add(mesh);
    return mesh;
  }

  createNebula(0x8b5cf6, -15, 8, -20, 12);
  createNebula(0x22d3ee, 18, -6, -25, 10);
  createNebula(0xec4899, 5, 12, -15, 8);
  createNebula(0x6366f1, -8, -10, -18, 9);

  scene.add(nebulaGroup);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    stars.rotation.y = t * 0.02;
    stars.rotation.x = Math.sin(t * 0.01) * 0.05;

    nebulaGroup.children.forEach((mesh, i) => {
      mesh.position.y += Math.sin(t * 0.3 + i) * 0.003;
      mesh.rotation.y = t * 0.05 * (i % 2 === 0 ? 1 : -1);
    });

    targetX += (mouseX * 3 - targetX) * 0.03;
    targetY += (mouseY * 2 - targetY) * 0.03;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();

// ---------- GSAP ANIMATIONS ----------
function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not ready, retrying...');
    setTimeout(initAnimations, 100);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-badge', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' });
  gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1, ease: 'power3.out', delay: 0.15 });
  gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.3 });
  gsap.from('.hero-desc', { opacity: 0, y: 25, duration: 0.8, ease: 'power3.out', delay: 0.45 });
  gsap.from('.hero-cta', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.6 });

  function revealOnScroll(selector, options = {}) {
    gsap.utils.toArray(selector).forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: options.duration || 0.9,
        ease: 'power3.out',
        delay: options.stagger ? i * (options.stagger || 0.1) : 0,
        scrollTrigger: {
          trigger: el,
          start: options.start || 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  revealOnScroll('.section-label');
  revealOnScroll('.section-title');
  revealOnScroll('.about-content p, .about-content .flex');
  revealOnScroll('.about-visual', { duration: 1.1 });
  revealOnScroll('.creator-card', { stagger: 0.12 });
  revealOnScroll('.how-card', { stagger: 0.1 });
  revealOnScroll('#arch-visual');
  revealOnScroll('.feature-card', { stagger: 0.08 });
  revealOnScroll('.timeline-item', { stagger: 0.15 });
  revealOnScroll('.cta-title, .cta-desc, .cta-btn', { stagger: 0.12 });

  gsap.to('.animate-float', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.pipeline-step', {
    boxShadow: '0 0 25px rgba(139, 92, 246, 0.25)',
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    stagger: 0.2,
    ease: 'sine.inOut',
    scrollTrigger: {
      trigger: '#arch-visual',
      start: 'top 80%'
    }
  });

  setTimeout(() => ScrollTrigger.refresh(), 300);
}

function boot() {
  setTimeout(initAnimations, 80);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

setTimeout(() => {
  const hero = document.querySelector('.hero-title');
  if (hero && getComputedStyle(hero).opacity < 0.1) {
    console.log('Fallback animation triggered');
    gsap.set(['.hero-badge', '.hero-title', '.hero-subtitle', '.hero-desc', '.hero-cta'], { opacity: 1, y: 0 });
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.section-label, .section-title, .about-content p, .about-content .flex, .about-visual, .creator-card, .how-card, #arch-visual, .feature-card, .timeline-item, .cta-title, .cta-desc, .cta-btn').forEach(el => {
        gsap.set(el, { opacity: 1, y: 0, x: 0 });
      });
      ScrollTrigger.refresh();
    }
  }
}, 1200);

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('text-white');
    link.classList.add('text-white/70');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.remove('text-white/70');
      link.classList.add('text-white');
    }
  });
});

console.log('%cGrok Site loaded — Understand the Universe 🚀', 'color: #a78bfa; font-size: 14px; font-weight: bold;');
