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

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00f7ff33';
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
            ctx.strokeStyle = `rgba(0, 247, 255, ${1 - dist / 120})`;
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
      { cmd: "terraform apply -auto-approve", out: "Apply complete! Resources: 42 added, 0 changed, 0 destroyed." },
      { cmd: "kubectl get pods -n production", out: "NAME                 READY   STATUS    RESTARTS   AGE\\napi-gateway-v2       4/4     Running   0          12d\\nauth-service-v1      3/3     Running   0          12d\\npayment-service      5/5     Running   0          12d" },
      { cmd: "helm upgrade release oci://registry/chart", out: "Release \"production\" has been upgraded. Happy Helming!\\nSTATUS: deployed\\nREVISION: 42" }
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
