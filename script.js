/* ==========================================================================
   LE LIS — Interações
   - Barra de progresso "fio dourado" no scroll
   - Header com transição on-scroll
   - Menu mobile
   - Reveal-on-scroll via IntersectionObserver
   - Smooth anchor scroll com offset de header fixo
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Ano dinâmico no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Thread progress bar ---------- */
  const threadBar = document.querySelector('.thread-progress');
  const updateThread = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (threadBar) threadBar.style.width = progress + '%';
  };

  /* ---------- Header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const updateHeader = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateThread();
        updateHeader();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateThread();
  updateHeader();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Smooth anchor scroll with header offset ---------- */
  const headerHeight = () => (header ? header.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const offset = headerHeight() + 16;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });

  /* ---------- Product "Ver Produto" -> redireciona para WhatsApp com contexto ---------- */
  const WHATSAPP_NUMBER = '5521999999999';

  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.btn-link');
    const nameEl = card.querySelector('.product-name');
    if (!btn || !nameEl) return;

    btn.addEventListener('click', () => {
      const productName = nameEl.textContent.trim();
      const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre a peça "${productName}".`);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener');
    });
  });

});
