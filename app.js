document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCanvas();
  initHeroCodeTabs();
  initCursorGlow();
  initMLSimulator();
  initProjectFilters();
  initSkillBars();
  initTerminal();
  initContactForm();
  initTiltCards();
  initMagneticButtons();
  initScrollReveal();
  initStatCounters();
  initRippleEffect();
  initActiveNavTracking();
});
/* --------------------------------------------------------------------------
   1. NAVBAR & SCROLL INTERACTION
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (progressBar) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    }
  });
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    // Close menu when link clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}
/* --------------------------------------------------------------------------
   2. HERO NEURAL NETWORK INTERACTIVE CANVAS
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 65);
  const mouse = { x: -9999, y: -9999, radius: 180 };
  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2.2 + 1;
      this.baseColor = Math.random() > 0.4 ? 'rgba(6, 182, 212,' : 'rgba(16, 185, 129,';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      // Mouse interactive push
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 3;
        this.y -= (dy / dist) * force * 3;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + '0.8)';
      ctx.fill();
    }
  }
  // Initialize Particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  function animate() {
    ctx.clearRect(0, 0, width, height);
    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}
/* --------------------------------------------------------------------------
   3. CURSOR GLOW — soft radial light that trails the pointer
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.matchMedia('(max-width: 768px)').matches) return;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.classList.add('active');
  });
  window.addEventListener('mouseleave', () => glow.classList.remove('active'));
  function loop() {
    // Ease toward the real cursor position for a smooth trailing feel
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();
}
/* --------------------------------------------------------------------------
   4. LIVE ML MODEL SIMULATOR LOGIC
   -------------------------------------------------------------------------- */
function initMLSimulator() {
  const inputAge = document.getElementById('input-age');
  const inputBp = document.getElementById('input-bp');
  const inputChol = document.getElementById('input-chol');
  const inputHr = document.getElementById('input-hr');
  if (!inputAge || !inputBp || !inputChol || !inputHr) return;
  const valAge = document.getElementById('val-age');
  const valBp = document.getElementById('val-bp');
  const valChol = document.getElementById('val-chol');
  const valHr = document.getElementById('val-hr');
  const gaugePath = document.getElementById('gauge-path');
  const gaugeScore = document.getElementById('gauge-score');
  const gaugeStatus = document.getElementById('gauge-status');
  const barCp = document.getElementById('bar-cp');
  const barHr = document.getElementById('bar-hr');
  const barChol = document.getElementById('bar-chol');
  const pctCp = document.getElementById('pct-cp');
  const pctHr = document.getElementById('pct-hr');
  const pctChol = document.getElementById('pct-chol');
  const presets = document.querySelectorAll('.btn-preset');
  function calculateRisk() {
    const age = parseInt(inputAge.value);
    const bp = parseInt(inputBp.value);
    const chol = parseInt(inputChol.value);
    const hr = parseInt(inputHr.value);
    // Update labels
    valAge.textContent = `${age} yrs`;
    valBp.textContent = `${bp} mmHg`;
    valChol.textContent = `${chol} mg/dL`;
    valHr.textContent = `${hr} bpm`;
    // Clinical Risk Formula Simulation (Random Forest approximation)
    let score = 0;
    // Age factor
    if (age > 50) score += (age - 50) * 0.8;
    // Blood pressure factor
    if (bp > 120) score += (bp - 120) * 0.35;
    // Cholesterol factor
    if (chol > 200) score += (chol - 200) * 0.25;
    // Max Heart Rate factor (lower max HR under stress increases risk)
    if (hr < 150) score += (150 - hr) * 0.3;
    // Normalize to 5% - 95% range
    score = Math.min(Math.max(Math.round(score), 5), 96);
    // Update Gauge Arc (total arc circumference is ~251.2)
    // 100% score = dashoffset 0; 0% score = dashoffset 251.2
    const offset = 251.2 - (score / 100) * 251.2;
    gaugePath.style.strokeDashoffset = offset;
    gaugeScore.textContent = `${score}%`;
    // Tiny pop animation on the score whenever it updates
    gaugeScore.style.transform = 'scale(1.12)';
    requestAnimationFrame(() => {
      setTimeout(() => { gaugeScore.style.transform = 'scale(1)'; }, 40);
    });
    // Status Label & Color
    if (score < 30) {
      gaugeStatus.textContent = 'Low Risk';
      gaugeStatus.className = 'gauge-status text-emerald';
    } else if (score < 65) {
      gaugeStatus.textContent = 'Moderate Risk';
      gaugeStatus.className = 'gauge-status text-amber';
    } else {
      gaugeStatus.textContent = 'Elevated Risk';
      gaugeStatus.className = 'gauge-status text-gradient-cyan';
    }
    // Feature Weight Impacts
    const hrWeight = Math.min(Math.round((Math.abs(180 - hr) / 110) * 45), 50);
    const bpWeight = Math.min(Math.round((bp / 200) * 35), 40);
    const cholWeight = Math.min(Math.round((chol / 400) * 30), 35);
    barCp.style.width = `${bpWeight}%`;
    pctCp.textContent = `${bpWeight}%`;
    barHr.style.width = `${hrWeight}%`;
    pctHr.textContent = `${hrWeight}%`;
    barChol.style.width = `${cholWeight}%`;
    pctChol.textContent = `${cholWeight}%`;
  }
  // Event Listeners
  [inputAge, inputBp, inputChol, inputHr].forEach(slider => {
    slider.addEventListener('input', calculateRisk);
  });
  // Presets
  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      presets.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.dataset.preset;
      if (preset === 'healthy') {
        inputAge.value = 35;
        inputBp.value = 115;
        inputChol.value = 185;
        inputHr.value = 172;
      } else if (preset === 'borderline') {
        inputAge.value = 54;
        inputBp.value = 138;
        inputChol.value = 240;
        inputHr.value = 142;
      } else if (preset === 'highrisk') {
        inputAge.value = 68;
        inputBp.value = 175;
        inputChol.value = 310;
        inputHr.value = 105;
      }
      calculateRisk();
    });
  });
  // Initial Calculation
  calculateRisk();
}
/* --------------------------------------------------------------------------
   5. FILTERABLE PROJECT SHOWCASE ENGINE
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}
/* --------------------------------------------------------------------------
   6. SKILL BARS ANIMATION (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');
  if (!skillFills.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const level = target.dataset.level;
        target.style.width = level;
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.2 });
  skillFills.forEach(fill => observer.observe(fill));
}
/* --------------------------------------------------------------------------
   7. INTERACTIVE CLI TERMINAL ENGINE
   -------------------------------------------------------------------------- */
function initTerminal() {
  const modalOverlay = document.getElementById('terminal-modal-overlay');
  const openBtn = document.getElementById('open-terminal-btn');
  const closeBtn = document.getElementById('close-terminal-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  if (!modalOverlay || !terminalInput) return;
  function toggleTerminal() {
    modalOverlay.classList.toggle('active');
    if (modalOverlay.classList.contains('active')) {
      terminalInput.focus();
    }
  }
  if (openBtn) openBtn.addEventListener('click', toggleTerminal);
  if (closeBtn) closeBtn.addEventListener('click', toggleTerminal);
  // Keyboard shortcut Ctrl+K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleTerminal();
    } else if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      toggleTerminal();
    }
  });
  // Command History & Parsing
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';
      if (!cmd) return;
      appendLine(`emaan@datascience:~$ ${cmd}`, 'text-cyan');
      executeCommand(cmd);
      // Scroll to bottom
      const body = document.getElementById('terminal-body');
      body.scrollTop = body.scrollHeight;
    }
  });
  function appendLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = text;
    terminalOutput.appendChild(line);
  }
  function executeCommand(cmd) {
    switch (cmd) {
      case 'help':
        appendLine('Available Commands:', 'text-emerald');
        appendLine('&nbsp;&nbsp;<span class="text-cyan">bio</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Print Emaan\'s bio &amp; background');
        appendLine('&nbsp;&nbsp;<span class="text-cyan">skills</span> &nbsp;&nbsp;&nbsp;- List core technical stack');
        appendLine('&nbsp;&nbsp;<span class="text-cyan">projects</span> - Display selected project repositories');
        appendLine('&nbsp;&nbsp;<span class="text-cyan">contact</span> &nbsp;&nbsp;- Output email &amp; social links');
        appendLine('&nbsp;&nbsp;<span class="text-cyan">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;- Clear terminal screen');
        appendLine('&nbsp;&nbsp;<span class="text-cyan">exit</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Close CLI modal');
        break;
      case 'bio':
        appendLine('Emaan Kashif — Data Science Student at NFC-IEFR Faisalabad (6th Semester).');
        appendLine('Specialized in building end-to-end data pipelines, ML classification models, and web applications.');
        break;
      case 'skills':
        appendLine('Technical Skills Stack:', 'text-emerald');
        appendLine('Languages: Python, SQL (PostgreSQL/MySQL), JavaScript, HTML/CSS');
        appendLine('ML & Math: scikit-learn, Random Forest, Feature Engineering, EDA, Pandas, NumPy');
        appendLine('Web & Tools: FastAPI, Streamlit, Power BI, Git, Vercel');
        break;
      case 'projects':
        appendLine('Selected Projects:', 'text-emerald');
        appendLine('1. Human vs AI Chess Predictor (FastAPI + Stockfish + ML)');
        appendLine('2. Blood Donor Data Pipeline (SQL Schema Repair)');
        appendLine('3. Punjab Agriculture Yield Analysis (Excel + Power BI)');
        appendLine('4. Heart Disease Prediction (scikit-learn Random Forest)');
        appendLine('5. Skin Disease Detector (Streamlit + CV)');
        break;
      case 'contact':
        appendLine('Contact Info:', 'text-emerald');
        appendLine('Email: emaankashif7965@gmail.com');
        appendLine('Phone: +92 301 4275057');
        appendLine('GitHub: https://github.com/EmaanKashif');
        appendLine('LinkedIn: https://linkedin.com/in/emaan-kashif-4397b225b');
        break;
      case 'clear':
        terminalOutput.innerHTML = '';
        break;
      case 'exit':
        toggleTerminal();
        break;
      default:
        appendLine(`Command not recognized: '${cmd}'. Type <span class="text-emerald">'help'</span> for list of commands.`, 'text-amber');
        break;
    }
  }
}
/* --------------------------------------------------------------------------
   8. CONTACT FORM & TOAST NOTIFICATION HANDLER
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('emaankashif7965@gmail.com').then(() => {
        showToast('Email address copied to clipboard!');
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const message = document.getElementById('cf-message').value.trim();
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\nSender: ${name} (${email})`);
      showToast('Opening email client with pre-filled message...');
      setTimeout(() => {
        window.location.href = `mailto:emaankashif7965@gmail.com?subject=${subject}&body=${body}`;
      }, 600);
    });
  }
}
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${msg}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
/* --------------------------------------------------------------------------
   9. TILT CARDS — 3D pointer-tilt + spotlight highlight that follows the
   cursor across the hero card and project cards
   -------------------------------------------------------------------------- */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;
  cards.forEach(card => {
    const maxTilt = 6; // degrees
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = (x / rect.width - 0.5) * 2; // -1 to 1
      const percentY = (y / rect.height - 0.5) * 2;
      const rotateX = (-percentY * maxTilt).toFixed(2);
      const rotateY = (percentX * maxTilt).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--spot-x', `${x}px`);
      card.style.setProperty('--spot-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}
/* --------------------------------------------------------------------------
   10. MAGNETIC BUTTONS — nudges primary/secondary CTAs toward the cursor
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn');
  if (!buttons.length) return;
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}
/* --------------------------------------------------------------------------
   11. SCROLL REVEAL — fades sections and cards in as they enter the viewport
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up');
  if (!targets.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => observer.observe(el));
}
/* --------------------------------------------------------------------------
   12. STAT COUNTERS — animate hero numbers up from 0 when scrolled into view
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const stats = document.querySelectorAll('[data-count-to]');
  if (!stats.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const to = parseFloat(el.dataset.countTo);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = to * eased;
        el.textContent = `${value.toFixed(decimals)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = `${to.toFixed(decimals)}${suffix}`;
        }
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(el => observer.observe(el));
}
/* --------------------------------------------------------------------------
   13.5. ACTIVE NAV TRACKING — highlights the nav link for the section
   currently in view (scroll-spy), a small but telling polish detail
   -------------------------------------------------------------------------- */
function initActiveNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinkMap = {};
  document.querySelectorAll('.nav-links a').forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    navLinkMap[id] = link;
  });
  if (!sections.length || !Object.keys(navLinkMap).length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = navLinkMap[id];
      if (!link) return;
      if (entry.isIntersecting) {
        Object.values(navLinkMap).forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-100px 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}
/* --------------------------------------------------------------------------
   13. RIPPLE EFFECT — small expanding pulse from the click point on buttons
   -------------------------------------------------------------------------- */
function initRippleEffect() {
  const clickables = document.querySelectorAll('.btn, .btn-preset, .filter-btn');
  clickables.forEach(el => {
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'btn-ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}
/* --------------------------------------------------------------------------
   14. HERO CODE TABS — interactive tab switcher for pipeline visual window
   -------------------------------------------------------------------------- */
function initHeroCodeTabs() {
  const container = document.getElementById('code-tabs');
  if (!container) return;
  const tabs = container.querySelectorAll('.code-tab');
  const panels = document.querySelectorAll('.code-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}
