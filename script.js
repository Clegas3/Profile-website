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
    e.preventDefault();
    formStatus.textContent = 'Please fill in all required fields correctly.';
    formStatus.className   = 'form-status error';
    return;
  }

  // Show sending message
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled     = true;
  btn.textContent  = 'Sending…';
  formStatus.textContent = '';
  formStatus.className   = 'form-status';
});

form.addEventListener('reset', () => {
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled    = false;
  btn.textContent = 'Send Message';
});

/* ===========================
   Footer year
=========================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===========================
   Admin Panel
=========================== */
const adminToggle = document.getElementById('adminToggle');
const adminMenu = document.getElementById('adminMenu');
const closeAdmin = document.getElementById('closeAdmin');
const editAvatarBtn = document.getElementById('editAvatarBtn');
const editAvatarModal = document.getElementById('editAvatarModal');
const closeAvatarModal = document.getElementById('closeAvatarModal');
const cancelAvatarBtn = document.getElementById('cancelAvatarBtn');
const avatarInput = document.getElementById('avatarInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const saveAvatarBtn = document.getElementById('saveAvatarBtn');
const avatarImage = document.querySelector('.avatar-image');

// Toggle admin menu
adminToggle.addEventListener('click', () => {
  adminMenu.classList.toggle('hidden');
});

// Close admin menu
closeAdmin.addEventListener('click', () => {
  adminMenu.classList.add('hidden');
});

// Open edit avatar modal
editAvatarBtn.addEventListener('click', () => {
  editAvatarModal.classList.remove('hidden');
  adminMenu.classList.add('hidden');
});

// Close edit avatar modal
closeAvatarModal.addEventListener('click', () => {
  editAvatarModal.classList.add('hidden');
});

cancelAvatarBtn.addEventListener('click', () => {
  editAvatarModal.classList.add('hidden');
});

// Preview image on file select
avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImg.src = event.target.result;
      imagePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
});

// Save avatar
saveAvatarBtn.addEventListener('click', () => {
  const file = avatarInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      // Store the image as a data URL in localStorage
      localStorage.setItem('avatarImage', event.target.result);
      // Update the avatar on the page
      avatarImage.src = event.target.result;
      // Reset form
      avatarInput.value = '';
      imagePreview.classList.add('hidden');
      editAvatarModal.classList.add('hidden');
      // Show success message
      alert('Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please select an image first');
  }
});

// Load saved avatar on page load
window.addEventListener('load', () => {
  const savedAvatar = localStorage.getItem('avatarImage');
  if (savedAvatar) {
    avatarImage.src = savedAvatar;
  }
});

// Close modal when clicking outside
editAvatarModal.addEventListener('click', (e) => {
  if (e.target === editAvatarModal) {
    editAvatarModal.classList.add('hidden');
  }
});

/* ===========================
   Carousel
=========================== */
// Initialize carousels
function initCarousel(carouselId) {
  const dotsContainer = document.getElementById(carouselId);
  if (!dotsContainer) return;

  const carouselEl = dotsContainer.closest('.carousel');
  const carouselContainer = carouselEl.querySelector('.carousel-container');
  const images = carouselContainer.querySelectorAll('.carousel-img');
  const prevBtn = carouselEl.querySelector('.carousel-btn.prev');
  const nextBtn = carouselEl.querySelector('.carousel-btn.next');

  if (images.length === 0) return;

  let currentIndex = 0;
  let autoPlayInterval;

  // Create dots
  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = i === 0 ? 'carousel-dot active' : 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function updateCarousel() {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === currentIndex);
    });
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + images.length) % images.length;
    updateCarousel();
    resetAutoPlay();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Auto-play carousel
  startAutoPlay();

  // Pause on hover
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  carouselContainer.addEventListener('mouseleave', startAutoPlay);
}

// Initialize all carousels
window.addEventListener('load', () => {
  const carouselDots = document.querySelectorAll('.carousel-dots[id]');
  carouselDots.forEach(dots => {
    initCarousel(dots.id);
  });
});
