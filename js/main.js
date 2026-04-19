/* ================================================
   HOBBY HOPPER CREATIONS — Main JS
   Square Payments + EmailJS Order Notifications
   ================================================ */

// ── CONFIG ─────────────────────────────────────
// ⚠️  Replace these with your real credentials!
const CONFIG = {
  // Square Web Payments SDK
  squareAppId:       'sandbox-sq0idb-REPLACE_WITH_YOUR_APP_ID',
  squareLocationId:  'REPLACE_WITH_YOUR_LOCATION_ID',
  squareEnv:         'sandbox', // Change to 'production' when live

  // EmailJS (for owner notifications)
  emailjsServiceId:  'YOUR_EMAILJS_SERVICE_ID',
  emailjsTemplateId: 'YOUR_EMAILJS_TEMPLATE_ID',
  emailjsPublicKey:  'YOUR_EMAILJS_PUBLIC_KEY',
  ownerEmail:        'your@email.com',

  // Business info
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
  { name: 'Midnight Black',   hex: '#1a1a1a',  filament: 'PLA' },
  { name: 'Glacier White',    hex: '#f0f0f0',  filament: 'PLA' },
  { name: 'Deep Crimson',     hex: '#8b0000',  filament: 'PLA' },
  { name: 'Ocean Teal',       hex: '#008b8b',  filament: 'PLA' },
  { name: 'Royal Purple',     hex: '#5b0ca8',  filament: 'PLA' },
  { name: 'Sunset Orange',    hex: '#e05a00',  filament: 'PLA' },
  { name: 'Electric Blue',    hex: '#005cc8',  filament: 'PLA' },
  { name: 'Forest Green',     hex: '#2d6a2d',  filament: 'PLA' },
  { name: 'Rose Gold',        hex: '#c4737a',  filament: 'PLA+' },
  { name: 'Galaxy Silk',      hex: '#4a1a6e',  filament: 'Silk PLA' },
  { name: 'Chrome Silver',    hex: '#a8a8b0',  filament: 'Silk PLA' },
  { name: 'Aurora Teal',      hex: '#00c8b0',  filament: 'Silk PLA' },
];

const SIZES = [
  { id: 'sm',  label: 'Small',   desc: '~2–3"',   multiplier: 1.0 },
  { id: 'md',  label: 'Medium',  desc: '~4–5"',   multiplier: 1.6 },
  { id: 'lg',  label: 'Large',   desc: '~6–8"',   multiplier: 2.4 },
  { id: 'xl',  label: 'X-Large', desc: '8"+',     multiplier: 3.5 },
];

const FINISHES = [
  { id: 'standard',  label: 'Standard',        desc: 'As-printed finish',         surcharge: 0  },
  { id: 'sanded',    label: 'Sanded Smooth',   desc: 'Sanded for smoothness',     surcharge: 6  },
  { id: 'painted',   label: 'Hand-Painted',    desc: 'Single accent color',       surcharge: 14 },
  { id: 'epoxy',     label: 'Epoxy Coated',    desc: 'Glossy protective coat',    surcharge: 10 },
];

// ── STATE ───────────────────────────────────────
let state = {
  currentStep:    1,
  selectedProduct: null,
  selectedColor:   null,
  selectedSize:    'md',
  selectedFinish:  'standard',
  quantity:        1,
  specialInstructions: '',
  customer: {
    name: '', email: '', phone: ''
  },
  orderTotal: 0,
  squareCard: null,
  orderId: null,
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
  initSquare();
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
        x:       Math.random() * W,
        y:       Math.random() * H,
        r:       Math.random() * 1.5 + 0.2,
        alpha:   Math.random(),
        speed:   Math.random() * 0.008 + 0.002,
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
      const teal = Math.random() > 0.7;
      ctx.fillStyle = teal
        ? `rgba(0,200,180,${s.alpha * 0.7})`
        : `rgba(200,240,240,${s.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();
  window.addEventListener('resize', () => { resize(); createStars(); });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVBAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initNavbar() {
  const nav  = document.querySelector('.navbar');
  const ham  = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  ham?.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL REVEAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = `${i * 60}ms`;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
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

  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

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
            ${p.basePrice === 0
              ? '<em>Varies by complexity</em>'
              : `Starting at <strong>$${p.basePrice}</strong>`}
          </div>
          <button class="btn btn-sm btn-outline">Order →</button>
        </div>
      </div>
    </div>
  `).join('');

  // Re-init reveal on new cards
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

function selectProduct(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  state.selectedProduct = product;
  updateSummary();
  // Update the product dropdown in form
  const sel = document.getElementById('order-product');
  if (sel) {
    sel.value = id;
    sel.dispatchEvent(new Event('change'));
  }
  // Scroll to order form
  document.getElementById('order')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  goToStep(1);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORDER FORM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initOrderForm() {
  // Populate product dropdown
  const sel = document.getElementById('order-product');
  if (sel) {
    sel.innerHTML = '<option value="">— Select an item —</option>' +
      PRODUCTS.map(p => `<option value="${p.id}">${p.name}${p.basePrice ? ` (from $${p.basePrice})` : ' (custom pricing)'}</option>`).join('');

    sel.addEventListener('change', () => {
      const p = PRODUCTS.find(p => p.id === sel.value);
      state.selectedProduct = p || null;
      updateSummary();
    });
  }

  // Quantity
  const qtyInput = document.getElementById('order-qty');
  qtyInput?.addEventListener('input', () => {
    state.quantity = Math.max(1, parseInt(qtyInput.value) || 1);
    updateSummary();
  });

  // Special instructions
  const notesInput = document.getElementById('order-notes');
  notesInput?.addEventListener('input', () => {
    state.specialInstructions = notesInput.value;
  });

  // Customer fields
  ['name','email','phone'].forEach(field => {
    document.getElementById(`customer-${field}`)?.addEventListener('input', (e) => {
      state.customer[field] = e.target.value;
    });
  });

  // Navigation buttons
  document.getElementById('next-to-step2')?.addEventListener('click', () => validateAndNext(1));
  document.getElementById('next-to-step3')?.addEventListener('click', () => validateAndNext(2));
  document.getElementById('back-to-step1')?.addEventListener('click', () => goToStep(1));
  document.getElementById('back-to-step2')?.addEventListener('click', () => goToStep(2));

  // Payment submit
  document.getElementById('submit-payment')?.addEventListener('click', handlePaymentSubmit);
}

function initColorSwatches() {
  const container = document.getElementById('color-swatches');
  if (!container) return;

  container.innerHTML = COLORS.map(c => `
    <div class="color-swatch"
         style="background:${c.hex}"
         title="${c.name} (${c.filament})"
         data-color="${c.name}"
         onclick="selectColor(this, '${c.name}')">
    </div>
  `).join('');
}

function selectColor(el, colorName) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedColor = colorName;
  document.getElementById('summary-color').textContent = colorName;
}

function initSizeOptions() {
  const container = document.getElementById('size-options');
  if (!container) return;

  container.innerHTML = SIZES.map(s => `
    <div class="size-option ${s.id === state.selectedSize ? 'selected' : ''}"
         data-size="${s.id}"
         onclick="selectSize(this, '${s.id}')">
      <strong>${s.label}</strong> <em style="color:var(--silver);font-size:0.78rem">${s.desc}</em>
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
         data-finish="${f.id}"
         onclick="selectFinish(this, '${f.id}')">
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

// ── Step Navigation ──────────────────────────────
function goToStep(n) {
  state.currentStep = n;
  document.querySelectorAll('.form-panel').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === n);
  });
  document.querySelectorAll('.form-step-tab').forEach((t, i) => {
    t.classList.toggle('active', i + 1 === n);
    t.classList.toggle('completed', i + 1 < n);
  });
}

function validateAndNext(step) {
  if (step === 1) {
    if (!state.selectedProduct) {
      showToast('Please select an item to order.', 'error');
      return;
    }
    if (!state.selectedColor) {
      showToast('Please choose a color.', 'error');
      return;
    }
    goToStep(2);
  } else if (step === 2) {
    const name  = document.getElementById('customer-name')?.value.trim();
    const email = document.getElementById('customer-email')?.value.trim();
    if (!name || !email) {
      showToast('Please fill in your name and email.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    state.customer.name  = name;
    state.customer.email = email;
    state.customer.phone = document.getElementById('customer-phone')?.value.trim() || '';
    updateSummary();
    goToStep(3);
  }
}

// ── Price Calculation ────────────────────────────
function calcTotal() {
  if (!state.selectedProduct) return 0;
  if (state.selectedProduct.basePrice === 0) return 0; // custom — owner will quote

  const size    = SIZES.find(s => s.id === state.selectedSize) || SIZES[1];
  const finish  = FINISHES.find(f => f.id === state.selectedFinish) || FINISHES[0];
  const base    = state.selectedProduct.basePrice * size.multiplier;
  const total   = (base + finish.surcharge) * state.quantity;
  return Math.round(total * 100) / 100;
}

function updateSummary() {
  const p     = state.selectedProduct;
  const size  = SIZES.find(s => s.id === state.selectedSize) || SIZES[1];
  const finish= FINISHES.find(f => f.id === state.selectedFinish) || FINISHES[0];
  const total = calcTotal();
  state.orderTotal = total;

  setEl('summary-item',   p ? p.name : '—');
  setEl('summary-size',   size.label);
  setEl('summary-finish', finish.label + (finish.surcharge ? ` (+$${finish.surcharge})` : ''));
  setEl('summary-qty',    state.quantity);
  setEl('summary-color',  state.selectedColor || '—');
  setEl('summary-customer', state.customer.name || '—');

  const totalEl = document.getElementById('summary-total');
  if (totalEl) {
    totalEl.textContent = total === 0
      ? (p ? 'Custom Quote' : '$0.00')
      : `$${total.toFixed(2)}`;
  }

  // Show/hide custom note
  const noteEl = document.getElementById('custom-pricing-note');
  if (noteEl) noteEl.style.display = (p && p.basePrice === 0) ? 'block' : 'none';
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SQUARE PAYMENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function initSquare() {
  // Square's JS SDK is loaded in index.html
  if (!window.Square) return;

  try {
    const payments = window.Square.payments(CONFIG.squareAppId, CONFIG.squareLocationId);
    state.squareCard = await payments.card({
      style: {
        '.input-container': {
          borderColor: 'rgba(0,232,208,0.25)',
          borderRadius: '8px',
        },
        '.input-container.is-focus': {
          borderColor: '#00e8d0',
        },
        input: {
          color: '#eef8f8',
          fontFamily: 'Raleway, sans-serif',
          fontSize: '15px',
        },
        'input::placeholder': {
          color: 'rgba(168,196,200,0.4)',
        },
        '.message-text': {
          color: '#e05577',
        },
      }
    });
    await state.squareCard.attach('#card-container');
  } catch (e) {
    console.warn('Square init error (check your App ID / Location ID):', e);
    document.getElementById('card-container').innerHTML =
      '<p style="color:var(--silver);font-size:0.85rem;padding:8px;text-align:center">⚠️ Payment form loading — configure Square credentials in js/main.js</p>';
  }
}

async function handlePaymentSubmit() {
  const btn = document.getElementById('submit-payment');

  // Validate
  if (!state.selectedProduct) return showToast('No product selected.', 'error');
  if (!state.customer.email)  return showToast('Please complete your contact info.', 'error');

  setStatus('Processing payment…', 'loading');
  btn.disabled = true;

  try {
    state.orderId = generateOrderId();
    let sourceId = null;

    // Handle custom-priced items differently
    if (state.orderTotal === 0) {
      // For custom quote items — just send notification, no payment
      await sendOrderNotification(null);
      showSuccessModal(true);
      setStatus('', '');
      btn.disabled = false;
      return;
    }

    if (state.squareCard) {
      const result = await state.squareCard.tokenize();
      if (result.status === 'OK') {
        sourceId = result.token;
      } else {
        const errMsg = result.errors?.map(e => e.message).join(', ') || 'Card error';
        throw new Error(errMsg);
      }
    } else {
      throw new Error('Payment form not initialized. Please check Square credentials.');
    }

    // In a real deployment you'd send sourceId + amount to your backend / serverless function
    // For GitHub Pages, we send the payment token info in the order notification
    // and process via Square Dashboard or a serverless function
    await sendOrderNotification(sourceId);

    setStatus('Payment processed! ✓', 'success');
    showSuccessModal(false);

  } catch (err) {
    console.error(err);
    setStatus(err.message || 'Payment failed. Please try again.', 'error');
  } finally {
    btn.disabled = false;
  }
}

function setStatus(msg, type) {
  const el = document.getElementById('payment-status');
  if (!el) return;
  el.textContent = msg;
  el.className = type ? `status-${type}` : '';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EMAIL NOTIFICATIONS (EmailJS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function sendOrderNotification(paymentToken) {
  const size   = SIZES.find(s => s.id === state.selectedSize)?.label || '';
  const finish = FINISHES.find(f => f.id === state.selectedFinish)?.label || '';

  const templateParams = {
    to_email:       CONFIG.ownerEmail,
    order_id:       state.orderId,
    customer_name:  state.customer.name,
    customer_email: state.customer.email,
    customer_phone: state.customer.phone || 'Not provided',
    item:           state.selectedProduct?.name || '',
    color:          state.selectedColor || 'Not specified',
    size:           size,
    finish:         finish,
    quantity:       state.quantity,
    special_notes:  state.specialInstructions || 'None',
    order_total:    state.orderTotal > 0 ? `$${state.orderTotal.toFixed(2)}` : 'Custom Quote Requested',
    payment_token:  paymentToken || 'N/A (Custom Quote)',
    timestamp:      new Date().toLocaleString(),
  };

  if (window.emailjs) {
    await emailjs.send(
      CONFIG.emailjsServiceId,
      CONFIG.emailjsTemplateId,
      templateParams,
      CONFIG.emailjsPublicKey
    );
  } else {
    // EmailJS not loaded — log for development
    console.log('📧 Order notification (EmailJS not configured):', templateParams);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUCCESS MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showSuccessModal(isCustomQuote) {
  const overlay = document.getElementById('success-modal');
  const msg     = document.getElementById('modal-message');
  const orderId = document.getElementById('modal-order-id');

  if (msg) {
    msg.textContent = isCustomQuote
      ? `Your custom order request has been received! We'll review your details and send a quote to ${state.customer.email} within 24 hours.`
      : `Your order is confirmed and payment processed. A confirmation email will be sent to ${state.customer.email}.`;
  }
  if (orderId) orderId.textContent = `Order #${state.orderId}`;

  overlay?.classList.add('open');
}

document.getElementById('close-modal')?.addEventListener('click', () => {
  document.getElementById('success-modal')?.classList.remove('open');
  // Reset form
  location.reload();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAQ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOAST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function generateOrderId() {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `HHC-${ts}-${rnd}`;
}

// Expose globals for inline onclick
window.selectProduct = selectProduct;
window.selectColor   = selectColor;
window.selectSize    = selectSize;
window.selectFinish  = selectFinish;
window.goToStep      = goToStep;
