document.addEventListener('DOMContentLoaded', () => {
  
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const rootEl = document.documentElement;
  const currentTheme = localStorage.getItem('theme') || 'dark';

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

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside the navbar
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
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
    // Wrap index boundaries
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentIndex = index;

    // Update active slide state
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update active dot indicators
    indicators.forEach((indicator, idx) => {
      if (idx === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    // Update browser fake route and caption details
    const activeSlide = slides[currentIndex];
    if (activeSlide) {
      if (addressBar) {
        addressBar.textContent = 'https://stackpilot.io' + activeSlide.getAttribute('data-route');
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

  // Event bindings for manual navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startRotation(); // Reset rotation timer
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startRotation(); // Reset rotation timer
    });
  }

  indicators.forEach((indicator) => {
    indicator.addEventListener('click', (e) => {
      const targetSlide = parseInt(e.target.getAttribute('data-slide'));
      showSlide(targetSlide);
      startRotation(); // Reset rotation timer
    });
  });

  // Pause on hover
  if (browser) {
    browser.addEventListener('mouseenter', stopRotation);
    browser.addEventListener('mouseleave', startRotation);
    
    // Keyboard navigation when focused
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

  // Initialize Showcase rotation
  showSlide(0);
  startRotation();


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

    lightboxImg.setAttribute('src', src);
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    // Focus close button for accessibility
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll
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

  // Gallery click triggers
  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
    
    // Support enter key for accessibility
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevGalleryImage);
  if (lightboxNext) lightboxNext.addEventListener('click', nextGalleryImage);

  // Close lightbox when clicking the overlay backdrop
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for Lightbox
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
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = Array.from({ length: 60 }, () => ({
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

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            const [r, g, b] = line;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${1 - dist / 120})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }


  // ═══════════════════════════════════════════════════════
  // SCROLL REVEAL OBSERVER
  // ═══════════════════════════════════════════════════════
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.dataset.delay) {
          setTimeout(() => {
            entry.target.classList.add('active');
          }, parseInt(entry.target.dataset.delay));
        } else {
          entry.target.classList.add('active');
        }
        observer.unobserve(entry.target); // Stop observing once active
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
  });



});
