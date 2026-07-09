export function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Check reduced motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleCount = reducedMotion ? 15 : 65;

  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.5 - 0.1, // Drifting gently upward
      opacity: Math.random() * 0.6 + 0.1,
      fadeSpeed: (Math.random() - 0.5) * 0.005,
      isGold: Math.random() > 0.3,
    });
  }

  let animationFrameId;

  function render() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    particles.forEach((p) => {
      if (!reducedMotion) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.fadeSpeed;

        if (p.opacity <= 0.1 || p.opacity >= 0.7) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
      }

      const colorPrefix = p.isGold
        ? (isDark ? 'rgba(212, 175, 55,' : 'rgba(197, 155, 39,')
        : (isDark ? 'rgba(249, 249, 251,' : 'rgba(132, 139, 159,');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${colorPrefix} ${Math.max(0.05, Math.min(0.8, p.opacity))})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = isDark ? 'rgba(212, 175, 55, 0.4)' : 'rgba(197, 155, 39, 0.25)';
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
}
