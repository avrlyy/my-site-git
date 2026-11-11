document.addEventListener('DOMContentLoaded', () => {

  // ТЕМНАЯ ТЕМА
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ОТПРАВКА ФОРМЫ (КОНТАКТЫ)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.reset();
      if (formStatus) {
        formStatus.classList.add('visible');
        setTimeout(() => {
          formStatus.classList.remove('visible');
        }, 4000);
      }
    });
  }

  // МЕНЮ-БУРГЕР
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });

    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Открыть меню');
      });
    });
  }

  // МОДАЛЬНОЕ ОКНО
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  let lastFocused = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.querySelector('input, button')?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.querySelector(btn.dataset.openModal);
      if (modal) openModal(modal);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.closest('.modal-overlay'));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not([hidden])').forEach(closeModal);
    }
  });

  // Отправка модальной формы
  document.querySelectorAll('.modal-ajax-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Сообщение успешно отправлено!');
      closeModal(form.closest('.modal-overlay'));
      form.reset();
    });
  });

  // СЛАЙДЕР
  const slider = document.querySelector('.slider');
  if (slider) {
    const track = slider.querySelector('.slider__track');
    const slides = slider.querySelectorAll('.slider__slide');
    const prevBtn = slider.querySelector('.slider__btn--prev');
    const nextBtn = slider.querySelector('.slider__btn--next');
    const dotsBox = slider.querySelector('.slider__dots');

    let currentIndex = 0;
    let autoSlideTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', 'Перейти к слайду ' + (i + 1));
      dot.addEventListener('click', () => {
        goTo(i);
        restartTimer();
      });
      if (dotsBox) dotsBox.appendChild(dot);
    });

    const dots = dotsBox ? dotsBox.querySelectorAll('.slider__dot') : [];

    function goTo(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      if (track) {
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      }
      dots.forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));
    }

    prevBtn?.addEventListener('click', () => {
      goTo(currentIndex - 1);
      restartTimer();
    });

    nextBtn?.addEventListener('click', () => {
      goTo(currentIndex + 1);
      restartTimer();
    });

    function startTimer() {
      stopTimer();
      autoSlideTimer = setInterval(() => {
        goTo(currentIndex + 1);
      }, 5000);
    }

    function stopTimer() {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

    function restartTimer() {
      stopTimer();
      startTimer();
    }

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);

    goTo(0);
    startTimer();
  }

  // ТАБЫ (ВКЛАДКИ)
  const tabs = document.querySelectorAll('.tabs__tab');
  const panels = document.querySelectorAll('.tabs__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      panels.forEach(p => p.hidden = true);

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      tab.removeAttribute('tabindex');

      const targetPanel = document.querySelector(tab.dataset.tab);
      if (targetPanel) targetPanel.hidden = false;
    });
  });

});