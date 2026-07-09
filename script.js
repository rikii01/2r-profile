/* ============================================================
   2R SERVICE – script.js
   Pure vanilla JS: navbar, mobile menu, scroll reveal, counter
   ============================================================ */

'use strict';

// ─── NAVBAR SCROLL ───────────────────────────────────────────
const navbar = document.getElementById('navbar');

function onScroll() {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNav();
}

window.addEventListener('scroll', onScroll, { passive: true });

// ─── MOBILE MENU ─────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── SCROLL REVEAL (simple IntersectionObserver) ─────────────
const revealEls = document.querySelectorAll('[data-aos]');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ─── COUNTER ANIMATION ────────────────────────────────────────
function animateCounter(el, target, duration) {
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = '+' + Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = '+' + target;
  }
  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-counter') || '0', 10);
      animateCounter(el, target, 1800);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counterEls.forEach(el => counterObserver.observe(el));

// ─── ACTIVE NAV LINK ─────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}

// ─── SMOOTH HOVER TILT on feature cards ──────────────────────
document.querySelectorAll('.fcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-9px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── STEP HOVER (sequential highlight) ───────────────────────
const steps = document.querySelectorAll('.step');
steps.forEach((step, i) => {
  step.style.transitionDelay = `${i * 60}ms`;
});

// ─── INIT on DOMContentLoaded ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  onScroll(); // set initial navbar state if page refreshed scrolled down
});
