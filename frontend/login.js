const API = 'http://127.0.0.1:5000/api';

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

// ===== NOTIFICATION =====
function showNotification(msg) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3000);
}

// ===== TOGGLE PASSWORD =====
function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

// ===== PASSWORD STRENGTH =====
const passwordInput = document.getElementById('password');
if (passwordInput && document.getElementById('strength-bar')) {
  passwordInput.addEventListener('input', function () {
    const val = this.value;
    const bar = document.getElementById('strength-bar');
    const fill = document.getElementById('strength-fill');
    const label = document.getElementById('strength-label');
    if (!val) { bar.classList.remove('show'); label.classList.remove('show'); return; }
    bar.classList.add('show'); label.classList.add('show');
    let strength = 0;
    if (val.length >= 6) strength++;
    if (val.length >= 10) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    const levels = [
      { width: '20%', color: '#ff4444', text: 'Very Weak' },
      { width: '40%', color: '#ff6b35', text: 'Weak' },
      { width: '60%', color: '#ffc107', text: 'Fair' },
      { width: '80%', color: '#4caf50', text: 'Strong' },
      { width: '100%', color: '#06d6a0', text: 'Very Strong' },
    ];
    const level = levels[Math.min(strength - 1, 4)] || levels[0];
    fill.style.width = level.width;
    fill.style.background = level.color;
    label.textContent = level.text;
    label.style.color = level.color;
  });
}

// ===== LOGIN =====
async function handleLogin() {
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  let valid = true;

  ['email', 'password'].forEach(id => {
    document.getElementById(id).classList.remove('error');
    document.getElementById(`${id}-error`).classList.remove('show');
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    email.classList.add('error');
    document.getElementById('email-error').classList.add('show');
    valid = false;
  }
  if (!password.value || password.value.length < 6) {
    password.classList.add('error');
    document.getElementById('password-error').classList.add('show');
    valid = false;
  }
  if (!valid) return;

  const btn = document.querySelector('.btn-submit');
  const btnText = document.getElementById('login-btn-text');
  btn.disabled = true;
  btnText.textContent = 'Logging in... ⏳';

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('icecup_token', data.token);
      localStorage.setItem('icecup_user', JSON.stringify({ name: data.name, email: data.email }));
      showNotification('✅ Login successful! Redirecting...');
      setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    } else {
      showNotification(`❌ ${data.error}`);
      btn.disabled = false;
      btnText.textContent = 'Login →';
    }
  } catch (err) {
    showNotification('❌ Server error. Is Flask running?');
    btn.disabled = false;
    btnText.textContent = 'Login →';
  }
}

// ===== SIGNUP =====
async function handleSignup() {
  const fname = document.getElementById('fname');
  if (!fname) return;

  const lname = document.getElementById('lname');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm-password');
  const terms = document.getElementById('terms');
  let valid = true;

  ['fname','lname','email','phone','password'].forEach(id => {
    document.getElementById(id).classList.remove('error');
    document.getElementById(`${id}-error`).classList.remove('show');
  });
  document.getElementById('confirm-password').classList.remove('error');
  document.getElementById('confirm-error').classList.remove('show');
  document.getElementById('terms-error').classList.remove('show');

  if (!fname.value.trim()) { fname.classList.add('error'); document.getElementById('fname-error').classList.add('show'); valid = false; }
  if (!lname.value.trim()) { lname.classList.add('error'); document.getElementById('lname-error').classList.add('show'); valid = false; }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value)) { email.classList.add('error'); document.getElementById('email-error').classList.add('show'); valid = false; }
  if (!phone.value.trim() || phone.value.replace(/\D/g,'').length < 10) { phone.classList.add('error'); document.getElementById('phone-error').classList.add('show'); valid = false; }
  if (!password.value || password.value.length < 6) { password.classList.add('error'); document.getElementById('password-error').classList.add('show'); valid = false; }
  if (confirm.value !== password.value) { confirm.classList.add('error'); document.getElementById('confirm-error').classList.add('show'); valid = false; }
  if (!terms.checked) { document.getElementById('terms-error').classList.add('show'); valid = false; }
  if (!valid) return;

  const btn = document.querySelector('.btn-submit');
  const btnText = document.getElementById('signup-btn-text');
  btn.disabled = true;
  btnText.textContent = 'Creating account... ⏳';

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        phone: phone.value,
        password: password.value
      })
    });
    const data = await res.json();

    if (res.ok) {
      showNotification('🎉 Account created! Please login.');
      setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    } else {
      showNotification(`❌ ${data.error}`);
      btn.disabled = false;
      btnText.textContent = 'Create Account →';
    }
  } catch (err) {
    showNotification('❌ Server error. Is Flask running?');
    btn.disabled = false;
    btnText.textContent = 'Create Account →';
  }
}

// ===== GOOGLE =====
function handleGoogle() {
  showNotification('🌐 Google login coming soon!');
}

// ===== ENTER KEY =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    if (document.getElementById('login-btn-text')) handleLogin();
    else if (document.getElementById('signup-btn-text')) handleSignup();
  }
});