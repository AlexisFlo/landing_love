document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  const cursor = document.getElementById('cursor');
  if (isMobile && cursor) {
    cursor.style.display = 'none';
  } else if (cursor) {
    document.addEventListener('mousemove', e => {
      requestAnimationFrame(() => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
    });

    document.querySelectorAll('a, button, .tl-card, .lore-entry, .tl-easter').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
  }

  const text = 'Cómo empezó todo...';
  let i = 0;
  const tw = document.getElementById('typewriter');
  if (tw) {
    function type() {
      if (i < text.length) {
        tw.textContent += text[i++];
        setTimeout(type, i === 1 ? 900 : 70 + Math.random() * 60);
      }
    }
    setTimeout(type, 1200);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('visible'), delay);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  const setupObserver = (selector, baseDelay) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.dataset.delay = index * baseDelay;
      observer.observe(el);
    });
  };

  setupObserver('.tl-item', 80);
  setupObserver('.lore-entry', 100);
  setupObserver('.click-label, .click-title, .click-text, .click-divider, .click-aside', 120);

  const createBlobs = () => {
    const blobCoords = [
      { top: '10%', left: '5%', color: 'var(--accent-blue)' },
      { top: '60%', left: '80%', color: 'var(--accent-pink)' },
      { top: '85%', left: '10%', color: 'var(--accent-red)' }
    ];
    
    blobCoords.forEach(coord => {
      const blob = document.createElement('div');
      blob.className = 'bg-blob';
      const size = isMobile ? '250px' : '450px';
      Object.assign(blob.style, {
        width: size, height: size,
        top: coord.top, left: coord.left,
        background: coord.color,
        position: 'fixed', borderRadius: '50%', filter: 'blur(70px)',
        opacity: '0.12', zIndex: '-1', pointerEvents: 'none',
        animation: 'float-blob 20s infinite alternate ease-in-out'
      });
      document.body.prepend(blob);
    });
  };
  createBlobs();

  document.addEventListener('click', (e) => {
    const sparkleCount = isMobile ? 4 : 8;
    const colors = ['#3b82f6', '#ec4899', '#e11d48'];
    
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.left = e.clientX + 'px';
      sparkle.style.top = e.clientY + 'px';
      
      document.body.appendChild(sparkle);
      
      const destX = (Math.random() - 0.5) * (isMobile ? 80 : 120);
      const destY = (Math.random() - 0.5) * (isMobile ? 80 : 120);
      
      const anim = sparkle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
      ], {
        duration: 500 + Math.random() * 500,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        fill: 'forwards'
      });
      
      anim.onfinish = () => sparkle.remove();
    }
  });

  const ornament = document.querySelector('.hero-ornament');
  if (ornament && !isMobile) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      ornament.style.transform = `translate(-50%, calc(-50% + ${y * 0.3}px))`;
    }, { passive: true });
  }

  window.toggleEaster = (btn) => {
    const reveal = btn.nextElementSibling;
    const card = btn.closest('.tl-card');
    const isOpen = reveal.classList.contains('open');

    btn.classList.toggle('open', !isOpen);
    reveal.classList.toggle('open', !isOpen);
    card.classList.toggle('expanded', !isOpen);
  };

  window.handleCTA = () => {
    showToast(' es aquí contigo. ♡');
  };

  window.showToast = (msg) => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  };
});