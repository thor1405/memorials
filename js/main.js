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

  // 5. Theme Toggle Switcher (Light Mode & Dark Mode with LocalStorage Persistence)
  function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    let currentTheme = localStorage.getItem('gomes_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    function updateBtnIcon(theme) {
      if (!themeToggleBtn) return;
      if (theme === 'light') {
        // Show Moon icon to switch back to Dark Mode
        themeToggleBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Switch to Dark Mode">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
        `;
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        // Show Sun icon to switch to Light Mode
        themeToggleBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Switch to Light Mode">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
          </svg>
        `;
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      }
    }

    updateBtnIcon(currentTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('gomes_theme', currentTheme);
        updateBtnIcon(currentTheme);
      });
    }
  }

  initThemeToggle();
});
