// ===== NAV SCROLL =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? 'rgba(10,10,15,0.98)'
    : 'rgba(10,10,15,0.85)';
});

// ===== HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ===== FADE IN ON SCROLL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? 'block' : 'none';
    });
  });
});

// ===== MODAL =====
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.querySelector('.modal-close');

function openModal(id) {
  const data = projects[id];
  if (!data) return;
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-tag').textContent = data.category;
  const liveBtn = document.getElementById('modal-live');
  if (data.url) { liveBtn.href = data.url; liveBtn.style.display = 'inline-flex'; }
  else { liveBtn.style.display = 'none'; }
  document.getElementById('modal-problem').textContent = data.problem;
  document.getElementById('modal-solution').textContent = data.solution;
  document.getElementById('modal-results').textContent = data.results;
  const featuresList = document.getElementById('modal-features');
  featuresList.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
  const stackEl = document.getElementById('modal-stack');
  stackEl.innerHTML = data.stack.map(s => `<span class="stack-tag">${s}</span>`).join('');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== PROJECT DATA =====
const projects = {
  barbershop: {
    title: 'Minore Barbershop Appointment System',
    category: 'Web Application',
    url: 'https://www.minorebarber.com/',
    problem: 'A multi-location barbershop chain needed to eliminate phone-based bookings, reduce no-shows, and give staff a real-time view of the daily schedule across two physical locations.',
    solution: 'We built a full-stack appointment platform with QR code access for customers, real-time admin dashboards powered by Server-Sent Events, VIP early access logic, automated email confirmations with cancellation links, and a CI/CD pipeline that blocks bad deployments automatically.',
    results: 'The system handles 10,000+ appointments per day across 2 locations with zero double-bookings, 99.9% uptime, and a 10x to 200x improvement in query performance after database optimization.',
    features: [
      'QR code customer booking, no app download required',
      'Real-time admin dashboard with live updates via SSE',
      'VIP early access system with time-based rules',
      'One-click checkout with live revenue tracking per barber',
      'Automated email confirmations with secure cancellation links',
      'Multi-location support for Mallorca and Concell',
      'CI/CD pipeline with automated testing and Sentry monitoring',
      'Race condition prevention via database-level constraints',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'SSE', 'GitHub Actions', 'Render', 'Sentry'],
  },
  hotel: {
    title: 'TableLink Hotel & Restaurant Platform',
    category: 'Business Tool',
    url: '',
    problem: 'Hotels and restaurants needed a way to let guests order room service or table service directly from their phone without downloading an app, while giving staff a live dashboard to manage orders.',
    solution: 'We built a multi-tenant QR-based ordering platform. Each table or room gets a unique QR code. Guests scan, browse the menu, and place orders. Staff see a live dashboard with table status, order details, and can manage the menu via Excel upload.',
    results: 'Deployed across multiple venues, the platform reduced order errors, eliminated paper menus, and cut average order processing time significantly. The multi-tenant architecture allows onboarding new businesses in minutes.',
    features: [
      'QR code per table or room for instant menu access',
      'Live business dashboard with table status grid',
      'Menu management via Excel or PDF upload',
      'Real-time order notifications for staff',
      'Multi-tenant architecture supporting multiple businesses on one platform',
      'Hotel room service module with room-specific menus',
      'Booking alert system for staff',
      'Analytics dashboard for business insights',
    ],
    stack: ['Python', 'FastAPI', 'SQLite', 'SQLAlchemy', 'JavaScript', 'Bootstrap', 'Railway', 'Heroku'],
  },
  redmarbs: {
    title: 'RedMarbs Model Agency Platform',
    category: 'Web Application',
    url: 'https://www.redmarbs.com/',
    problem: 'A luxury modeling agency needed a professional digital presence where clients could browse model portfolios, submit booking requests, and where the admin team could manage model profiles, approve applications, and track all incoming bookings.',
    solution: 'We designed and built a full-stack agency platform with a luxury aesthetic, white theme with elegant accents. The public side features advanced model filtering, photo galleries, and a booking form. The admin panel provides complete control over model profiles, bookings, and city management.',
    results: 'The agency now operates entirely through the platform. Model applications, client bookings, and profile management are all centralized, reducing admin overhead and presenting a professional image to international clients.',
    features: [
      'Elegant model directory with advanced filtering by city, age, height and hair color',
      'Professional model profiles with photo carousel galleries',
      'Client booking system with contact forms',
      'Model application portal',
      'Full admin dashboard to manage models, bookings and cities',
      'Multi-photo upload system per model',
      'Secure session-based admin authentication',
      'Mobile-responsive luxury design',
    ],
    stack: ['Python', 'FastAPI', 'SQLite', 'SQLAlchemy', 'Bootstrap 5', 'JavaScript', 'Heroku'],
  },
};

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    const json = await res.json();
    if (res.ok) {
      form.innerHTML = `
        <div class="form-success" style="display:block">
          <div style="font-size:2.5rem;margin-bottom:1rem">✅</div>
          <h3 style="color:var(--white);margin-bottom:0.5rem">Message received!</h3>
          <p style="color:var(--muted)">We'll get back to you within 24 hours to discuss your project.</p>
        </div>`;
    } else {
      console.error('Formspree error:', json);
      btn.textContent = json.error || 'Something went wrong. Try again.';
      btn.disabled = false;
    }
  } catch (err) {
    console.error('Network error:', err);
    btn.textContent = 'Network error. Try again.';
    btn.disabled = false;
  }
});

// ===== SMOOTH SCROLL FOR CTA =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + suffix;
  }, 25);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const val = parseInt(el.dataset.val);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, val, suffix);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);
