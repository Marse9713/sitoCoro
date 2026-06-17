document.addEventListener('DOMContentLoaded', function () {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- */
  /* Slideshow                                                         */
  /* ---------------------------------------------------------------- */

  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let autoplayTimer;

  function showSlide(n) {
    currentSlide = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  function scheduleAutoplay() {
    clearTimeout(autoplayTimer);
    if (prefersReducedMotion) return;
    autoplayTimer = setTimeout(() => {
      showSlide(currentSlide + 1);
      scheduleAutoplay();
    }, 5500);
  }

  if (slides.length) {
    showSlide(0);
    scheduleAutoplay();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      scheduleAutoplay();
    });
  });

  // Swipe support for touch devices
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    let touchStartX = 0;
    heroImage.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroImage.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) {
        showSlide(currentSlide + (delta < 0 ? 1 : -1));
        scheduleAutoplay();
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- */
  /* Navigation between pages                                          */
  /* ---------------------------------------------------------------- */

  const pages = document.querySelectorAll('.page');
  const sidebarLinks = document.querySelectorAll('.sidebar a[data-page]');

  function goToPage(name) {
    pages.forEach(p => p.classList.toggle('active', p.id === name));
    sidebarLinks.forEach(link => {
      const isActive = link.dataset.page === name;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.querySelector('.view').scrollIntoView({ block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goToPage(link.dataset.page);
      closeMenu();
    });
  });

  /* ---------------------------------------------------------------- */
  /* Mobile drawer                                                      */
  /* ---------------------------------------------------------------- */

  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('navOverlay');

  function openMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Chiudi il menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Apri il menu');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  /* ---------------------------------------------------------------- */
  /* Parallax (desktop only, respects reduced motion)                  */
  /* ---------------------------------------------------------------- */

  let ticking = false;

  function applyParallax() {
    const img = document.querySelector('#home .slide.active img');
    if (img) {
      const shift = Math.min(window.scrollY * 0.12, 36);
      img.style.transform = `translateY(${shift}px)`;
    }
    ticking = false;
  }

  if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth < 900) return;
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- */
  /* Footer year                                                        */
  /* ---------------------------------------------------------------- */

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});