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


  // ═══════════════════════════════════════════════════════
  // COMMAND CENTER LIVE TELEMETRY SIMULATION
  // ═══════════════════════════════════════════════════════

  // Helpers
  function isLight() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }
  function accentColor() { return isLight() ? '#0284c7' : '#00f7ff'; }
  function greenColor()  { return '#27c93f'; }
  function dimColor()    { return isLight() ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'; }

  // 1. Resource Donut Rings
  function drawRing(canvas, pct, color) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 6;
    ctx.clearRect(0, 0, w, h);
    
    // Background track
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = dimColor();
    ctx.lineWidth = 7;
    ctx.stroke();
    
    // Colored fill
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  const rings = [
    { id: 'ring-cpu', valId: 'ring-cpu-val', base: 0.68, color: () => accentColor() },
    { id: 'ring-mem', valId: 'ring-mem-val', base: 0.74, color: () => '#a78bfa' },
    { id: 'ring-net', valId: 'ring-net-val', base: 0.41, color: () => greenColor() },
  ];

  let ringValues = rings.map(r => r.base);

  function tickRings() {
    rings.forEach((r, i) => {
      ringValues[i] = Math.min(0.98, Math.max(0.1,
        ringValues[i] + (Math.random() - 0.5) * 0.015
      ));
      const c = document.getElementById(r.id);
      const v = document.getElementById(r.valId);
      if (c) drawRing(c, ringValues[i], r.color());
      if (v) v.textContent = Math.round(ringValues[i] * 100) + '%';
    });
  }

  function initRings() {
    rings.forEach((r, i) => {
      const c = document.getElementById(r.id);
      if (c) drawRing(c, ringValues[i], r.color());
    });
    setInterval(tickRings, 1800);
  }

  // 2. Latency Sparkline
  const SPARK_POINTS = 30;
  let latencyData = Array.from({ length: SPARK_POINTS }, () => 38 + Math.random() * 18);

  function drawLatencySpark() {
    const canvas = document.getElementById('latency-spark');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 260;
    const H = canvas.offsetHeight || 55;
    canvas.width = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, W, H);

    const min = Math.min(...latencyData) - 5;
    const max = Math.max(...latencyData) + 5;
    const scaleY = v => H - ((v - min) / (max - min)) * (H - 8) - 4;
    const scaleX = i => (i / (SPARK_POINTS - 1)) * W;

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, isLight() ? 'rgba(2,132,199,0.25)' : 'rgba(0,247,255,0.25)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.moveTo(scaleX(0), scaleY(latencyData[0]));
    latencyData.forEach((v, i) => { if (i > 0) ctx.lineTo(scaleX(i), scaleY(v)); });
    ctx.lineTo(scaleX(SPARK_POINTS - 1), H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(scaleX(0), scaleY(latencyData[0]));
    latencyData.forEach((v, i) => { if (i > 0) ctx.lineTo(scaleX(i), scaleY(v)); });
    ctx.strokeStyle = accentColor();
    ctx.lineWidth = 2;
    ctx.shadowColor = accentColor();
    ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Head node
    const lx = scaleX(SPARK_POINTS - 1), ly = scaleY(latencyData[SPARK_POINTS - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = accentColor();
    ctx.shadowColor = accentColor();
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function tickLatency() {
    const newVal = Math.max(28, Math.min(90, latencyData[latencyData.length - 1] + (Math.random() - 0.5) * 8));
    latencyData.push(newVal);
    latencyData.shift();
    drawLatencySpark();
    const el = document.getElementById('latency-val');
    if (el) el.textContent = Math.round(newVal) + 'ms';
  }

  function initLatencySpark() {
    drawLatencySpark();
    setInterval(tickLatency, 1200);
    window.addEventListener('resize', drawLatencySpark);
  }

  // 3. Uptime Bars (30-day)
  function initUptimeBars() {
    const container = document.getElementById('uptime-bars');
    if (!container) return;
    container.innerHTML = '';
    const incidents = new Set([7, 22]);
    for (let i = 0; i < 30; i++) {
      const bar = document.createElement('div');
      bar.className = 'uptime-bar' + (incidents.has(i) ? ' incident' : '');
      const h = incidents.has(i) ? 8 : 12 + Math.random() * 8;
      bar.style.height = h + 'px';
      bar.title = incidents.has(i) ? 'Incident detected' : '100% uptime';
      container.appendChild(bar);
    }
  }

  // 4. Deploy Frequency Bar Chart
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let deployData = [42, 67, 55, 80, 91, 38, 61];

  function drawDeployBars() {
    const canvas = document.getElementById('deploy-bar');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 300;
    const H = canvas.offsetHeight || 110;
    canvas.width = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, W, H);

    const max = Math.max(...deployData) + 10;
    const barW = (W - 20) / DAYS.length;
    const pad = barW * 0.2;

    deployData.forEach((v, i) => {
      const x = 10 + i * barW + pad / 2;
      const bw = barW - pad;
      const bh = (v / max) * (H - 10);
      const y = H - bh;

      const grad = ctx.createLinearGradient(0, y, 0, H);
      grad.addColorStop(0, isLight() ? 'rgba(2,132,199,0.9)' : 'rgba(0,247,255,0.9)');
      grad.addColorStop(1, isLight() ? 'rgba(2,132,199,0.3)' : 'rgba(0,100,150,0.4)');

      ctx.beginPath();
      ctx.roundRect(x, y, bw, bh, [3, 3, 0, 0]);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.fillStyle = isLight() ? '#0284c7' : '#00f7ff';
      ctx.font = `bold ${Math.max(9, bw * 0.35)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(v, x + bw / 2, y - 3);
    });

    const lblCont = document.getElementById('deploy-bar-labels');
    if (lblCont) {
      lblCont.innerHTML = DAYS.map(d => `<span>${d}</span>`).join('');
    }
  }

  function tickDeployData() {
    deployData = deployData.map(v => Math.max(20, Math.min(120, v + Math.round((Math.random() - 0.5) * 10))));
    drawDeployBars();
  }

  function initDeployBars() {
    drawDeployBars();
    setInterval(tickDeployData, 3000);
    window.addEventListener('resize', drawDeployBars);
  }

  // 5. Hybrid Topology Canvas
  const TOPO_NODES = [
    { label: 'AWS',    x: 0.18, y: 0.25, color: '#f90' },
    { label: 'Azure',  x: 0.82, y: 0.25, color: '#00abf0' },
    { label: 'GCP',    x: 0.18, y: 0.78, color: '#4285f4' },
    { label: 'OnPrem', x: 0.82, y: 0.78, color: '#a78bfa' },
    { label: 'VPN',    x: 0.50, y: 0.50, color: '#27c93f' },
  ];
  const TOPO_EDGES = [[0,4],[1,4],[2,4],[3,4],[0,1],[2,3]];

  let topoPackets = TOPO_EDGES.map(([a, b]) => ({
    a, b, t: Math.random(), speed: 0.004 + Math.random() * 0.004
  }));

  function drawTopo() {
    const canvas = document.getElementById('topo-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 260;
    const H = canvas.offsetHeight || 110;
    canvas.width = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    function nodePos(n) {
      return { x: TOPO_NODES[n].x * W, y: TOPO_NODES[n].y * H };
    }

    ctx.clearRect(0, 0, W, H);

    // Render edges
    TOPO_EDGES.forEach(([a, b]) => {
      const pa = nodePos(a), pb = nodePos(b);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = dimColor();
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Render packets
    topoPackets.forEach(p => {
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
      const pa = nodePos(p.a), pb = nodePos(p.b);
      const px = pa.x + (pb.x - pa.x) * p.t;
      const py = pa.y + (pb.y - pa.y) * p.t;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#27c93f';
      ctx.shadowColor = '#27c93f';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Render nodes
    TOPO_NODES.forEach((n, i) => {
      const p = nodePos(i);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Node text labels
      ctx.fillStyle = isLight() ? '#1e293b' : '#c8eaff';
      ctx.font = '8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, p.x, p.y + 18);
    });
  }

  let topoRafId = null;
  function topoLoop() {
    drawTopo();
    topoRafId = requestAnimationFrame(topoLoop);
  }

  // 6. SLO error budget fill
  function initSLO() {
    const fill = document.getElementById('slo-fill');
    if (!fill) return;
    setTimeout(() => { fill.style.width = '87.3%'; }, 600);
  }

  // Trigger telemetry on entering viewport
  const cmdSection = document.getElementById('command-center');
  if (cmdSection) {
    const cmdObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        initRings();
        initLatencySpark();
        initUptimeBars();
        initDeployBars();
        initSLO();
        topoLoop();
        cmdObserver.disconnect();
      }
    }, { threshold: 0.1 });
    cmdObserver.observe(cmdSection);
  }

  // Theme change redrawing hooks
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTimeout(() => {
        drawLatencySpark();
        drawDeployBars();
        rings.forEach((r, i) => {
          const c = document.getElementById(r.id);
          if (c) drawRing(c, ringValues[i], r.color());
        });
      }, 50);
    });
  }

});
