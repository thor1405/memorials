import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    // For reduced motion, reveal scripture words and cards immediately without motion
    document.querySelectorAll('.scripture-word, .scripture-ref, .casket-card, .timeline-content, .timeline-dot').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // 1. Hero Ken Burns Slow Zoom & Parallax
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      scale: 1.18,
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Hero Content Subtle Upward Fade on Scroll
  gsap.to('.hero-content', {
    y: -70,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'center center',
      end: 'bottom top',
      scrub: true,
    },
  });

  // 2. Scripture Word-by-Word Stagger Reveal
  const words = document.querySelectorAll('.scripture-word');
  if (words.length > 0) {
    gsap.fromTo(
      words,
      { opacity: 0.15, y: 15 },
      {
        opacity: 1,
        y: 0,
        color: '#f3e5ab',
        textShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#scripture',
          start: 'top 70%',
          end: 'center 40%',
          scrub: 1,
        },
      }
    );

    gsap.to('#quote-1-ref', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#quote-1-ref',
        start: 'top 80%',
      },
    });
  }

  // 3. Coffin Showcase Cards Stagger Reveal
  const casketCards = document.querySelectorAll('.casket-card');
  if (casketCards.length > 0) {
    gsap.fromTo(
      casketCards,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.showcase-grid',
          start: 'top 80%',
        },
      }
    );
  }

  // 4. Memorial Timeline Items Reveal
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    const content = item.querySelector('.timeline-content');
    const dot = item.querySelector('.timeline-dot');

    gsap.fromTo(
      [content, dot],
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        },
      }
    );
  });
}
