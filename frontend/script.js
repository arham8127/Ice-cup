const API = 'http://127.0.0.1:5000/api';

// === NAVBAR USER STATE ===
function updateNavbar() {
  try {
    const user = JSON.parse(localStorage.getItem('icecup_user') || '{}');
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn && user && user.name) {
      loginBtn.textContent = `👤 ${user.name.split(' ')[0]}`;
      loginBtn.onclick = logout;
    }
  } catch (e) {}
}
function logout() {
  localStorage.removeItem('icecup_token');
  localStorage.removeItem('icecup_user');
  showNotification('👋 Logged out successfully!');
  setTimeout(() => { window.location.href = 'login.html'; }, 1200);
}
updateNavbar();

// === THEME ===
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('theme-btn');
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  btn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('icecup_theme', isDark ? 'light' : 'dark');
}
const savedTheme = localStorage.getItem('icecup_theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-btn').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// === SMOOTH SCROLL ===
function scrollTo(id) {
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
}

// === NOTIFICATION ===
function showNotification(msg) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3000);
}

// === LOGIN MODAL ===
function openLogin() { document.getElementById('login-modal').classList.add('open'); }
function closeLogin() { document.getElementById('login-modal').classList.remove('open'); }
document.getElementById('login-modal').addEventListener('click', function (e) {
  if (e.target === this) closeLogin();
});
function handleLogin() {
  closeLogin();
  showNotification('✅ Logged in successfully!');
}

// === CART ===
let cartOpen = false;

function getCart() {
  try { return JSON.parse(localStorage.getItem('icecup_cart') || '[]'); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('icecup_cart', JSON.stringify(cart));
}

function toggleCart() {
  cartOpen = !cartOpen;
  document.getElementById('cart-sidebar').classList.toggle('open', cartOpen);
  if (cartOpen) updateCart();
}

function updateCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  const badge = document.getElementById('cart-count');
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = totalQty;

  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><span>🍦</span>Your cart is empty.<br><a href="menu.html" style="color:var(--pink);font-weight:700;">Browse Menu →</a></div>`;
    footer.style.display = 'none';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `<div class="cart-item">
      <span class="cart-item-icon">${item.emoji}</span>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>₹${item.price} x ${item.qty} = ₹${item.price * item.qty}</span>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</button>
    </div>`;
  }).join('');

  document.getElementById('cart-total').textContent = `₹${total}`;
  footer.style.display = 'block';
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => String(i.id) !== String(id));
  saveCart(cart);
  updateCart();
  showNotification('🗑️ Item removed from cart');
}

updateCart();

// === EXPLORE FLAVORS ===
document.querySelector('.btn-primary').addEventListener('click', function () {
  window.location.href = 'menu.html';
});

// === NEWSLETTER ===
function handleSubscribe() {
  const email = document.getElementById('email-input').value;
  if (!email || !email.includes('@')) {
    showNotification('⚠️ Please enter a valid email!');
    return;
  }
  document.getElementById('email-input').value = '';
  showNotification('🎉 Subscribed! Welcome to the sweet community!');
}

// === NAV SCROLL ===
window.addEventListener('scroll', () => {
  const sections = ['home', 'stats', 'about', 'testimonials', 'cta', 'newsletter'];
  const links = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  links.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

// === POPUP ===
function togglePopup(id) {
  const all = ['map-popup', 'call-popup'];
  all.forEach(pid => {
    const el = document.getElementById(pid);
    if (pid === id) { el.classList.toggle('open'); }
    else { el.classList.remove('open'); }
  });
}
document.addEventListener('click', function (e) {
  if (!e.target.closest('.cta-btn-wrap')) {
    document.getElementById('map-popup').classList.remove('open');
    document.getElementById('call-popup').classList.remove('open');
  }
});

// === PLACE ORDER ===
async function placeOrder() {
  const token = localStorage.getItem('icecup_token');
  if (!token) {
    showNotification('⚠️ Please login first!');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showNotification('⚠️ Cart is empty!');
    return;
  }

  try {
    const res = await fetch(API + '/orders/place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ items: cart })
    });

    const data = await res.json();

    if (res.status === 201 || res.ok) {
      saveCart([]);
      updateCart();
      toggleCart();
      showNotification('🎉 Order placed successfully!');
    } else {
      showNotification('❌ ' + (data.error || 'Something went wrong'));
    }
  } catch (err) {
    showNotification('❌ Cannot connect to server');
  }
}