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

    const typewriter = new Typewriter(document.getElementById('typewriter'), {
      loop: true,
      delay: 40,
    });

    typewriter
      .typeString("Automating Infrastructure.")
      .pauseFor(1000)
      .deleteAll()
      .typeString("Site Reliability Engineering.")
      .pauseFor(1000)
      .deleteAll()
      .typeString("Kubernetes Platform Engineering.")
      .pauseFor(1000)
      .deleteAll()
      .typeString("Your DevOps & SRE Partner.")
      .pauseFor(1200)
      .start();

    // Particle background
    const canvas = document.getElementById('particles');
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

      // Draw connection lines
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

    // Scroll Reveal Animation
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if(entry.target.dataset.delay) {
            setTimeout(() => {
              entry.target.classList.add('active');
            }, parseInt(entry.target.dataset.delay));
          } else {
            entry.target.classList.add('active');
          }
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    // Live Terminal Simulation
    const terminalCommands = [
      { cmd: "terraform apply", out: "Apply complete! Resources: 42 added, 0 changed, 0 destroyed." },
      { cmd: "kubectl get pods -A", out: "NAMESPACE     NAME                           READY   STATUS    RESTARTS   AGE\\nproduction    api-gateway-v2                 4/4     Running   0          12d\\nproduction    auth-service-v1                3/3     Running   0          12d\\nproduction    payment-service-v5             5/5     Running   0          12d" },
      { cmd: "helm upgrade production-api", out: "Release \"production-api\" has been upgraded. Happy Helming!\\nSTATUS: deployed\\nREVISION: 104" },
      { cmd: "jenkins build release-pipeline", out: "Started by user admin\\nBuilding in workspace /var/jenkins_home/workspace/release-pipeline\\nFinished: SUCCESS" },
      { cmd: "ansible-playbook deploy.yml", out: "PLAY [Deploy Core Infrastructure] **********************************************\\nPLAY RECAP *********************************************************************\\nproduction-db-01 : ok=12   changed=2    unreachable=0    failed=0    skipped=0" },
      { cmd: "aws eks update-kubeconfig --name core-cluster", out: "Added new context arn:aws:eks:us-east-1:123456789012:cluster/core-cluster to /home/root/.kube/config" },
      { cmd: "vault kv get production/secrets", out: "====== Data ======\\nKey                 Value\\n---                 -----\\ndb_password         ********\\napi_key             ********" },
      { cmd: "argocd app sync platform", out: "Name:               platform\\nProject:            default\\nServer:             https://kubernetes.default.svc\\nNamespace:          production\\nSync Status:        Synced\\nHealth Status:      Healthy" }
    ];

    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
      let cmdIndex = 0;
      function typeCommand() {
        terminalOutput.innerHTML = '<span class="prompt">root@silicon-roots:~$</span> ';
        const currentCmd = terminalCommands[cmdIndex].cmd;
        let charIndex = 0;
        
        const typeInterval = setInterval(() => {
          terminalOutput.innerHTML += currentCmd.charAt(charIndex);
          charIndex++;
          if (charIndex >= currentCmd.length) {
            clearInterval(typeInterval);
            setTimeout(() => {
              terminalOutput.innerHTML += '<br><span class="term-output">' + terminalCommands[cmdIndex].out.replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;') + '</span><br><br>';
              cmdIndex = (cmdIndex + 1) % terminalCommands.length;
              setTimeout(typeCommand, 3000);
            }, 600);
          }
        }, 60);
      }
      setTimeout(typeCommand, 1000);
    }

    // ═══════════════════════════════════════════════════════
    // COMMAND CENTER CHARTS
    // ═══════════════════════════════════════════════════════

    // ── Helpers ──────────────────────────────────────────
    function isLight() {
      return document.documentElement.getAttribute('data-theme') === 'light';
    }
    function accentColor() { return isLight() ? '#0284c7' : '#00f7ff'; }
    function greenColor()  { return '#27c93f'; }
    function dimColor()    { return isLight() ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'; }

    // ── 1. Resource Donut Rings ───────────────────────────
    function drawRing(canvas, pct, color) {
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 6;
      ctx.clearRect(0, 0, w, h);
      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = dimColor();
      ctx.lineWidth = 7;
      ctx.stroke();
      // Fill
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
      { id: 'ring-cpu', valId: 'ring-cpu-val', base: 0.68, drift: 0.04, color: () => accentColor() },
      { id: 'ring-mem', valId: 'ring-mem-val', base: 0.74, drift: 0.03, color: () => '#a78bfa' },
      { id: 'ring-net', valId: 'ring-net-val', base: 0.41, drift: 0.06, color: () => greenColor() },
    ];

    let ringValues = rings.map(r => r.base);

    function tickRings() {
      rings.forEach((r, i) => {
        // Slow random walk
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

    // ── 2. Latency Sparkline ──────────────────────────────
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

      // Latest dot
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

    // ── 3. Uptime Bars (30-day) ───────────────────────────
    function initUptimeBars() {
      const container = document.getElementById('uptime-bars');
      if (!container) return;
      container.innerHTML = '';
      // Simulate 30 days: mostly up, 2 small incidents
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

    // ── 4. Deploy Frequency Bar Chart ────────────────────
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

        // Value label
        ctx.fillStyle = isLight() ? '#0284c7' : '#00f7ff';
        ctx.font = `bold ${Math.max(9, bw * 0.35)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(v, x + bw / 2, y - 3);
      });

      // Day labels
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

    // ── 5. Hybrid Topology Canvas ─────────────────────────
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

      // Edges
      TOPO_EDGES.forEach(([a, b]) => {
        const pa = nodePos(a), pb = nodePos(b);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = dimColor();
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Packets
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

      // Nodes
      TOPO_NODES.forEach((n, i) => {
        const p = nodePos(i);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        // Label
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

    // ── 6. SLO Error Budget animated fill ────────────────
    function initSLO() {
      const fill = document.getElementById('slo-fill');
      if (!fill) return;
      setTimeout(() => { fill.style.width = '87.3%'; }, 600);
    }

    // ── Initialize all when Command Center enters view ────
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

    // Re-draw theme-sensitive canvases when theme toggles
    themeToggle && themeToggle.addEventListener('click', () => {
      setTimeout(() => {
        drawLatencySpark();
        drawDeployBars();
        rings.forEach((r, i) => {
          const c = document.getElementById(r.id);
          if (c) drawRing(c, ringValues[i], r.color());
        });
      }, 50);
    });
