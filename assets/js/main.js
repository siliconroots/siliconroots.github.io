const typewriter = new Typewriter(document.getElementById('typewriter'), {
      loop: true,
      delay: 40,
    });

    typewriter
      .typeString("Revolutionizing DevOps.")
      .pauseFor(1000)
      .deleteAll()
      .typeString("One Click CI/CD.")
      .pauseFor(1000)
      .deleteAll()
      .typeString("Smart Dockerization.")
      .pauseFor(1000)
      .deleteAll()
      .typeString("Multi-Cloud Optimization for Developers.")
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
      requestAnimationFrame(drawParticles);
    }

    drawParticles();
