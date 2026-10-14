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

// === FLAVOR DATA ===
const flavors = [
  { id: 1, name: 'Classic Vanilla', emoji: '🍦', desc: 'Creamy, smooth, and timeless. Made with Madagascar vanilla beans.', price: 129, tags: ['classic', 'bestseller'], category: 'classic', badge: '', bg: '#fff8f0' },
  { id: 2, name: 'Strawberry Bliss', emoji: '🍓', desc: 'Fresh strawberries blended into every scoop. Pure summer joy.', price: 149, tags: ['fruity', 'fresh'], category: 'fruity', badge: 'hot', bg: '#fff0f4' },
  { id: 3, name: 'Chocolate Dream', emoji: '🍫', desc: 'Rich Belgian chocolate, dark and decadent.', price: 159, tags: ['chocolate', 'rich'], category: 'chocolate', badge: 'bestseller', bg: '#fff5f0' },
  { id: 4, name: 'Mango Magic', emoji: '🥭', desc: 'Alphonso mangoes straight from the farm. Tropical and refreshing.', price: 139, tags: ['fruity', 'seasonal'], category: 'fruity', badge: 'new', bg: '#fffbf0' },
  { id: 5, name: 'Mint Choco Chip', emoji: '🌿', desc: 'Cool mint with crunchy chocolate chips.', price: 149, tags: ['classic', 'cool'], category: 'classic', badge: '', bg: '#f0fff8' },
  { id: 6, name: 'Blueberry Swirl', emoji: '🫐', desc: 'Wild blueberries swirled into velvety cream.', price: 159, tags: ['fruity', 'healthy'], category: 'fruity', badge: 'new', bg: '#f5f0ff' },
  { id: 7, name: 'Dark Choco Fudge', emoji: '🍩', desc: 'Double chocolate fudge ripple. Intensely chocolatey.', price: 169, tags: ['chocolate', 'indulgent'], category: 'chocolate', badge: 'hot', bg: '#fff0ee' },
  { id: 8, name: 'Butterscotch Crunch', emoji: '🧈', desc: 'Golden butterscotch with caramel toffee bits.', price: 139, tags: ['classic', 'sweet'], category: 'classic', badge: '', bg: '#fffbf0' },
  { id: 9, name: 'Coconut Dream', emoji: '🥥', desc: 'Dairy-free coconut milk ice cream. Tropical and completely vegan.', price: 149, tags: ['vegan', 'fruity'], category: 'vegan', badge: '', bg: '#f5fff8' },
  { id: 10, name: 'Pistachio Royal', emoji: '🌰', desc: 'Premium pistachio with saffron swirl. A luxurious treat.', price: 179, tags: ['special', 'premium'], category: 'special', badge: '', bg: '#f8fff0' },
  { id: 11, name: 'Raspberry Sorbet', emoji: '🍷', desc: '100% fruit, zero dairy. Light, tangy, and completely vegan.', price: 129, tags: ['vegan', 'fruity', 'light'], category: 'vegan', badge: 'new', bg: '#fff0f8' },
  { id: 12, name: 'Choco Truffle', emoji: '🎂', desc: 'Handmade chocolate truffles mixed into silky cream.', price: 189, tags: ['chocolate', 'premium'], category: 'chocolate', badge: '', bg: '#fff2f0' },
  { id: 13, name: 'Rose Gulkand', emoji: '🌹', desc: 'Traditional rose petals with gulkand. A desi special.', price: 149, tags: ['special', 'indian'], category: 'special', badge: 'hot', bg: '#fff0f5' },
  { id: 14, name: 'Lemon Zest', emoji: '🍋', desc: 'Tangy lemon sorbet with real zest. Perfectly refreshing.', price: 129, tags: ['vegan', 'fruity', 'tangy'], category: 'vegan', badge: '', bg: '#fffef0' },
  { id: 15, name: 'Caramel Sundae', emoji: '🍮', desc: 'Warm caramel ribbons in vanilla cream.', price: 159, tags: ['classic', 'sweet'], category: 'classic', badge: '', bg: '#fff8f0' },
  { id: 16, name: 'Black Currant', emoji: '🍇', desc: 'Intense black currant with a creamy base. Bold and beautiful.', price: 149, tags: ['fruity', 'bold'], category: 'fruity', badge: 'new', bg: '#f8f0ff' },
];

let activeFilter = 'all';

// === RENDER CARDS ===
function renderCards(data) {
  const grid = document.getElementById('menu-grid');
  const noRes = document.getElementById('no-results');
  [...grid.querySelectorAll('.flavor-card')].forEach(c => c.remove());

  if (data.length === 0) {
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';

  data.forEach(f => {
    const card = document.createElement('div');
    card.className = 'flavor-card';
    card.dataset.category = f.category;

    const badgeHTML = f.badge
      ? `<span class="badge ${f.badge === 'new' ? 'new' : f.badge === 'hot' ? 'hot' : ''}">${f.badge === 'bestseller' ? '⭐ Best' : f.badge === 'new' ? '🆕 New' : '🔥 Hot'}</span>`
      : '';

    const tagsHTML = f.tags.map(t => `<span class="tag">${t}</span>`).join('');

    card.innerHTML = `
      ${badgeHTML}
      <div class="card-visual" style="background:${f.bg}">
        <span class="card-emoji">${f.emoji}</span>
      </div>
      <div class="card-body">
        <h3>${f.name}</h3>
        <p>${f.desc}</p>
        <div class="card-tags">${tagsHTML}</div>
        <div class="card-footer-row">
          <div class="price">₹${f.price} <span>/scoop</span></div>
          <button class="btn-add" id="btn-${f.id}" onclick="addToCart(${f.id})">+ Add</button>
        </div>
      </div>
    `;
    grid.insertBefore(card, document.getElementById('no-results'));
  });
}

function filterMenu() {
  const query = document.getElementById('search-input').value.toLowerCase();
  let filtered = flavors;
  if (activeFilter !== 'all') filtered = filtered.filter(f => f.category === activeFilter);
  if (query) filtered = filtered.filter(f =>
    f.name.toLowerCase().includes(query) ||
    f.desc.toLowerCase().includes(query) ||
    f.tags.some(t => t.includes(query))
  );
  renderCards(filtered);
}

function setFilter(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterMenu();
}

// === CART ===
function getCart() {
  try { return JSON.parse(localStorage.getItem('icecup_cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('icecup_cart', JSON.stringify(cart));
}

function addToCart(id) {
  const flavor = flavors.find(f => f.id === id);
  if (!flavor) return;
  const cart = getCart();
  const existing = cart.find(i => String(i.id) === String(id));
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: flavor.id, name: flavor.name, emoji: flavor.emoji, price: flavor.price, qty: 1 });
  }
  saveCart(cart);
  updateCartUI();
  showNotification(`🍦 ${flavor.name} added to cart!`);

  const btn = document.getElementById(`btn-${id}`);
  if (btn) {
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = '+ Add';
      btn.classList.remove('added');
    }, 1500);
  }
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => String(i.id) !== String(id));
  saveCart(cart);
  updateCartUI();
  showNotification('🗑️ Item removed');
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart(cart);
  updateCartUI();
}

let cartOpen = false;

function updateCartUI() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  document.getElementById('cart-count').textContent = totalQty;

  const list = document.getElementById('cart-items-list');
  const footer = document.getElementById('cart-footer-section');

  if (cart.length === 0) {
    list.innerHTML = `<div class="cart-empty"><span>🍦</span>Your cart is empty.<br>Add some sweet treats!</div>`;
    footer.style.display = 'none';
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-icon">${item.emoji}</span>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span class="cart-item-price">₹${item.price * item.qty}</span>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</button>
    </div>
  `).join('');

  document.getElementById('cart-count-info').textContent = `${totalQty} item${totalQty > 1 ? 's' : ''} in cart`;
  document.getElementById('cart-total-price').textContent = `₹${total}`;
  footer.style.display = 'block';
}

function toggleCart() {
  cartOpen = !cartOpen;
  document.getElementById('cart-sidebar').classList.toggle('open', cartOpen);
  document.getElementById('cart-overlay').classList.toggle('open', cartOpen);
}

// === CHECKOUT ===
async function checkout() {
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
      updateCartUI();
      toggleCart();
      showNotification('🎉 Order placed successfully!');
    } else {
      showNotification('❌ ' + (data.error || 'Something went wrong'));
    }
  } catch (err) {
    showNotification('❌ Cannot connect to server');
  }
}

// === INIT ===
renderCards(flavors);
updateCartUI();