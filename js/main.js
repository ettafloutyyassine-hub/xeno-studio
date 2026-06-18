// =========================================================
// XENO STUDIO — main.js
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initParticles();
  initNav();
  initTicker();
  initReveal();
  initMagnetic();
  initTilt();
  initFeedFilters();
  initCounters();
});

/* ---------------------------------------------------------
   Custom cursor glow
--------------------------------------------------------- */
function initCursorGlow(){
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(max-width: 860px)').matches) return;

  let mouseX = -300, mouseY = -300, curX = -300, curY = -300;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function loop(){
    curX += (mouseX - curX) * 0.16;
    curY += (mouseY - curY) * 0.16;
    glow.style.left = curX + 'px';
    glow.style.top = curY + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .tilt').forEach(el => {
    el.addEventListener('mouseenter', () => glow.style.opacity = '1.6');
    el.addEventListener('mouseleave', () => glow.style.opacity = '1');
  });
}

/* ---------------------------------------------------------
   Floating background particles
--------------------------------------------------------- */
function initParticles(){
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight * 1.0;
  }

  function makeParticles(){
    const count = Math.min(70, Math.floor((w * h) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(Math.random() * 0.18 + 0.04),
      o: Math.random() * 0.5 + 0.15
    }));
  }

  function draw(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,26,26,${p.o})`;
      ctx.shadowColor = 'rgba(255,26,26,0.6)';
      ctx.shadowBlur = 6;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  makeParticles();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); makeParticles(); }, 200);
  });
}

/* ---------------------------------------------------------
   Nav: scroll state + mobile burger
--------------------------------------------------------- */
function initNav(){
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (!burger || !mobile) return;

  burger.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   Ticker: duplicate row content for seamless loop
--------------------------------------------------------- */
function initTicker(){
  const row = document.getElementById('tickerRow');
  if (!row) return;
  row.innerHTML += row.innerHTML;
}

/* ---------------------------------------------------------
   Scroll-triggered reveal
--------------------------------------------------------- */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   Magnetic buttons
--------------------------------------------------------- */
function initMagnetic(){
  const buttons = document.querySelectorAll('.magnetic');
  if (window.matchMedia('(max-width: 860px)').matches) return;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
    });
  });
}

/* ---------------------------------------------------------
   Card tilt on hover
--------------------------------------------------------- */
function initTilt(){
  const cards = document.querySelectorAll('.tilt');
  if (window.matchMedia('(max-width: 860px)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ---------------------------------------------------------
   Feed filters
--------------------------------------------------------- */
function initFeedFilters(){
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.feed-card');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.type === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

/* ---------------------------------------------------------
   Animated stat counters
--------------------------------------------------------- */
function initCounters(){
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();

      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}
