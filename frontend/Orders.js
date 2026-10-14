const API = 'http://127.0.0.1:5000/api';

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

// === NAVBAR ===
function updateNavbar() {
  try {
    const user = JSON.parse(localStorage.getItem('icecup_user') || '{}');
    const loginBtn = document.getElementById('nav-login-btn');
    if (loginBtn && user && user.name) {
      loginBtn.textContent = `👤 ${user.name.split(' ')[0]}`;
      loginBtn.onclick = logout;
    }
  } catch (e) {}
}
function logout() {
  localStorage.removeItem('icecup_token');
  localStorage.removeItem('icecup_user');
  showNotification('👋 Logged out!');
  setTimeout(() => { window.location.href = 'login.html'; }, 1200);
}
updateNavbar();

// === NOTIFICATION ===
function showNotification(msg) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3000);
}

// === LOAD ORDERS ===
async function loadOrders() {
  const token = localStorage.getItem('icecup_token');

  if (!token) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('not-logged-in').style.display = 'block';
    return;
  }

  try {
    const res = await fetch(API + '/orders/my-orders', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await res.json();
    document.getElementById('loading').style.display = 'none';

    if (!res.ok) {
      document.getElementById('not-logged-in').style.display = 'block';
      return;
    }

    const orders = data.orders;

    if (!orders || orders.length === 0) {
      document.getElementById('no-orders').style.display = 'block';
      return;
    }

    // Stats
    const totalSpent = orders.reduce((s, o) => s + o.total, 0);
    const totalItems = orders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.qty, 0), 0);
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-spent').textContent = `₹${totalSpent}`;
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('orders-stats').style.display = 'grid';

    // Render orders — newest first
    const reversed = [...orders].reverse();
    const list = document.getElementById('orders-list');
    list.innerHTML = reversed.map(order => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-id">Order ID: <strong>#${order._id.slice(-6).toUpperCase()}</strong></div>
            <div class="order-date">📅 ${order.created_at}</div>
          </div>
          <span class="order-status">✅ ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>
        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item">
              <span class="order-item-emoji">${item.emoji}</span>
              <div class="order-item-info">
                <strong>${item.name}</strong>
                <span>Qty: ${item.qty}</span>
              </div>
              <span class="order-item-price">₹${item.price * item.qty}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-footer">
          <div class="order-total">Total: <span>₹${order.total}</span></div>
          <button class="btn-reorder" onclick="reorder(${JSON.stringify(order.items).replace(/"/g, '&quot;')})">🔁 Reorder</button>
        </div>
      </div>
    `).join('');

  } catch (err) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('no-orders').style.display = 'block';
    showNotification('❌ Cannot connect to server');
  }
}

// === REORDER ===
function reorder(items) {
  try {
    const parsed = typeof items === 'string' ? JSON.parse(items) : items;
    const cart = [];
    parsed.forEach(item => {
      cart.push({
        id: item.id,
        name: item.name,
        emoji: item.emoji,
        price: item.price,
        qty: item.qty
      });
    });
    localStorage.setItem('icecup_cart', JSON.stringify(cart));
    showNotification('🛒 Items added to cart!');
    setTimeout(() => { window.location.href = 'menu.html'; }, 1200);
  } catch (e) {
    showNotification('❌ Could not reorder');
  }
}

// === INIT ===
loadOrders();