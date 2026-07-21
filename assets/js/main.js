document.addEventListener('DOMContentLoaded', () => {
  
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const rootEl = document.documentElement;
  const currentTheme = localStorage.getItem('theme') || 'dark';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

  if (currentTheme === 'light') {
    rootEl.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      if (isLight) {
        rootEl.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        rootEl.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Mobile Menu Toggle Logic
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');

  function setMenuOpen(isOpen) {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close Navigation Menu' : 'Open Navigation Menu');
    document.body.classList.toggle('nav-open', isOpen);
    if (navOverlay) {
      navOverlay.classList.toggle('active', isOpen);
      navOverlay.setAttribute('aria-hidden', String(!isOpen));
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setMenuOpen(!navMenu.classList.contains('active'));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // ═══════════════════════════════════════════════════════
  // SHOWCASE AUTO-ROTATING CAROUSEL
  // ═══════════════════════════════════════════════════════
  const browser = document.getElementById('showcase-browser');
  const slides = Array.from(document.querySelectorAll('.showcase-slide'));
  const indicators = Array.from(document.querySelectorAll('#showcase-indicators .indicator'));
  const addressBar = document.getElementById('browser-address-bar');
  const captionTitle = document.getElementById('showcase-caption-title');
  const captionDesc = document.getElementById('showcase-caption-desc');
  const prevBtn = document.getElementById('showcase-prev');
  const nextBtn = document.getElementById('showcase-next');
  
  let currentIndex = 0;
  let carouselInterval = null;
  const ROTATE_INTERVAL_MS = 4500;

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentIndex = index;

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    indicators.forEach((indicator, idx) => {
      indicator.classList.toggle('active', idx === currentIndex);
      indicator.setAttribute('aria-current', idx === currentIndex ? 'true' : 'false');
    });

    const activeSlide = slides[currentIndex];
    if (activeSlide) {
      if (addressBar) {
        const isHirePilot = activeSlide.getAttribute('data-title').includes('HirePilot');
        const domain = isHirePilot ? 'http://localhost:3000' : 'https://stackpilot.io';
        addressBar.textContent = domain + activeSlide.getAttribute('data-route');
      }
      if (captionTitle) {
        captionTitle.textContent = activeSlide.getAttribute('data-title');
      }
      if (captionDesc) {
        captionDesc.textContent = activeSlide.getAttribute('data-desc');
      }
    }
  }

  function startRotation() {
    if (prefersReducedMotion || slides.length <= 1) return;
    stopRotation();
    carouselInterval = setInterval(() => {
      showSlide(currentIndex + 1);
    }, ROTATE_INTERVAL_MS);
  }

  function stopRotation() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startRotation();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startRotation();
    });
  }

  indicators.forEach((indicator) => {
    indicator.addEventListener('click', (e) => {
      const targetSlide = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
      showSlide(targetSlide);
      startRotation();
    });
  });

  if (browser) {
    browser.addEventListener('mouseenter', stopRotation);
    browser.addEventListener('mouseleave', startRotation);
    
    browser.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        showSlide(currentIndex - 1);
        startRotation();
      } else if (e.key === 'ArrowRight') {
        showSlide(currentIndex + 1);
        startRotation();
      }
    });
  }

  if (slides.length) {
    showSlide(0);
    startRotation();
  }


  // ═══════════════════════════════════════════════════════
  // INTERACTIVE PRODUCT GALLERY & LIGHTBOX
  // ═══════════════════════════════════════════════════════
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let galleryIndex = 0;

  function openLightbox(index) {
    galleryIndex = index;
    const item = galleryItems[galleryIndex];
    if (!item || !lightbox || !lightboxImg || !lightboxCaption) return;

    const src = item.getAttribute('data-src');
    const caption = item.getAttribute('data-caption');
    const alt = item.querySelector('img')?.getAttribute('alt') || 'Expanded product screenshot';

    lightboxImg.setAttribute('src', src);
    lightboxImg.setAttribute('alt', alt);
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function nextGalleryImage() {
    let nextIdx = galleryIndex + 1;
    if (nextIdx >= galleryItems.length) nextIdx = 0;
    openLightbox(nextIdx);
  }

  function prevGalleryImage() {
    let prevIdx = galleryIndex - 1;
    if (prevIdx < 0) prevIdx = galleryItems.length - 1;
    openLightbox(prevIdx);
  }

  galleryItems.forEach((item, idx) => {
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', item.querySelector('img')?.getAttribute('alt') || 'View screenshot');
    item.addEventListener('click', () => openLightbox(idx));
    
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevGalleryImage);
  if (lightboxNext) lightboxNext.addEventListener('click', nextGalleryImage);

  if (lightbox) {
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextGalleryImage();
      } else if (e.key === 'ArrowLeft') {
        prevGalleryImage();
      }
    }
  });


  // ═══════════════════════════════════════════════════════
  // PARTICLE CANVAS BACKDROP
  // ═══════════════════════════════════════════════════════
  const canvas = document.getElementById('particles');
  if (canvas && !prefersReducedMotion && !isMobileViewport) {
    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    const particleCount = isMobileViewport ? 25 : 60;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    function particleColors() {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      return isLight
        ? { fill: 'rgba(2, 132, 199, 0.22)', line: [2, 132, 199] }
        : { fill: 'rgba(0, 247, 255, 0.2)', line: [0, 247, 255] };
    }

    function drawParticles() {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { fill, line } = particleColors();
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      const connectionDistance = isMobileViewport ? 90 : 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            const [r, g, b] = line;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${1 - dist / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        drawParticles();
      }
    });
  }


  // ═══════════════════════════════════════════════════════
  // SCROLL REVEAL OBSERVER
  // ═══════════════════════════════════════════════════════
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay, 10) : 0;
          setTimeout(() => {
            entry.target.classList.add('active');
          }, delay);
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

});
