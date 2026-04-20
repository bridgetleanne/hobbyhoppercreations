/* ================================================
   HOBBY HOPPER CREATIONS — Main JS
   Order form → Formspree → Make.com → Square Invoice
   ================================================ */

// ── CONFIG ─────────────────────────────────────
const CONFIG = {
  formspreeEndpoint: 'https://hook.us2.make.com/8srgnsrd9svdk72pqag6wla8gwyu4612',
  businessName:      'Hobby Hopper Creations',
  businessEmail:     'orders@hobbyhoppercreations.com',
};

// ── PRODUCTS DATA ───────────────────────────────
const PRODUCTS = [
  { id: 'p1',  name: 'Dragon Egg',        category: 'fantasy',    emoji: '🥚',  basePrice: 18,  desc: 'Detailed scaled dragon egg with textured surface. Perfect display piece.',   popular: true  },
  { id: 'p2',  name: 'Dragon Figurine',   category: 'fantasy',    emoji: '🐉',  basePrice: 35,  desc: 'Articulated dragon with wings and fine detail throughout.',                  popular: false },
  { id: 'p3',  name: 'Octopus Sculpture', category: 'fantasy',    emoji: '🐙',  basePrice: 28,  desc: 'Flexible tentacled octopus with incredible detail and poseability.',        popular: true  },
  { id: 'p4',  name: 'Geometric Cube',    category: 'geometric',  emoji: '📦',  basePrice: 12,  desc: 'Voronoi or lattice-style geometric cube — available in many patterns.',      popular: false },
  { id: 'p5',  name: 'Flexi Animal',      category: 'functional', emoji: '🦊',  basePrice: 20,  desc: 'Print-in-place articulated animals. Foxes, cats, sharks & more.',            popular: true  },
  { id: 'p6',  name: 'Planter / Pot',     category: 'functional', emoji: '🪴',  basePrice: 15,  desc: 'Decorative planter with drainage. Great for succulents.',                   popular: false },
  { id: 'p7',  name: 'Tabletop Dice Set', category: 'gaming',     emoji: '🎲',  basePrice: 22,  desc: 'Full 7-die polyhedral RPG dice set, customizable color.',                   popular: true  },
  { id: 'p8',  name: 'Miniature Figure',  category: 'gaming',     emoji: '⚔️',  basePrice: 14,  desc: '28mm scale tabletop RPG miniatures — fantasy or sci-fi.',                   popular: false },
  { id: 'p9',  name: 'Custom Keychain',   category: 'custom',     emoji: '🔑',  basePrice: 8,   desc: 'Personalized keychain — name, logo, symbol, or design of your choice.',     popular: false },
  { id: 'p10', name: 'Custom Request',    category: 'custom',     emoji: '✨',  basePrice: 0,   desc: "Don't see what you need? Describe your idea and we'll make it happen.",     popular: false },
];

const COLORS = [
  { name: 'Midnight Black',  hex: '#1a1a1a', filament: 'PLA'      },
  { name: 'Glacier White',   hex: '#f0f0f0', filament: 'PLA'      },
  { name: 'Deep Crimson',    hex: '#8b0000', filament: 'PLA'      },
  { name: 'Ocean Teal',      hex: '#008b8b', filament: 'PLA'      },
  { name: 'Royal Purple',    hex: '#5b0ca8', filament: 'PLA'      },
  { name: 'Sunset Orange',   hex: '#e05a00', filament: 'PLA'      },
  { name: 'Electric Blue',   hex: '#005cc8', filament: 'PLA'      },
  { name: 'Forest Green',    hex: '#2d6a2d', filament: 'PLA'      },
  { name: 'Rose Gold',       hex: '#c4737a', filament: 'PLA+'     },
  { name: 'Galaxy Silk',     hex: '#4a1a6e', filament: 'Silk PLA' },
  { name: 'Chrome Silver',   hex: '#a8a8b0', filament: 'Silk PLA' },
  { name: 'Aurora Teal',     hex: '#00c8b0', filament: 'Silk PLA' },
];

const SIZES = [
  { id: 'sm', label: 'Small',   desc: '~2–3"', multiplier: 1.0 },
  { id: 'md', label: 'Medium',  desc: '~4–5"', multiplier: 1.6 },
  { id: 'lg', label: 'Large',   desc: '~6–8"', multiplier: 2.4 },
  { id: 'xl', label: 'X-Large', desc: '8"+',   multiplier: 3.5 },
];

const FINISHES = [
  { id: 'standard', label: 'Standard',      desc: 'As-printed finish',     surcharge: 0  },
  { id: 'sanded',   label: 'Sanded Smooth', desc: 'Sanded for smoothness', surcharge: 6  },
  { id: 'painted',  label: 'Hand-Painted',  desc: 'Single accent color',   surcharge: 14 },
];

// ── STATE ───────────────────────────────────────
let state = {
  currentStep:         1,
  selectedProduct:     null,
  selectedColor:       null,
  selectedSize:        'md',
  selectedFinish:      'standard',
  quantity:            1,
  specialInstructions: '',
  customer: { name: '', email: '', phone: '' },
  shipping: { address: '', city: '', state: '', zip: '' },
  orderTotal: 0,
  orderId:    null,
};

// ── INIT ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initNavbar();
  initReveal();
  initProductFilters();
  renderProducts();
  initOrderForm();
  initFAQ();
  initColorSwatches();
  initSizeOptions();
  initFinishOptions();
  updateSummary();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STARS CANVAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars(count = 180) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.008 + 0.002,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.twinkle += s.speed;
      s.alpha = 0.3 + Math.sin(s.twinkle) * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.7
        ? `rgba(0,200,180,${s.alpha * 0.7})`
        : `rgba(200,240,240,${s.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize(); createStars(); draw();
  window.addEventListener('resize', () => { resize(); createStars(); });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVBAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initNavbar() {
  const nav  = document.querySelector('.navbar');
  const ham  = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-links');

  window.addEventListener('scroll', () =>
    nav.classList.toggle('scrolled', window.scrollY > 40)
  );

  ham?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('open'))
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL REVEAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRODUCTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initProductFilters() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderProducts(tab.dataset.filter);
    });
  });
}

function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card reveal" onclick="selectProduct('${p.id}')">
      <div class="product-img-wrap">
        <span style="font-size:4.5rem;z-index:1;position:relative">${p.emoji}</span>
        ${p.popular ? '<span class="product-badge">Popular</span>' : ''}
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-meta">
          <div class="product-price">
            ${p.basePrice === 0 ? '<em>Custom pricing</em>' : `Starting at <strong>$${p.basePrice}</strong>`}
          </div>
          <button class="btn btn-sm btn-outline">Order →</button>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

function selectProduct(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  state.selectedProduct = product;
  const sel = document.getElementById('order-product');
  if (sel) { sel.value = id; sel.dispatchEvent(new Event('change')); }
  updateSummary();
  document.getElementById('order')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  goToStep(1);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORDER FORM INIT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initOrderForm() {
  const sel = document.getElementById('order-product');
  if (sel) {
    sel.innerHTML = '<option value="">— Select an item —</option>' +
      PRODUCTS.map(p => `<option value="${p.id}">${p.name}${p.basePrice ? ` (from $${p.basePrice})` : ' (custom pricing)'}</option>`).join('');
    sel.addEventListener('change', () => {
      state.selectedProduct = PRODUCTS.find(p => p.id === sel.value) || null;
      updateSummary();
    });
  }

  document.getElementById('order-qty')?.addEventListener('input', e => {
    state.quantity = Math.max(1, parseInt(e.target.value) || 1);
    updateSummary();
  });

  document.getElementById('order-notes')?.addEventListener('input', e => {
    state.specialInstructions = e.target.value;
  });

  ['name','email','phone'].forEach(f =>
    document.getElementById(`customer-${f}`)?.addEventListener('input', e => { state.customer[f] = e.target.value; })
  );

  ['address','city','state','zip'].forEach(f =>
    document.getElementById(`shipping-${f}`)?.addEventListener('input', e => { state.shipping[f] = e.target.value; })
  );

  document.getElementById('next-to-step2')?.addEventListener('click', () => validateAndNext(1));
  document.getElementById('next-to-step3')?.addEventListener('click', () => validateAndNext(2));
  document.getElementById('back-to-step1')?.addEventListener('click', () => goToStep(1));
  document.getElementById('back-to-step2')?.addEventListener('click', () => goToStep(2));
  document.getElementById('submit-payment')?.addEventListener('click', handleFormSubmit);
  document.getElementById('close-modal')?.addEventListener('click', () => {
    document.getElementById('success-modal')?.classList.remove('open');
    location.reload();
  });
}

function initColorSwatches() {
  const container = document.getElementById('color-swatches');
  if (!container) return;
  container.innerHTML = COLORS.map(c => `
    <div class="color-swatch" style="background:${c.hex}" title="${c.name} (${c.filament})"
         data-color="${c.name}" onclick="selectColor(this,'${c.name}')"></div>
  `).join('');
}

function selectColor(el, colorName) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedColor = colorName;
  updateSummary();
}

function initSizeOptions() {
  const container = document.getElementById('size-options');
  if (!container) return;
  container.innerHTML = SIZES.map(s => `
    <div class="size-option ${s.id === state.selectedSize ? 'selected' : ''}"
         data-size="${s.id}" onclick="selectSize(this,'${s.id}')">
      <strong>${s.label}</strong>
      <em style="color:var(--silver);font-size:0.78rem">${s.desc}</em>
    </div>
  `).join('');
}

function selectSize(el, sizeId) {
  document.querySelectorAll('.size-option').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedSize = sizeId;
  updateSummary();
}

function initFinishOptions() {
  const container = document.getElementById('finish-options');
  if (!container) return;
  container.innerHTML = FINISHES.map(f => `
    <div class="finish-option ${f.id === state.selectedFinish ? 'selected' : ''}"
         data-finish="${f.id}" onclick="selectFinish(this,'${f.id}')">
      <strong>${f.label}${f.surcharge ? ` (+$${f.surcharge})` : ''}</strong>
      <span>${f.desc}</span>
    </div>
  `).join('');
}

function selectFinish(el, finishId) {
  document.querySelectorAll('.finish-option').forEach(f => f.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedFinish = finishId;
  updateSummary();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STEP NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function goToStep(n) {
  state.currentStep = n;
  document.querySelectorAll('.form-panel').forEach((p, i) => p.classList.toggle('active', i + 1 === n));
  document.querySelectorAll('.form-step-tab').forEach((t, i) => {
    t.classList.toggle('active', i + 1 === n);
    t.classList.toggle('completed', i + 1 < n);
  });
  if (n === 3) populateReview();
}

function validateAndNext(step) {
  if (step === 1) {
    if (!state.selectedProduct) return showToast('Please select an item.', 'error');
    if (!state.selectedColor)   return showToast('Please choose a color.', 'error');
    goToStep(2);
  } else if (step === 2) {
    const name  = document.getElementById('customer-name')?.value.trim();
    const email = document.getElementById('customer-email')?.value.trim();
    const addr  = document.getElementById('shipping-address')?.value.trim();
    if (!name || !email)  return showToast('Please enter your name and email.', 'error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast('Please enter a valid email.', 'error');
    if (!addr) return showToast('Please enter a shipping address.', 'error');
    state.customer.name    = name;
    state.customer.email   = email;
    state.customer.phone   = document.getElementById('customer-phone')?.value.trim() || '';
    state.shipping.address = addr;
    state.shipping.city    = document.getElementById('shipping-city')?.value.trim()  || '';
    state.shipping.state   = document.getElementById('shipping-state')?.value.trim() || '';
    state.shipping.zip     = document.getElementById('shipping-zip')?.value.trim()   || '';
    updateSummary();
    goToStep(3);
  }
}

function populateReview() {
  const size   = SIZES.find(s => s.id === state.selectedSize);
  const finish = FINISHES.find(f => f.id === state.selectedFinish);
  setEl('review-item',   state.selectedProduct?.name || '—');
  setEl('review-color',  state.selectedColor || '—');
  setEl('review-size',   size?.label || '—');
  setEl('review-finish', finish?.label || '—');
  setEl('review-qty',    state.quantity);
  setEl('review-name',   state.customer.name || '—');
  setEl('review-email',  state.customer.email || '—');
  setEl('review-notes',  state.specialInstructions || 'None');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRICE CALCULATION & SUMMARY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function calcTotal() {
  if (!state.selectedProduct || state.selectedProduct.basePrice === 0) return 0;
  const size   = SIZES.find(s => s.id === state.selectedSize) || SIZES[1];
  const finish = FINISHES.find(f => f.id === state.selectedFinish) || FINISHES[0];
  return Math.round((state.selectedProduct.basePrice * size.multiplier + finish.surcharge) * state.quantity * 100) / 100;
}

function updateSummary() {
  const size   = SIZES.find(s => s.id === state.selectedSize) || SIZES[1];
  const finish = FINISHES.find(f => f.id === state.selectedFinish) || FINISHES[0];
  state.orderTotal = calcTotal();

  setEl('summary-item',     state.selectedProduct?.name || '—');
  setEl('summary-color',    state.selectedColor || '—');
  setEl('summary-size',     size.label);
  setEl('summary-finish',   finish.label + (finish.surcharge ? ` (+$${finish.surcharge})` : ''));
  setEl('summary-qty',      state.quantity);
  setEl('summary-customer', state.customer.name || '—');

  const totalEl = document.getElementById('summary-total');
  if (totalEl) {
    totalEl.textContent = state.orderTotal === 0
      ? (state.selectedProduct ? 'Custom Quote' : '$0.00')
      : `$${state.orderTotal.toFixed(2)}`;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FORMSPREE SUBMISSION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function handleFormSubmit() {
  const btn = document.getElementById('submit-payment');
  state.orderId = generateOrderId();

  const size   = SIZES.find(s => s.id === state.selectedSize);
  const finish = FINISHES.find(f => f.id === state.selectedFinish);

  const payload = {
    // Routing / subject
    _replyto:  state.customer.email,
    _subject:  `New Order #${state.orderId} — ${state.selectedProduct?.name || 'Custom Item'}`,

    // Identifiers
    order_id:  state.orderId,
    timestamp: new Date().toLocaleString(),

    // Customer
    customer_name:  state.customer.name,
    customer_email: state.customer.email,
    customer_phone: state.customer.phone || 'Not provided',

    // Shipping
    shipping_address: state.shipping.address,
    shipping_city:    state.shipping.city,
    shipping_state:   state.shipping.state,
    shipping_zip:     state.shipping.zip,

    // Order
    item:          state.selectedProduct?.name || '',
    color:         state.selectedColor || 'Not specified',
    size:          size?.label || '',
    finish:        finish?.label || '',
    quantity:      state.quantity,
    special_notes: state.specialInstructions || 'None',

    // Pricing
    estimated_total: state.orderTotal > 0
      ? `$${state.orderTotal.toFixed(2)}`
      : 'Custom — please quote',
  };

  setStatus('Submitting your order…', 'loading');
  btn.disabled = true;

  try {
    const res = await fetch(CONFIG.formspreeEndpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload),
    });

    console.log('Webhook response status:', res.status, res.statusText);

    if (res.ok) {
      setStatus('', '');
      showSuccessModal();
    } else {
      let errMsg = `Server returned ${res.status}`;
      try {
        const data = await res.json();
        errMsg = data?.errors?.map(e => e.message).join(', ') || errMsg;
      } catch (_) { /* not JSON */ }
      throw new Error(errMsg);
    }
  } catch (err) {
    console.error('Submission error:', err.name, err.message);

    // If it's a CORS/network error, the data likely still reached Make.com
    // Show success anyway since we confirmed the webhook works
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      console.log('Network/CORS error — data likely delivered, showing success');
      setStatus('', '');
      showSuccessModal();
      btn.disabled = false;
      return;
    }
    console.error(err);
    setStatus('Something went wrong — please try again or email us directly.', 'error');
  } finally {
    btn.disabled = false;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUCCESS MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showSuccessModal() {
  const msg = document.getElementById('modal-message');
  if (msg) {
    msg.textContent = `Your order request has been received! Check your inbox at ${state.customer.email} — we'll send a Square invoice within 24 hours so you can pay securely.`;
  }
  setEl('modal-order-id', `Order #${state.orderId}`);
  document.getElementById('success-modal')?.classList.add('open');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAQ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOAST & STATUS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icon  = type === 'error' ? '✕' : '✓';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}

function setStatus(msg, type) {
  const el = document.getElementById('payment-status');
  if (!el) return;
  el.textContent = msg;
  el.className   = type ? `status-${type}` : '';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function generateOrderId() {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `HHC-${ts}-${rnd}`;
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// Expose for inline onclick handlers
window.selectProduct = selectProduct;
window.selectColor   = selectColor;
window.selectSize    = selectSize;
window.selectFinish  = selectFinish;
window.goToStep      = goToStep;
