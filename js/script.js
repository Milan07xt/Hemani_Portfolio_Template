/* ============================================================
   HEMANI VANAVI — Portfolio interactivity
   Cursor glow · scroll reveals · 3D tilt card · Three.js hero
   backdrop · skill bar animation · contact form.
   ============================================================ */

/* ---------- Mobile menu ---------- */
const mobileToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

mobileToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

const themeButtons = document.querySelectorAll('.theme-button');

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem('portfolioTheme', theme);
  themeButtons.forEach((button) => button.classList.toggle('active', button.dataset.theme === theme));
}

const savedTheme = localStorage.getItem('portfolioTheme') || 'afterglow';
if (themeButtons.length) setTheme(savedTheme);

themeButtons.forEach((button) => {
  button.addEventListener('click', () => setTheme(button.dataset.theme));
});

const tiltCards = document.querySelectorAll('.glass-card:not(#hero-card)');
if (window.matchMedia('(hover: hover)').matches) {
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Active nav link on scroll ---------- */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  },
  { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 }
);
sections.forEach((section) => sectionObserver.observe(section));

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document
  .querySelectorAll(
    '.reveal, .glass-card, .hero-copy, .skill-card, .mini-card, .service-card, .timeline-item'
  )
  .forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

/* ---------- Skill bars fill when visible ---------- */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('span');
        const target = entry.target.dataset.value || '0';
        requestAnimationFrame(() => {
          bar.style.width = `${target}%`;
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
document.querySelectorAll('.skill-bar').forEach((bar) => skillObserver.observe(bar));

/* ---------- Cursor glow ---------- */
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', (event) => {
    cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });
}

/* ---------- Hero card 3D tilt ---------- */
const heroCard = document.getElementById('hero-card');
if (heroCard && window.matchMedia('(hover: hover)').matches) {
  heroCard.addEventListener('mousemove', (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    heroCard.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 7}deg) translateZ(10px)`;
  });
  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
  });
}

/* ---------- Three.js 3D hero backdrop ---------- */
(function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const group = new THREE.Group();
  scene.add(group);

  const colors = [0x9d5cff, 0xff4fa3, 0xffb020];
  const shapes = [];

  for (let i = 0; i < 3; i++) {
    const geometry =
      i === 0
        ? new THREE.IcosahedronGeometry(1.7, 0)
        : i === 1
        ? new THREE.TorusGeometry(1.1, 0.28, 12, 48)
        : new THREE.OctahedronGeometry(0.9, 0);

    const material = new THREE.MeshBasicMaterial({
      color: colors[i],
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      [-2.4, 2.6, -2.2][i],
      [1.6, -0.8, -1.8][i],
      [0, -1, 1.4][i]
    );
    shapes.push(mesh);
    group.add(mesh);
  }

  // Soft particle field
  const particleCount = 90;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xf6f3ff,
    size: 0.035,
    transparent: true,
    opacity: 0.5,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  function resize() {
    const parent = canvas.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    shapes.forEach((mesh, i) => {
      const speed = reduceMotion ? 0.05 : 0.15 + i * 0.05;
      mesh.rotation.x = elapsed * speed;
      mesh.rotation.y = elapsed * (speed * 0.8);
    });

    particles.rotation.y = elapsed * 0.02;

    group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.03;
    group.rotation.x += (-mouseY * 0.2 - group.rotation.x) * 0.03;

    renderer.render(scene, camera);
  }
  animate();
})();

/* ---------- Contact form ---------- */
const form = document.getElementById('contact-form');
const messageEl = document.getElementById('form-message');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get('name')?.toString().trim();
  const email = data.get('email')?.toString().trim();
  const message = data.get('message')?.toString().trim();

  if (!name || !email || !message) {
    messageEl.textContent = 'Please fill in name, email and message.';
    messageEl.classList.add('error');
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    messageEl.textContent = 'Please enter a valid email address.';
    messageEl.classList.add('error');
    return;
  }

  messageEl.classList.remove('error');
  messageEl.textContent = 'Sending message...';

  setTimeout(() => {
    messageEl.textContent = "Thanks! I'll get back to you within 24 hours.";
    form.reset();
  }, 900);
});

/* ---------- Footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();