/* ===========================
   Navigation
=========================== */
const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');
const allLinks   = navLinks.querySelectorAll('a');

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
allLinks.forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id], footer[id]');

function updateActiveLink() {
  const scrollY = window.scrollY + 80;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < bottom) {
        allLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ===========================
   Scroll-reveal animations
=========================== */
const revealEls = document.querySelectorAll(
  '.about-grid, .skill-card, .project-card, .contact-form'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => observer.observe(el));

/* ===========================
   Contact form
=========================== */
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', e => {
  e.preventDefault();

  // Basic validation
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('invalid');
    if (!field.value.trim()) {
      field.classList.add('invalid');
      valid = false;
    }
  });

  const emailField = document.getElementById('email');
  if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    emailField.classList.add('invalid');
    valid = false;
  }

  if (!valid) {
    formStatus.textContent = 'Please fill in all required fields correctly.';
    formStatus.className   = 'form-status error';
    return;
  }

  // Simulate sending
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled     = true;
  btn.textContent  = 'Sending…';
  formStatus.textContent = '';
  formStatus.className   = 'form-status';

  setTimeout(() => {
    form.reset();
    formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
    formStatus.className   = 'form-status success';
    btn.disabled    = false;
    btn.textContent = 'Send Message';
  }, 1200);
});

/* ===========================
   Footer year
=========================== */
document.getElementById('year').textContent = new Date().getFullYear();
