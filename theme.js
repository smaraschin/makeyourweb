/**
 * FSU - Finanziaria Sviluppo Utilities
 * Theme Switcher - Runtime color theme changer
 */

(function () {
  'use strict';

  const THEMES = {
    blue:   { name: 'Blu Istituzionale', icon: '🔵' },
    green:  { name: 'Verde Istituzionale', icon: '🟢' },
    red:    { name: 'Rosso Istituzionale', icon: '🔴' },
    purple: { name: 'Viola Moderno', icon: '🟣' },
    teal:   { name: 'Teal Moderno', icon: '🩵' }
  };

  const STORAGE_KEY = 'fsu-theme';

  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'blue') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);

    // Update active state on all switchers across the page
    document.querySelectorAll('.theme-select').forEach(sel => {
      sel.value = theme;
    });

    // Update navbar background immediately via CSS variable (already handled by CSS)
    // Add transition class for smooth switch
    document.body.classList.add('theme-transitioning');
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 500);
  }

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'blue';
  }

  function buildThemeSwitcher(container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-switcher';

    const label = document.createElement('label');
    label.htmlFor = 'theme-select-' + Math.random().toString(36).slice(2, 7);
    label.textContent = '🎨 Tema:';

    const select = document.createElement('select');
    select.id = label.htmlFor;
    select.className = 'theme-select';
    select.setAttribute('aria-label', 'Seleziona tema colore');

    Object.entries(THEMES).forEach(([value, meta]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = meta.icon + ' ' + meta.name;
      select.appendChild(option);
    });

    select.value = getSavedTheme();

    select.addEventListener('change', function () {
      applyTheme(this.value);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);

    if (container) {
      container.appendChild(wrapper);
    }

    return wrapper;
  }

  function init() {
    // Apply saved theme on load
    applyTheme(getSavedTheme());

    // Find all theme switcher mount points and build the UI
    document.querySelectorAll('[data-theme-switcher]').forEach(container => {
      buildThemeSwitcher(container);
    });

    // Also insert into navbar if it has class .fsu-navbar
    const navbar = document.querySelector('.fsu-navbar .navbar-nav');
    if (navbar && !navbar.querySelector('.theme-switcher')) {
      const li = document.createElement('li');
      li.className = 'nav-item d-flex align-items-center ms-lg-3';
      buildThemeSwitcher(li);
      navbar.appendChild(li);
    }
  }

  // Counter animation for numbers section
  function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseFloat(entry.target.dataset.counter);
          const decimals = (entry.target.dataset.counter.toString().split('.')[1] || '').length;
          const duration = 2000;
          const step = duration / 60;
          let current = 0;
          const increment = target / (duration / step);

          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            entry.target.textContent = current.toFixed(decimals);
            if (current >= target) clearInterval(timer);
          }, step);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // Scroll animations
  function initScrollAnimations() {
    const items = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(el => observer.observe(el));
  }

  // Back to top button
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Navbar scroll effect
  function initNavbarScroll() {
    const navbar = document.querySelector('.fsu-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
      } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
      }
    });
  }

  // Active nav link
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.fsu-navbar .nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      animateCounters();
      initScrollAnimations();
      initBackToTop();
      initNavbarScroll();
      initActiveNav();
    });
  } else {
    init();
    animateCounters();
    initScrollAnimations();
    initBackToTop();
    initNavbarScroll();
    initActiveNav();
  }

})();
