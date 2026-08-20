/* ==================== GARAJE 2O — script.js ==================== */

/* ==================== CONFIG ==================== */
const CONFIG = {
  WHATSAPP_NUMBER: "51923302876",
  PRICES: {
    basico:   { sedan: 60,  suv: 70 },
    premium:  { sedan: 110, suv: 130 },
    detailing:{ sedan: 160, suv: 190 }
  }
};

/* ==================== PRELOADER ==================== */
(function() {
  var preloader = document.getElementById('preloader');
  if (!preloader) return;

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }

  setTimeout(hidePreloader, 1000);

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(hidePreloader, 1200);
  });

  window.addEventListener('load', function() {
    setTimeout(hidePreloader, 400);
  });

  setTimeout(hidePreloader, 2000);
})();

/* ==================== SCROLL PROGRESS ==================== */
(function() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ==================== NAVBAR ==================== */
(function() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!nav) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    lastScroll = y;
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('active'));
    links.querySelectorAll('.nav__link').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('active'));
    });
  }
})();

/* ==================== CUSTOM CURSOR ==================== */
(function() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function raf() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(raf);
  })();

  document.querySelectorAll('a, button, .gallery__item, .pv-card__btn, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
})();

/* ==================== FAQ ==================== */
(function() {
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq__item.active').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
})();

/* ==================== TRUST COUNTER ==================== */
(function() {
  const blocks = document.querySelectorAll('.trust__number[data-target]');
  if (!blocks.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    blocks.forEach(function(el) { el.textContent = el.dataset.target; });
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  blocks.forEach(b => io.observe(b));

  function animateCounter(el) {
    const target = +el.dataset.target;
    const dur = 2000;
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(target * easeOut(p));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
})();

/* ==================== BEFORE/AFTER SLIDER ==================== */
(function() {
  const slider = document.querySelector('.before-after__slider');
  const handle = document.getElementById('baHandle');
  const afterEl = document.querySelector('.before-after__after');
  if (!slider || !handle || !afterEl) return;

  let dragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    handle.style.left = pct + '%';
    afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
  }

  handle.addEventListener('mousedown', () => dragging = true);
  handle.addEventListener('touchstart', () => dragging = true, { passive: true });
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('touchend', () => dragging = false);
  window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
  window.addEventListener('touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });

  slider.addEventListener('click', e => setPosition(e.clientX));
})();

/* ==================== PLAN SELECT (from card button) ==================== */
function selectPlan(el) {
  var planName = el.dataset.plan;
  var card = el.closest('.pv-card');
  var activeVehicle = '';
  if (card) {
    var activeBtn = card.querySelector('.pv-selector__btn.active');
    if (activeBtn) activeVehicle = activeBtn.dataset.vehicle || '';
  }
  /* Map plan name to plan key */
  var planKey = '';
  if (planName === 'ESTÁNDAR') planKey = 'basico';
  else if (planName === 'PREMIUM') planKey = 'premium';
  else if (planName === 'DETAILING') planKey = 'detailing';
  if (planKey && typeof openQuickReserveWith === 'function') {
    openQuickReserveWith(activeVehicle || 'sedan', planKey);
  }
  return false;
}

/* ==================== VEHICLE SELECTOR (Plan Cards) ==================== */
(function() {
  document.querySelectorAll('.pv-selector__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      const vehicle = btn.dataset.vehicle;
      const card = btn.closest('.pv-card');
      if (!card) return;

      // Toggle active state on selector buttons
      card.querySelectorAll('.pv-selector__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle price display
      card.querySelectorAll('.pv-card__price').forEach(p => p.classList.remove('active'));
      const priceEl = card.querySelector(`.pv-card__price[data-vehicle="${vehicle}"]`);
      if (priceEl) priceEl.classList.add('active');
    });
  });
})();

/* ==================== CTA BUTTONS → QUICK RESERVE ==================== */
(function() {
  /* "RESERVAR AHORA" in CTA Final section */
  var ctaReserveBtn = document.getElementById('ctaReserveBtn');
  if (ctaReserveBtn) {
    ctaReserveBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof openQuickReserveWith === 'function') openQuickReserveWith();
    });
  }

  /* Nav "RESERVAR AHORA" */
  var navCta = document.querySelector('.nav__cta');
  if (navCta) {
    navCta.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof openQuickReserveWith === 'function') openQuickReserveWith();
    });
  }

  /* Footer "AGENDAR SERVICIO" */
  var footerCta = document.querySelector('.footer__cta');
  if (footerCta) {
    footerCta.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof openQuickReserveWith === 'function') openQuickReserveWith();
    });
  }
})();

/* ==================== PLAN RECOMMENDER QUIZ ==================== */
(function() {
  const quiz = document.getElementById('quizContainer');
  if (!quiz) return;

  const progress = document.getElementById('quizProgress');
  const resultEl = document.getElementById('quizResult');
  const resultPlan = document.getElementById('quizResultPlan');
  const resultDesc = document.getElementById('quizResultDesc');
  const resultBtn = document.getElementById('quizResultBtn');

  let answers = { vehicle: '', priority: '', frequency: '' };
  let currentQ = 1;
  const totalQ = 3;

  quiz.querySelectorAll('.recommender__option').forEach(btn => {
    btn.addEventListener('click', () => {
      // Collect answer
      if (btn.dataset.q1) answers.vehicle = btn.dataset.q1;
      if (btn.dataset.q2) answers.priority = btn.dataset.q2;
      if (btn.dataset.q3) answers.frequency = btn.dataset.q3;

      // Hide current step
      const step = quiz.querySelector(`.recommender__step[data-quiz-step="${currentQ}"]`);
      if (step) step.classList.remove('active');

      currentQ++;

      if (currentQ <= totalQ) {
        // Show next question
        const next = quiz.querySelector(`.recommender__step[data-quiz-step="${currentQ}"]`);
        if (next) next.classList.add('active');
        if (progress) progress.style.width = `${(currentQ / totalQ) * 100}%`;
      } else {
        // Show result
        showRecommendation();
      }
    });
  });

  function showRecommendation() {
    if (progress) progress.style.width = '100%';

    let plan, desc, price;

    if (answers.priority === 'detailing') {
      plan = 'GARAJE 2O';
      desc = 'Para tu caso, el plan Garaje 20 es ideal. Incluye lavado de moto y protección UV — todo lo que necesitas para mantener tu vehículo en estado perfecto a largo plazo.';
      price = answers.vehicle === 'suv' ? 'S/190' : 'S/160';
    } else if (answers.priority === 'premium' || answers.frequency === 'frequent') {
      plan = 'PREMIUM';
      desc = 'El plan Premium es perfecto para ti. Incluye detailing interior completo, cera de protección y descontaminación de pintura. Ideal para quien cuida su vehículo con regularidad.';
      price = answers.vehicle === 'suv' ? 'S/130' : 'S/110';
    } else {
      plan = 'ESTÁNDAR';
      desc = 'El plan Estándar es ideal para ti. Lavado exterior completo, aspirado interior y limpieza de vidrios — todo lo esencial para mantener tu auto impecable.';
      price = answers.vehicle === 'suv' ? 'S/70' : 'S/60';
    }

    resultPlan.textContent = `${plan} — ${price}`;
    resultDesc.textContent = desc;
    resultBtn.href = '#planes';
    resultBtn.textContent = 'VER PLAN';

    // Show result, hide steps
    quiz.querySelectorAll('.recommender__step').forEach(s => s.style.display = 'none');
    resultEl.style.display = 'block';
  }
})();

/* ==================== ABOUT STATS — COUNTER ANIMATION ==================== */
(function() {
  var counters = document.querySelectorAll('.about__stat-number[data-count]');
  if (!counters.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(function(el) {
      el.textContent = el.dataset.count;
    });
    return;
  }

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        animateAboutCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  counters.forEach(function(c) { io.observe(c); });

  function animateAboutCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var dur = 2000;
    var start = performance.now();
    (function step(now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(target * easeOut(p));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
})();

/* ==================== ADDONS — SINGLE SOURCE OF TRUTH ==================== */
var AddonsManager = (function() {
  var STORAGE_KEY = 'garage20_selected_addons';
  var selectedAddons = [];
  var currentVehicle = null;

  var allAddonsData = [
    { id: 'addon-1',  name: 'Blend Spray Wax Black Hidrorrepelente', price: 50, vehicles: ['sedan','suv'] },
    { id: 'addon-2',  name: 'Blend Spray Wax Clásica',               price: 35, vehicles: ['sedan','suv'] },
    { id: 'addon-3',  name: 'Native Cerámica Spray Wax',             price: 35, vehicles: ['sedan','suv'] },
    { id: 'addon-4',  name: 'Descontaminación férrica de aros',      price: 35, vehicles: ['sedan','suv','moto'] },
    { id: 'addon-5',  name: 'Sellador y restaurador neumáticos',     price: 50, vehicles: ['sedan','suv','moto'] },
    { id: 'addon-6',  name: 'Limpieza profunda de tapicería',        price: 65, vehicles: ['sedan','suv'] },
    { id: 'addon-7',  name: 'Limpieza de alfombras',                 price: 45, vehicles: ['sedan','suv'] },
    { id: 'addon-8',  name: 'Limpieza de techo',                     price: 40, vehicles: ['sedan','suv'] },
    { id: 'addon-9',  name: 'Limpieza profunda de maletera',         price: 25, vehicles: ['sedan','suv'] }
  ];

  /* --- localStorage --- */
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedAddons));
    } catch (e) { /* silent */ }
  }

  function loadFromStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          selectedAddons = parsed.filter(function(item) {
            return item && item.id && item.name && typeof item.price === 'number';
          });
        }
      }
    } catch (e) { /* silent */ }
  }

  /* --- Core add / remove --- */
  function isAddonSelected(id) {
    return selectedAddons.some(function(a) { return a.id === id; });
  }

  function addAddon(id) {
    if (isAddonSelected(id)) return;
    var data = allAddonsData.find(function(a) { return a.id === id; });
    if (!data) return;
    selectedAddons.push({ id: data.id, name: data.name, price: data.price });
    saveToStorage();
    updateAllUI();
  }

  function removeAddon(id) {
    selectedAddons = selectedAddons.filter(function(a) { return a.id !== id; });
    saveToStorage();
    updateAllUI();
  }

  function toggleAddon(id) {
    if (isAddonSelected(id)) {
      removeAddon(id);
    } else {
      addAddon(id);
    }
  }

  function clearAll() {
    selectedAddons = [];
    saveToStorage();
    updateAllUI();
  }

  /* --- Getters --- */
  function getSelected() {
    return selectedAddons.slice();
  }

  function getAddonsTotal() {
    return selectedAddons.reduce(function(sum, a) { return sum + a.price; }, 0);
  }

  function getPlanPrice() {
    var sel = document.getElementById('bookingPlan');
    if (!sel || !sel.value) return 0;
    var m = sel.value.match(/S\/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function getTotal() {
    return getPlanPrice() + getAddonsTotal();
  }

  function getAllAddonsData() {
    return allAddonsData.slice();
  }

  /* ==================== UI UPDATE — ONE FUNCTION ==================== */
  function updateAllUI() {
    updatePageCards();
    updatePageSummary();
    updatePageSummaryCount();
    updateFloatingButton();
    if (typeof window.__updateFloatingReserve === 'function') {
      window.__updateFloatingReserve();
    }
    if (typeof window.__updateQModalSubtotal === 'function') {
      window.__updateQModalSubtotal();
    }
  }

  /* --- 1. Page cards: selected class + button text, filtered by vehicle --- */
  function updatePageCards() {
    var cards = document.querySelectorAll('.addons__card');
    cards.forEach(function(card) {
      var id = card.dataset.addonId;
      var btn = card.querySelector('.addons__card-btn');
      var addonData = allAddonsData.find(function(a) { return a.id === id; });
      var visible = !currentVehicle || (addonData && addonData.vehicles && addonData.vehicles.indexOf(currentVehicle) !== -1);
      card.style.display = visible ? '' : 'none';
      if (!visible && isAddonSelected(id)) {
        removeAddon(id);
      }
      if (isAddonSelected(id)) {
        card.classList.add('selected');
        if (btn) btn.textContent = '\u2713 AGREGADO';
      } else {
        card.classList.remove('selected');
        if (btn) btn.textContent = '+ AGREGAR';
      }
    });
  }

  /* --- 2. Page summary: list items + subtotal --- */
  function updatePageSummary() {
    var listEl = document.getElementById('addonsSummaryList');
    var emptyEl = document.getElementById('addonsSummaryEmpty');
    var totalWrap = document.getElementById('addonsSummaryTotal');
    var totalPriceEl = document.getElementById('addonsSummaryPrice');

    if (!listEl) return;

    var oldItems = listEl.querySelectorAll('.addons__summary-item');
    oldItems.forEach(function(item) { item.remove(); });

    if (selectedAddons.length === 0) {
      if (emptyEl) emptyEl.style.display = '';
      if (totalWrap) totalWrap.style.display = 'none';
      updateFloatingButton();
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (totalWrap) totalWrap.style.display = '';

    selectedAddons.forEach(function(addon) {
      var item = document.createElement('div');
      item.className = 'addons__summary-item';
      item.dataset.addonId = addon.id;
      item.innerHTML =
        '<div class="addons__summary-item-inner">' +
          '<span class="addons__summary-item-name">\u2713 ' + addon.name + '</span>' +
          '<span class="addons__summary-item-price">S/' + addon.price + '</span>' +
        '</div>' +
        '<button class="addons__summary-item-remove" type="button" title="Quitar" data-remove="' + addon.id + '">\u2715</button>';
      listEl.appendChild(item);
    });

    /* Bind remove buttons */
    listEl.querySelectorAll('.addons__summary-item-remove').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = this.dataset.remove;
        var itemEl = this.closest('.addons__summary-item');
        if (itemEl) {
          itemEl.classList.add('removing');
          setTimeout(function() { removeAddon(id); }, 300);
        } else {
          removeAddon(id);
        }
      });
    });

    if (totalPriceEl) {
      totalPriceEl.textContent = 'S/' + getAddonsTotal();
    }
    updateFloatingButton();
  }

  /* --- 3. Page summary count badge --- */
  function updatePageSummaryCount() {
    var countEl = document.getElementById('addonsSummaryCount');
    if (!countEl) return;
    countEl.textContent = selectedAddons.length > 0
      ? '(' + selectedAddons.length + ')'
      : '';
  }

  /* --- 4. Floating reserve button visibility --- */
  function updateFloatingButton() {
    var btn = document.getElementById('floatingReserveBtn');
    var countEl = document.getElementById('floatingReserveCount');
    if (!btn) return;
    if (selectedAddons.length > 0) {
      btn.classList.add('visible');
      if (countEl) countEl.textContent = selectedAddons.length;
    } else {
      btn.classList.remove('visible');
    }
    if (typeof window.__updateFloatingReserve === 'function') {
      window.__updateFloatingReserve();
    }
  }

  /* --- Init page cards --- */
  function initPageCards() {
    document.querySelectorAll('.addons__accordion-header').forEach(function(header) {
      header.addEventListener('click', function() {
        this.closest('.addons__accordion').classList.toggle('open');
      });
    });
    var cards = document.querySelectorAll('.addons__card');
    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        var wasSelected = isAddonSelected(card.dataset.addonId);
        toggleAddon(card.dataset.addonId);
        if (!wasSelected) {
          card.classList.remove('just-selected');
          void card.offsetWidth;
          card.classList.add('just-selected');
          setTimeout(function() { card.classList.remove('just-selected'); }, 500);
        }
      });
    });
  }

  /* --- Public API (for booking modal summary & WhatsApp) --- */
  function getFilteredAddons(vehicle) {
    if (!vehicle) return allAddonsData.slice();
    return allAddonsData.filter(function(a) {
      return a.vehicles && a.vehicles.indexOf(vehicle) !== -1;
    });
  }

  function setVehicle(vehicle) {
    currentVehicle = vehicle || null;
    updateAllUI();
  }

  function init() {
    loadFromStorage();
    initPageCards();
    updateAllUI();
  }

  return {
    init: init,
    getSelected: getSelected,
    getAddonsTotal: getAddonsTotal,
    getPlanPrice: getPlanPrice,
    getTotal: getTotal,
    getAllAddonsData: getAllAddonsData,
    getFilteredAddons: getFilteredAddons,
    setVehicle: setVehicle,
    isAddonSelected: isAddonSelected,
    addAddon: addAddon,
    removeAddon: removeAddon,
    toggleAddon: toggleAddon,
    clearAll: clearAll,
    clearAfterSubmit: function() {
      selectedAddons = [];
      saveToStorage();
      updateAllUI();
    },
    updateAllUI: updateAllUI
  };
})();

/* Auto-init when DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', AddonsManager.init);
} else {
  AddonsManager.init();
}

/* ==================== QUICK RESERVE MODAL ==================== */
(function() {
  var WHATSAPP_NEGOCIO = '51923302876';

  var COVERAGE_ZONES = [
    'Ica', 'La Tinguiña', 'Los Aquijes', 'Ocucaje', 'Pachacutec',
    'Parcona', 'Pueblo Nuevo', 'Salas', 'San José de Los Molinos',
    'San Juan Bautista', 'Santiago', 'Subtanjalla', 'Tate', 'Yauca del Rosario'
  ];

  var VEHICLE_LABELS = {
    sedan: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14"/><path d="M5 17a2 2 0 0 1-2-2v-3l2-5h14l2 5v3a2 2 0 0 1-2 2"/><path d="M5 17a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg> SEDÁN / HATCHBACK',
    suv:   '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17h16"/><path d="M4 17a2 2 0 0 1-2-2v-4l2-4h4l2 2h6l2-2h4l2 4v4a2 2 0 0 1-2 2"/><path d="M4 17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></svg> SUV / CAMIONETA',
    moto:  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h3l2 4h1"/><path d="M5.5 14l3-8h5l3 4"/><path d="M10 6v4"/><path d="M16.5 14l-3-8"/></svg> MOTOCICLETA'
  };
  var VEHICLE_PLAIN = {
    sedan: 'SEDÁN / HATCHBACK',
    suv:   'SUV / CAMIONETA',
    moto:  'MOTOCICLETA'
  };
  var PLAN_KEYS = ['basico', 'premium', 'detailing'];
  var PLAN_LABELS = {
    basico:   'PLAN ESTÁNDAR',
    premium:  'PLAN PREMIUM',
    detailing:'PLAN GARAJE 2O'
  };

  var qm = document.getElementById('quickReserveModal');
  var qmOverlay = document.getElementById('quickReserveOverlay');
  var qmClose = document.getElementById('quickReserveClose');
  var qmCloseBtn = document.getElementById('quickReserveCloseBtn');
  var qmConfirm = document.getElementById('quickReserveConfirm');
  var qmAddonsList = document.getElementById('qmodalAddonsList');
  var qmSubtotal = document.getElementById('qmodalSubtotalPrice');
  var qmTotalPrice = document.getElementById('qmodalTotalPrice');
  var qmError = document.getElementById('qmodalError');
  var floatingBtn = document.getElementById('floatingReserveBtn');
  var floatingCount = document.getElementById('floatingReserveCount');
  var qmSelectedTime = '';
  var qmSelectedVehicle = null;
  var qmSelectedPlan = null;
  var qmSelectedPlanPrice = 0;

  if (!qm) return;

  function showErrorQ(msg) {
    if (qmError) {
      qmError.textContent = msg;
      qmError.classList.add('visible');
    }
  }
  function hideErrorQ() {
    if (qmError) qmError.classList.remove('visible');
  }

  function checkCoverage(address) {
    var el = document.getElementById('qmodalCoverage');
    var icon = document.getElementById('qmodalCoverageIcon');
    var text = document.getElementById('qmodalCoverageText');
    if (!el || !icon || !text) return null;
    if (!address || address.length < 3) {
      el.className = 'qmodal__coverage';
      text.textContent = 'Ingresa tu dirección para verificar cobertura';
      icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';
      return null;
    }
    var lower = address.toLowerCase();
    var matched = COVERAGE_ZONES.some(function(zone) {
      return lower.indexOf(zone.toLowerCase()) !== -1;
    });
    if (matched) {
      el.className = 'qmodal__coverage qmodal__coverage--ok';
      text.textContent = 'Zona dentro de cobertura';
      icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
      return true;
    } else {
      el.className = 'qmodal__coverage qmodal__coverage--warn';
      text.textContent = 'Zona fuera de cobertura — confirma disponibilidad';
      icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      return false;
    }
  }

  function updatePlanPrices() {
    if (!qmSelectedVehicle || qmSelectedVehicle === 'moto') return;
    var prices = CONFIG.PRICES;
    PLAN_KEYS.forEach(function(key, i) {
      var card   = document.getElementById('qmodalPlanCard' + (i + 1));
      var priceEl = document.getElementById('qmodalPlanPrice' + (i + 1));
      var typeEl  = document.getElementById('qmodalPlanType'  + (i + 1));
      var nameEl  = card ? card.querySelector('.qmodal__plan-name') : null;
      var price = prices[key][qmSelectedVehicle];
      if (card)   { card.removeAttribute('disabled'); card.style.pointerEvents = ''; }
      if (priceEl) priceEl.textContent = (price === 0) ? 'CONSULTAR' : 'S/' + price;
      if (typeEl)  typeEl.innerHTML  = VEHICLE_LABELS[qmSelectedVehicle];
      if (nameEl)  nameEl.textContent  = PLAN_LABELS[key];
    });
    var badge = document.getElementById('qmodalVehicleBadge');
    if (badge) {
      badge.innerHTML = VEHICLE_LABELS[qmSelectedVehicle];
      badge.classList.add('visible');
    }
  }

  function syncPlanPrice() {
    if (!qmSelectedPlan || !qmSelectedVehicle || qmSelectedVehicle === 'moto') return;
    qmSelectedPlanPrice = CONFIG.PRICES[qmSelectedPlan][qmSelectedVehicle] || 0;
  }

  function updateTotalQ() {
    var addonsTotal = AddonsManager.getAddonsTotal();
    var isMoto = (qmSelectedVehicle === 'moto');
    var total = (isMoto ? 0 : qmSelectedPlanPrice) + addonsTotal;
    if (qmTotalPrice) qmTotalPrice.textContent = isMoto ? 'S/0 — Por cotizar' : 'S/' + total;
    if (qmSubtotal) qmSubtotal.textContent = 'S/' + addonsTotal;
    /* Hide/show total row based on moto mode */
    var totalRow = document.getElementById('qmodalTotalRow');
    if (totalRow) totalRow.style.display = isMoto ? 'none' : '';
  }

  function openQuickReserve(preVehicle, prePlan) {
    if (preVehicle) {
      qmSelectedVehicle = preVehicle;
      qmSelectedPlan = prePlan || null;
      AddonsManager.setVehicle(preVehicle);
      /* Show hidden moto card if moto is pre-selected */
      var motoCard = document.getElementById('qmodalVehicleMoto');
      if (motoCard) motoCard.classList.toggle('qmodal__vehicle-card--show', preVehicle === 'moto');
      syncPlanPrice();
    }
    hideErrorQ();
    populateQuickReserve();
    /* Toggle moto mode if moto is selected */
    toggleMotoMode(qmSelectedVehicle === 'moto');
    qm.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { initQmMap(); }, 120);
  }

  function closeQuickReserve() {
    qm.classList.remove('active');
    document.body.style.overflow = '';
    /* Hide moto card and reset vehicle state */
    var motoCard = document.getElementById('qmodalVehicleMoto');
    if (motoCard) motoCard.classList.remove('qmodal__vehicle-card--show');
    qmSelectedVehicle = null;
    qmSelectedPlan = null;
    qmSelectedPlanPrice = 0;
    AddonsManager.setVehicle(null);
    toggleMotoMode(false);
  }

  function populateQuickReserve() {
    hideErrorQ();
    var addons = AddonsManager.getSelected();

    /* Vehicle cards — preserve selection */
    var vehicleCards = qm.querySelectorAll('.qmodal__vehicle-card');
    vehicleCards.forEach(function(card) {
      card.classList.toggle('selected', card.dataset.vehicle === qmSelectedVehicle);
    });
    updatePlanPrices();

    /* Plan cards — preserve selection */
    var planCards = qm.querySelectorAll('.qmodal__plan-card');
    var planStillValid = false;
    planCards.forEach(function(card) {
      card.classList.toggle('selected', qmSelectedPlan === card.dataset.plan);
      if (qmSelectedPlan && card.dataset.plan === qmSelectedPlan) planStillValid = true;
    });
    if (!planStillValid) { qmSelectedPlan = null; qmSelectedPlanPrice = 0; }
    syncPlanPrice();
    updateTotalQ();

    /* Addons list — selectable cards filtered by vehicle */
    if (qmAddonsList) {
      qmAddonsList.innerHTML = '';
      var filteredAddons = AddonsManager.getFilteredAddons(qmSelectedVehicle);
      if (filteredAddons.length === 0) {
        qmAddonsList.innerHTML = '<p class="qmodal__addon-empty">No hay adicionales disponibles para este vehículo.</p>';
      } else {
        filteredAddons.forEach(function(addon) {
          var isSelected = AddonsManager.isAddonSelected(addon.id);
          var item = document.createElement('div');
          item.className = 'qmodal__addon-item' + (isSelected ? ' selected' : '');
          item.dataset.addonId = addon.id;
          item.innerHTML =
            '<span class="qmodal__addon-check">' + (isSelected ? '\u2713' : '') + '</span>' +
            '<span class="qmodal__addon-name">' + addon.name + '</span>' +
            '<span class="qmodal__addon-price">S/' + addon.price + '</span>';
          item.addEventListener('click', function() {
            AddonsManager.toggleAddon(addon.id);
            populateQuickReserve();
          });
          qmAddonsList.appendChild(item);
        });
      }
    }

    /* Reset time */
    qmSelectedTime = '';
    var timeInput = document.getElementById('qmodalTime');
    if (timeInput) timeInput.value = '';
    qm.querySelectorAll('.qmodal__time-btn').forEach(function(b) { b.classList.remove('active'); });

    /* Reset date input mask */
    var dateInput = document.getElementById('qmodalDate');
    if (dateInput) {
      dateInput.value = '';
      filterTimeSlots('');
    }

    /* Clear other fields */
    var nameInput = document.getElementById('qmodalName');
    var notesInput = document.getElementById('qmodalNotes');
    var motoNameInput = document.getElementById('qmodalMotoName');
    var motoNeedsInput = document.getElementById('qmodalMotoNeeds');
    if (nameInput) nameInput.value = '';
    if (notesInput) notesInput.value = '';
    resetMapState();
    if (motoNameInput) motoNameInput.value = '';
    if (motoNeedsInput) motoNeedsInput.value = '';
  }

  function formatDateQ(val) {
    if (!val) return '';
    return val;
  }

  function confirmQuickReserve() {
    hideErrorQ();
    var nameEl    = document.getElementById('qmodalName');
    var dateEl    = document.getElementById('qmodalDate');
    var notesEl   = document.getElementById('qmodalNotes');
    var addressEl = document.getElementById('qmodalAddress');
    var latEl     = document.getElementById('qmodalLat');
    var lngEl     = document.getElementById('qmodalLng');
    var motoNameEl  = document.getElementById('qmodalMotoName');
    var motoNeedsEl = document.getElementById('qmodalMotoNeeds');

    var name     = nameEl    ? nameEl.value.trim()    : '';
    var dateVal  = dateEl    ? dateEl.value            : '';
    var notes    = notesEl   ? notesEl.value.trim()    : '';
    var address  = addressEl ? addressEl.value.trim()  : '';
    var lat      = latEl     ? latEl.value.trim()      : '';
    var lng      = lngEl     ? lngEl.value.trim()      : '';
    var motoName  = motoNameEl  ? motoNameEl.value.trim()  : '';
    var motoNeeds = motoNeedsEl ? motoNeedsEl.value.trim() : '';

    if (!qmSelectedVehicle) {
      showErrorQ('Selecciona el tipo de vehículo para continuar.');
      return;
    }

    if (!name) {
      showErrorQ('Escribe tu nombre.');
      if (nameEl) nameEl.focus();
      return;
    }
    if (/[0-9]/.test(name)) {
      showErrorQ('El nombre no puede contener números.');
      if (nameEl) nameEl.focus();
      return;
    }

    if (!address) {
      showErrorQ('Selecciona una ubicación en el mapa o escribe una dirección.');
      var searchEl = document.getElementById('qmodalAddressSearch');
      if (searchEl) searchEl.focus();
      return;
    }

    if (lat && lng && !isInsideIca(parseFloat(lat), parseFloat(lng))) {
      showErrorQ('Selecciona una ubicación dentro de Ica, Perú.');
      return;
    }

    var isMoto = (qmSelectedVehicle === 'moto');

    if (isMoto) {
      if (!motoName) {
        showErrorQ('Escribe qué moto tienes.');
        if (motoNameEl) motoNameEl.focus();
        return;
      }
      if (!motoNeeds) {
        showErrorQ('Escribe qué necesita tu moto.');
        if (motoNeedsEl) motoNeedsEl.focus();
        return;
      }
    } else {
      if (!qmSelectedPlan) {
        showErrorQ('Selecciona un plan para continuar.');
        return;
      }
    }

    if (!dateVal) {
      showErrorQ('Selecciona una fecha para el servicio.');
      if (dateEl) dateEl.focus();
      return;
    }
    var parsedDate = parseDateDMY(dateVal);
    if (!parsedDate) {
      showErrorQ('Fecha inválida. Use el formato dd/mm/yyyy.');
      if (dateEl) dateEl.focus();
      return;
    }
    var todayCheck = new Date(); todayCheck.setHours(0,0,0,0);
    var maxCheck = new Date(); maxCheck.setMonth(maxCheck.getMonth() + 3);
    if (parsedDate < todayCheck || parsedDate > maxCheck) {
      showErrorQ('La fecha debe ser entre hoy y 3 meses adelante.');
      if (dateEl) dateEl.focus();
      return;
    }
    if (!qmSelectedTime) {
      showErrorQ('Selecciona una hora para el servicio.');
      var grid = document.getElementById('qmodalTimeGrid');
      if (grid) grid.style.outline = '1px solid rgba(200,80,80,0.5)';
      setTimeout(function() { if (grid) grid.style.outline = ''; }, 2000);
      return;
    }

    var addons = AddonsManager.getSelected();
    var addonsTotal = AddonsManager.getAddonsTotal();
    var formattedDate = formatDateQ(dateVal);
    var vehicleLabel = VEHICLE_PLAIN[qmSelectedVehicle] || qmSelectedVehicle;
    var googleMapsUrl = (lat && lng) ? 'https://www.google.com/maps?q=' + lat + ',' + lng : '';

    var msg;
    if (isMoto) {
      msg = '🏍️ *COTIZACIÓN GARAJE 2O MOTOS*\n\n' +
        '*Moto:* ' + motoName + '\n' +
        '*Necesita:* ' + motoNeeds + '\n\n' +
        '*Precio referencial:* Desde S/35\n' +
        '*Precio final:* Por cotizar\n' +
        '\n📅 *Fecha:* ' + formattedDate + '\n' +
        '⏰ *Hora:* ' + qmSelectedTime + '\n';
      if (address) {
        msg += '\n📍 *Ubicación:*\n' + address + '\n';
      }
      if (googleMapsUrl) {
        msg += '\n🗺️ *Ver ubicación en Google Maps:*\n' + googleMapsUrl + '\n';
      }
      if (addons.length > 0) {
        msg += '\n*Adicionales:*\n';
        addons.forEach(function(a) {
          msg += '• ' + a.name + ' — S/' + a.price + '\n';
        });
        msg += '*Subtotal adicionales:* S/' + addonsTotal + '\n';
      }
      msg += '\n👤 *Nombre:* ' + name + '\n';
      if (notes) {
        msg += '\n📝 *Observaciones:* ' + notes + '\n';
      }
    } else {
      var total = qmSelectedPlanPrice + addonsTotal;
      msg = '🚗 *NUEVA RESERVA — GARAJE 2O*\n\n' +
        '*Servicio:* ' + vehicleLabel + '\n' +
        '*Plan:* ' + PLAN_LABELS[qmSelectedPlan] + '\n' +
        '*Total:* S/' + total + '\n' +
        '\n📅 *Fecha:* ' + formattedDate + '\n' +
        '⏰ *Hora:* ' + qmSelectedTime + '\n';
      if (address) {
        msg += '\n📍 *Ubicación:*\n' + address + '\n';
      }
      if (googleMapsUrl) {
        msg += '\n🗺️ *Ver ubicación en Google Maps:*\n' + googleMapsUrl + '\n';
      }
      if (addons.length > 0) {
        msg += '\n*Adicionales:*\n';
        addons.forEach(function(a) {
          msg += '• ' + a.name + ' — S/' + a.price + '\n';
        });
        msg += '*Subtotal adicionales:* S/' + addonsTotal + '\n';
      }
      msg += '\n👤 *Nombre:* ' + name + '\n';
      if (notes) {
        msg += '\n📝 *Observaciones:* ' + notes + '\n';
      }
    }

    window.open('https://wa.me/' + WHATSAPP_NEGOCIO + '?text=' + encodeURIComponent(msg), '_blank');
    AddonsManager.clearAfterSubmit();
    closeQuickReserve();
  }

  /* --- Event bindings --- */
  if (qmOverlay) qmOverlay.addEventListener('click', closeQuickReserve);
  if (qmClose) qmClose.addEventListener('click', closeQuickReserve);
  if (qmCloseBtn) qmCloseBtn.addEventListener('click', closeQuickReserve);
  if (qmConfirm) qmConfirm.addEventListener('click', confirmQuickReserve);

  /* Vehicle cards */
  if (qm) {
    qm.querySelectorAll('.qmodal__vehicle-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var newVehicle = card.dataset.vehicle;
        var keepPlan   = (qmSelectedVehicle === newVehicle);
        qmSelectedVehicle = newVehicle;
        qm.querySelectorAll('.qmodal__vehicle-card').forEach(function(c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        /* Hide moto card if sedan/suv selected (it was only shown for pre-selection) */
        var motoCard = document.getElementById('qmodalVehicleMoto');
        if (motoCard && newVehicle !== 'moto') motoCard.classList.remove('qmodal__vehicle-card--show');
        /* Toggle moto mode */
        toggleMotoMode(newVehicle === 'moto');
        /* Remove addons that don't apply to the new vehicle */
        var filtered = AddonsManager.getFilteredAddons(newVehicle);
        var current = AddonsManager.getSelected();
        current.forEach(function(sa) {
          if (!filtered.some(function(fa) { return fa.id === sa.id; })) {
            AddonsManager.removeAddon(sa.id);
          }
        });
        AddonsManager.setVehicle(newVehicle);
        updatePlanPrices();
        if (qmSelectedPlan && !keepPlan) syncPlanPrice();
        else if (qmSelectedPlan) syncPlanPrice();
        updateTotalQ();
        populateQuickReserve();
      });
    });
  }

  /* Plan cards */
  if (qm) {
    qm.querySelectorAll('.qmodal__plan-card').forEach(function(card) {
      card.addEventListener('click', function() {
        qm.querySelectorAll('.qmodal__plan-card').forEach(function(c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        qmSelectedPlan = card.dataset.plan;
        syncPlanPrice();
        updateTotalQ();
      });
    });
  }

  /* ── Leaflet Map + Nominatim Search (Ica, Perú only) ── */
  var qmMap = null;
  var qmMarker = null;
  var qmSearchTimer = null;
  var ICA_CENTER = [-14.0678, -75.7285];
  var ZOOM_DEFAULT = 14;
  var ZOOM_SELECT = 17;
  /* Bounding box for Ica province — south, west, north, east */
  var ICA_BOUNDS = L.latLngBounds(
    L.latLng(-14.45, -76.10),
    L.latLng(-13.80, -75.35)
  );

  function isInsideIca(lat, lng) {
    return ICA_BOUNDS.contains([lat, lng]);
  }

  function initQmMap() {
    if (qmMap) {
      qmMap.invalidateSize();
      return;
    }
    if (typeof L === 'undefined') return;
    var mapEl = document.getElementById('qmodalMap');
    if (!mapEl) return;
    qmMap = L.map(mapEl, {
      zoomControl: true,
      attributionControl: true,
      maxBounds: ICA_BOUNDS.pad(0.3),
      maxBoundsViscosity: 0.85,
      minZoom: 11,
      maxZoom: 19
    }).setView(ICA_CENTER, ZOOM_DEFAULT);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(qmMap);

    qmMap.on('click', function(e) {
      if (!isInsideIca(e.latlng.lat, e.latlng.lng)) {
        var sel = document.getElementById('qmodalMapSelectedText');
        if (sel) sel.textContent = 'Ubicación fuera de Ica — selecciona un punto dentro de la zona';
        var covText = document.getElementById('qmodalCoverageText');
        if (covText) covText.textContent = 'Selecciona una ubicación dentro de Ica, Perú';
        var covEl = document.getElementById('qmodalCoverage');
        if (covEl) covEl.className = 'qmodal__coverage qmodal__coverage--warn';
        return;
      }
      placeMarker(e.latlng.lat, e.latlng.lng, true);
    });
  }

  function placeMarker(lat, lng, doReverse) {
    if (!qmMap) return;
    if (qmMarker) {
      qmMarker.setLatLng([lat, lng]);
    } else {
      var goldIcon = L.divIcon({
        className: 'qmodal__marker',
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [0, -42],
        html: '<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="#c8922e"/><circle cx="14" cy="14" r="6" fill="#1a1a24"/></svg>'
      });
      qmMarker = L.marker([lat, lng], { icon: goldIcon }).addTo(qmMap);
    }
    document.getElementById('qmodalLat').value = lat.toFixed(6);
    document.getElementById('qmodalLng').value = lng.toFixed(6);

    if (doReverse) {
      reverseGeocode(lat, lng);
    }
  }

  function reverseGeocode(lat, lng) {
    var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&addressdetails=1&accept-language=es&countrycodes=pe';
    fetch(url, { headers: { 'User-Agent': 'Garaje20Web/1.0' } })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var addr = data.display_name || '';
        setAddress(addr, lat, lng);
      })
      .catch(function() {
        setAddress(lat.toFixed(6) + ', ' + lng.toFixed(6), lat, lng);
      });
  }

  function setAddress(addr, lat, lng) {
    var hidden = document.getElementById('qmodalAddress');
    var search = document.getElementById('qmodalAddressSearch');
    var sel = document.getElementById('qmodalMapSelectedText');
    if (hidden) hidden.value = addr;
    if (search) search.value = addr;
    if (sel) sel.textContent = addr;
    checkCoverage(addr);
    if (lat !== undefined && lng !== undefined) {
      document.getElementById('qmodalLat').value = lat.toFixed(6);
      document.getElementById('qmodalLng').value = lng.toFixed(6);
    }
  }

  function nominatimSearch(query) {
    if (!query || query.length < 3) {
      hideSearchResults();
      return;
    }
    /* Ica bounding box: south,west,north,east — used as viewbox hint */
    var viewbox = '-76.10,-14.45,-75.35,-13.80';
    var url = 'https://nominatim.openstreetmap.org/search?format=json'
      + '&q=' + encodeURIComponent(query)
      + '&countrycodes=pe'
      + '&viewbox=' + viewbox
      + '&bounded=1'
      + '&limit=8'
      + '&addressdetails=1'
      + '&accept-language=es';
    fetch(url, { headers: { 'User-Agent': 'Garaje20Web/1.0' } })
      .then(function(r) { return r.json(); })
      .then(function(results) {
        /* Extra filter: only keep results inside Ica bounds */
        var filtered = results.filter(function(r) {
          return isInsideIca(parseFloat(r.lat), parseFloat(r.lon));
        });
        showSearchResults(filtered);
      })
      .catch(function() { hideSearchResults(); });
  }

  function showSearchResults(results) {
    var box = document.getElementById('qmodalMapResults');
    if (!box) return;
    box.innerHTML = '';
    if (!results || results.length === 0) {
      box.innerHTML = '<div class="qmodal__map-result qmodal__map-result--empty">Sin resultados en Ica</div>';
      box.classList.add('visible');
      return;
    }
    results.forEach(function(r) {
      var item = document.createElement('div');
      item.className = 'qmodal__map-result';
      item.textContent = r.display_name;
      item.addEventListener('click', function() {
        var lat = parseFloat(r.lat);
        var lng = parseFloat(r.lon);
        if (!isInsideIca(lat, lng)) return;
        qmMap.setView([lat, lng], ZOOM_SELECT);
        placeMarker(lat, lng, true);
        hideSearchResults();
      });
      box.appendChild(item);
    });
    box.classList.add('visible');
  }

  function hideSearchResults() {
    var box = document.getElementById('qmodalMapResults');
    if (box) { box.innerHTML = ''; box.classList.remove('visible'); }
  }

  function resetMapState() {
    var searchEl = document.getElementById('qmodalAddressSearch');
    var selEl = document.getElementById('qmodalMapSelectedText');
    var resultsEl = document.getElementById('qmodalMapResults');
    var hidden = document.getElementById('qmodalAddress');
    var latEl = document.getElementById('qmodalLat');
    var lngEl = document.getElementById('qmodalLng');
    if (searchEl) searchEl.value = '';
    if (selEl) selEl.textContent = 'Haz clic en el mapa o busca una dirección';
    if (resultsEl) { resultsEl.innerHTML = ''; resultsEl.classList.remove('visible'); }
    if (hidden) hidden.value = '';
    if (latEl) latEl.value = '';
    if (lngEl) lngEl.value = '';
    if (qmMarker && qmMap) {
      qmMap.removeLayer(qmMarker);
      qmMarker = null;
    }
    if (qmMap) qmMap.setView(ICA_CENTER, ZOOM_DEFAULT);
    checkCoverage('');
  }

  /* Name input — letters only filter */
  if (qm) {
    var nameInput = document.getElementById('qmodalName');
    if (nameInput) {
      nameInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
      });
    }
  }

  /* Search input events */
  if (qm) {
    var searchInput = document.getElementById('qmodalAddressSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        clearTimeout(qmSearchTimer);
        var val = this.value.trim();
        qmSearchTimer = setTimeout(function() { nominatimSearch(val); }, 450);
      });
      searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 3) nominatimSearch(this.value.trim());
      });
    }
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.qmodal__map-search')) hideSearchResults();
    });
  }

  /* Time buttons */
  if (qm) {
    qm.querySelectorAll('.qmodal__time-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        qm.querySelectorAll('.qmodal__time-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        qmSelectedTime = btn.dataset.time;
        var timeInput = document.getElementById('qmodalTime');
        if (timeInput) timeInput.value = qmSelectedTime;
      });
    });
  }

  /* ── Date change → filter time slots by business hours ── */
  function filterTimeSlots(dateStr) {
    if (!qm) return;
    var timeGrid = document.getElementById('qmodalTimeGrid');
    if (!timeGrid) return;
    var allBtns = timeGrid.querySelectorAll('.qmodal__time-btn');

    if (!dateStr) {
      allBtns.forEach(function(b) { b.style.display = ''; });
      return;
    }

    var parts = dateStr.split('/');
    if (parts.length !== 3) return;
    var d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    if (isNaN(d.getTime())) return;
    var day = d.getDay();
    var isWeekend = (day === 0 || day === 6);

    allBtns.forEach(function(b) {
      var h = parseInt(b.dataset.hours, 10);
      if (isWeekend) {
        b.style.display = (h >= 8 && h <= 19) ? '' : 'none';
      } else {
        b.style.display = (h >= 15 && h <= 19) ? '' : 'none';
      }
    });

    if (qmSelectedTime) {
      var selBtn = timeGrid.querySelector('.qmodal__time-btn.active');
      if (selBtn && selBtn.style.display === 'none') {
        selBtn.classList.remove('active');
        qmSelectedTime = '';
        var timeInput = document.getElementById('qmodalTime');
        if (timeInput) timeInput.value = '';
      }
    }
  }

  /* ── Date mask dd/mm/yyyy + validation ── */
  function parseDateDMY(str) {
    if (!str || str.length !== 10) return null;
    var p = str.split('/');
    if (p.length !== 3) return null;
    var d = parseInt(p[0], 10), m = parseInt(p[1], 10), y = parseInt(p[2], 10);
    if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 2020 || y > 2030) return null;
    var date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    return date;
  }

  if (qm) {
    var dateInput = document.getElementById('qmodalDate');
    if (dateInput) {
      dateInput.addEventListener('input', function(e) {
        var raw = this.value.replace(/\D/g, '');
        var formatted = '';
        if (raw.length > 0) formatted += raw.substring(0, 2);
        if (raw.length > 2) formatted += '/' + raw.substring(2, 4);
        if (raw.length > 4) formatted += '/' + raw.substring(4, 8);
        this.value = formatted;

        var parsed = parseDateDMY(formatted);
        if (parsed) {
          var today = new Date();
          today.setHours(0,0,0,0);
          var maxDate = new Date();
          maxDate.setMonth(maxDate.getMonth() + 3);
          if (parsed < today || parsed > maxDate) {
            this.style.borderColor = 'rgba(200,80,80,0.5)';
          } else {
            this.style.borderColor = '';
          }
        } else {
          this.style.borderColor = '';
        }

        filterTimeSlots(parsed ? formatted : '');
      });

      dateInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && (this.value.endsWith('/') || this.value.length === 3 || this.value.length === 6)) {
          this.value = this.value.slice(0, -1);
          e.preventDefault();
        }
      });

      dateInput.addEventListener('paste', function(e) {
        e.preventDefault();
        var text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        if (text.length >= 8) {
          this.value = text.substring(0,2) + '/' + text.substring(2,4) + '/' + text.substring(4,8);
          this.dispatchEvent(new Event('input'));
        }
      });
    }
  }

  /* Floating button */
  if (floatingBtn) {
    floatingBtn.addEventListener('click', function() {
      openQuickReserve();
    });
  }

  /* Update floating button from AddonsManager */
  window.__updateFloatingReserve = function() {
    if (!floatingBtn) return;
    var count = AddonsManager.getSelected().length;
    if (count > 0) {
      floatingBtn.classList.add('visible');
      if (floatingCount) floatingCount.textContent = count;
    } else {
      floatingBtn.classList.remove('visible');
    }
  };

  /* Update quick-reserve modal subtotal from AddonsManager */
  window.__updateQModalSubtotal = function() {
    updateTotalQ();
  };

  /* Toggle moto mode: hide plan grid, show moto service info block */
  function toggleMotoMode(isMoto) {
    var planSection = document.querySelector('.qmodal__plan-section');
    var planGrid = document.getElementById('qmodalPlanGrid');
    var planBadge = document.getElementById('qmodalVehicleBadge');
    var motoInfo = document.getElementById('qmodalMotoInfo');
    if (planGrid) planGrid.style.display = isMoto ? 'none' : '';
    if (planBadge) planBadge.style.display = isMoto ? 'none' : (planBadge.classList.contains('visible') ? '' : 'none');
    if (motoInfo) motoInfo.style.display = isMoto ? '' : 'none';
    if (isMoto) {
      qmSelectedPlan = null;
      qmSelectedPlanPrice = 0;
      qm.querySelectorAll('.qmodal__plan-card').forEach(function(c) { c.classList.remove('selected'); });
    }
    updateTotalQ();
  }

  /* Expose openQuickReserve globally for moto section buttons */
  window.openQuickReserveWith = function(vehicle, plan) {
    openQuickReserve(vehicle, plan);
  };
})();

/* ==================== MOTO RESERVE → Quick Reserve in moto mode ==================== */
function openMotoReserve() {
  if (typeof openQuickReserveWith === 'function') {
    openQuickReserveWith('moto');
  }
  return false;
}

/* ==================== SCROLL REVEAL — UNIVERSAL ==================== */
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    return;
  }

  var targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function(el) { io.observe(el); });
})();

(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#contacto') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

(function() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  if (!lightbox || !img) return;

  const items = Array.from(document.querySelectorAll('.gallery__item'));
  let currentIndex = -1;

  function openLightbox(index) {
    currentIndex = index;
    const source = items[index].querySelector('.gallery__img');
    if (!source) return;
    img.src = source.src;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('is-gallery');
    updateCounter();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentIndex = -1;
  }

  function navigate(dir) {
    if (currentIndex < 0) return;
    const next = currentIndex + dir;
    if (next < 0 || next >= items.length) return;
    openLightbox(next);
  }

  function updateCounter() {
    if (counter && currentIndex >= 0) {
      counter.textContent = `${currentIndex + 1} / ${items.length}`;
    }
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox__close')) {
      closeLightbox();
    }
  });

  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');
  if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
  if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? -1 : 1);
    }
  });
})();

(function() {
  const indicator = document.getElementById('heroScrollIndicator');
  if (!indicator) return;
  let hidden = false;
  window.addEventListener('scroll', () => {
    if (!hidden && window.scrollY > 100) {
      hidden = true;
      indicator.classList.add('hidden');
    }
  }, { passive: true });
})();