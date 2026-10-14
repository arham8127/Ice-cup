// ===== THEME =====
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

// ===== CART COUNT =====
function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('icecup_cart') || '[]');
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cart-count').textContent = total;
  } catch { }
}
updateCartCount();

// ===== NOTIFICATION =====
function showNotification(msg) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3000);
}

// ===== LOGIN MODAL =====
function openLogin() { document.getElementById('login-modal').classList.add('open'); }
function closeLogin() { document.getElementById('login-modal').classList.remove('open'); }
document.getElementById('login-modal').addEventListener('click', function(e) {
  if (e.target === this) closeLogin();
});
function handleLogin() {
  closeLogin();
  showNotification('✅ Logged in successfully!');
}

// ===== FORM VALIDATION & SUBMIT =====
function handleSubmit() {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');

  let valid = true;

  // Reset errors
  ['name', 'email', 'message'].forEach(id => {
    document.getElementById(id).classList.remove('error');
    document.getElementById(`${id}-error`).classList.remove('show');
  });

  // Validate name
  if (!name.value.trim()) {
    name.classList.add('error');
    document.getElementById('name-error').classList.add('show');
    valid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    email.classList.add('error');
    document.getElementById('email-error').classList.add('show');
    valid = false;
  }

  // Validate message
  if (!message.value.trim() || message.value.trim().length < 10) {
    message.classList.add('error');
    document.getElementById('message-error').textContent = message.value.trim().length === 0
      ? 'Please enter a message'
      : 'Message must be at least 10 characters';
    document.getElementById('message-error').classList.add('show');
    valid = false;
  }

  if (!valid) return;

  // Simulate sending
  const btn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  btn.disabled = true;
  btnText.textContent = 'Sending... ⏳';

  setTimeout(() => {
    btn.disabled = false;
    btnText.textContent = 'Send Message 🚀';
    name.value = '';
    email.value = '';
    message.value = '';
    document.getElementById('success-msg').classList.add('show');
    showNotification('🎉 Message sent successfully!');
    setTimeout(() => {
      document.getElementById('success-msg').classList.remove('show');
    }, 5000);
  }, 1500);
}

// Submit on Enter in inputs (not textarea)
document.getElementById('name').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('email').focus();
});
document.getElementById('email').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('message').focus();
});
