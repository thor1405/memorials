import { initSmoothScroll } from './smoothScroll.js';
import { initParticles } from './particles.js';
import { initAnimations } from './animations.js';
import { initCoffinShowcase } from './coffinShowcase.js';
import { initInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Branded Loading Screen Sequence
  const loadingScreen = document.getElementById('loading-screen');
  const loaderText = document.querySelector('.loader-text');

  if (loaderText) {
    setTimeout(() => {
      loaderText.style.opacity = '1';
      loaderText.style.transform = 'translateY(0)';
      loaderText.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    }, 200);
  }

  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.visibility = 'hidden';
    }
  }, 1600);

  // 2. Initialize Subsystems
  initSmoothScroll();
  initParticles();
  initAnimations();
  initCoffinShowcase();
  initInteractions();

  // 3. Navbar Scroll Blur & Shrink
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 4. Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }
  });

  // 5. Enforce Divine Dark Mode Permanently
  document.documentElement.setAttribute('data-theme', 'dark');
});
