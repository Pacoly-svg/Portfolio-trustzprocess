// Header scroll state
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  header.classList.toggle('nav-open');
});
document.getElementById('navLinks').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') header.classList.remove('nav-open');
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// Animated stat counters
const statEls = document.querySelectorAll('.stat-num');
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = value.toLocaleString('fr-FR') + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
statEls.forEach((el) => statObserver.observe(el));

// Header image slider
const slider = document.getElementById('headerSlider');
if (slider) {
  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.slide-dots button');
  let current = 0;
  let timer;

  const goTo = (index) => {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  };

  const next = () => goTo((current + 1) % slides.length);

  const startAutoplay = () => {
    timer = setInterval(next, 5000);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      clearInterval(timer);
      startAutoplay();
    });
  });

  startAutoplay();
}

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = contactForm.firstName.value.trim();
    const lastName = contactForm.lastName.value.trim();
    const email = contactForm.email.value.trim();
    const phone = contactForm.phone.value.trim();
    const subject = contactForm.subject.selectedOptions[0].text;
    const message = contactForm.message.value.trim();

    const body = [
      `Nom : ${firstName} ${lastName}`,
      `Email : ${email}`,
      phone ? `Téléphone : ${phone}` : null,
      '',
      message
    ].filter(Boolean).join('\n');

    const mailto = `mailto:hello@trustzprocess.com?subject=${encodeURIComponent('[Site] ' + subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    const success = document.getElementById('formSuccess');
    if (success) success.classList.add('visible');
  });
}
