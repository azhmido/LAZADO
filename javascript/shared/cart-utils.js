// ===================== KERANJANG (CART) =====================

const getCart = () => {
  const cartString = localStorage.getItem('lazadoCart');
  return cartString ? JSON.parse(cartString) : [];
};

const saveCart = (cart) => {
  localStorage.setItem('lazadoCart', JSON.stringify(cart));
  updateCartIconState();
};

const addToCart = (productToAdd) => {
  let cart = getCart();
  const existingProduct = cart.find(item => item.id === productToAdd.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    const newProductInCart = { ...productToAdd, quantity: 1 };
    cart.push(newProductInCart);
  }
  saveCart(cart);
};

const updateCartIconState = () => {
  const cartIcon = document.getElementById('cart-icon');
  if (!cartIcon) return;
  const cart = getCart();

  // Color state
  if (cart.length > 0) {
    cartIcon.classList.add('cart-active');
  } else {
    cartIcon.classList.remove('cart-active');
  }

  // Badge count
  const parent = cartIcon.parentElement;
  if (!parent) return;
  if (!parent.classList.contains('cart-link')) {
    parent.style.position = 'relative';
  }
  let badge = parent.querySelector('.cart-badge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      parent.appendChild(badge);
    }
    badge.textContent = totalItems > 99 ? '99+' : totalItems;
  } else {
    if (badge) badge.remove();
  }
};

// ===================== NOTIFIKASI =====================

const showNotification = (message, isError = false) => {
  const notification = document.createElement('div');
  notification.classList.add('custom-notification');
  if (isError) {
    notification.style.backgroundColor = '#dc3545';
  }
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
};

// ===================== LOADING SKELETON =====================

const showSkeleton = (container, count = 8) => {
  container.replaceChildren();
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text-short"></div>
      `;
    container.appendChild(skeleton);
  }
};

// ===================== KONFIRMASI DIALOG =====================

const showConfirmDialog = (message, onConfirm) => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const modal = document.createElement('div');
  modal.className = 'modal-content';
  modal.style.maxWidth = '350px';
  modal.innerHTML = `
    <p style="margin-bottom:20px;font-size:1.1rem;">${message}</p>
    <div style="display:flex;gap:10px;justify-content:center;">
      <button class="modal-button confirm-btn" id="confirm-yes">Ya, Hapus</button>
      <button class="modal-button cancel-btn" id="confirm-no">Batal</button>
    </div>
  `;
  modal.querySelector('#confirm-yes').onclick = () => {
    document.body.removeChild(overlay);
    onConfirm();
  };
  modal.querySelector('#confirm-no').onclick = () => {
    document.body.removeChild(overlay);
  };
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) document.body.removeChild(overlay);
  });
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
};

// ===================== VALIDASI =====================

const isValidPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

const isValidCreditCard = (number) => {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

const isValidExpiry = (exp) => {
  const match = exp.match(/^(\d{1,2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiry = new Date(year, month);
  return expiry > now;
};

const isValidCVV = (cvv) => /^\d{3,4}$/.test(cvv);

// ===================== SCROLL TO TOP =====================

document.addEventListener('DOMContentLoaded', () => {
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scroll-top-btn';
  scrollBtn.className = 'scroll-top-btn';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
  document.body.appendChild(scrollBtn);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 400) {
          scrollBtn.classList.add('visible');
        } else {
          scrollBtn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===================== NAV AUTH =====================
  const authSection = document.getElementById('auth-section');
  if (authSection) {
    const session = getSession();
    const isInHtmlDir = window.location.pathname.includes('/html/');
    const loginPath = isInHtmlDir ? 'login.html' : 'html/login.html';
    const orderPath = isInHtmlDir ? 'order.html' : 'html/order.html';
    if (session) {
      const firstName = session.name.split(' ')[0];
      authSection.innerHTML = `
        <a href="${orderPath}" class="nav-order-link">PESANAN</a>
        <span class="user-greeting">Hi, ${firstName}</span>
        <a href="#" id="logout-link" class="auth-logout">LOGOUT</a>
      `;
      document.getElementById('logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
        window.location.reload();
      });
    } else {
      authSection.innerHTML = `<a href="${loginPath}" class="auth-login">LOGIN</a>`;
    }
  }

  // ===================== PAGE TRANSITION =====================
  requestAnimationFrame(() => {
    document.body.classList.add('page-loaded');
  });
});

// ===================== AUTH =====================

const getUsers = () => JSON.parse(localStorage.getItem('lazadoUsers') || '[]');
const saveUsers = (users) => localStorage.setItem('lazadoUsers', JSON.stringify(users));

const registerUser = ({ name, email, username, password }) => {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { success: false, message: 'Email sudah terdaftar!' };
  if (users.find(u => u.username === username)) return { success: false, message: 'Username sudah digunakan!' };
  users.push({ name, email, username, password });
  saveUsers(users);
  return { success: true };
};

const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, message: 'Email atau password salah!' };
  localStorage.setItem('lazadoSession', JSON.stringify({ name: user.name, email: user.email, username: user.username }));
  return { success: true };
};

const logoutUser = () => localStorage.removeItem('lazadoSession');

const getSession = () => {
  const s = localStorage.getItem('lazadoSession');
  return s ? JSON.parse(s) : null;
};

const isLoggedIn = () => getSession() !== null;

// ===================== SORT & FILTER =====================

const sortProducts = (products, sortBy) => {
  if (!sortBy) return products;
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc': return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
    case 'name-asc': return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default: return sorted;
  }
};

const filterByPrice = (products, min, max) => {
  return products.filter(p => {
    if (min > 0 && p.price < min) return false;
    if (max > 0 && p.price > max) return false;
    return true;
  });
};

const createFilterBar = (onChange) => {
  const bar = document.createElement('div');
  bar.className = 'filter-bar';
  bar.innerHTML = `
    <div class="filter-group">
      <label class="filter-label">Urutkan</label>
      <select id="sort-select" class="filter-select">
        <option value="">Default</option>
        <option value="price-asc">Harga: Rendah ke Tinggi</option>
        <option value="price-desc">Harga: Tinggi ke Rendah</option>
        <option value="rating-desc">Rating: Tertinggi</option>
        <option value="name-asc">Nama: A-Z</option>
      </select>
    </div>
    <div class="filter-group price-filter-group">
      <label class="filter-label">Harga</label>
      <div class="price-filter">
        <input type="number" id="price-min" class="filter-input" placeholder="Min" min="0" step="0.01">
        <span class="price-separator">-</span>
        <input type="number" id="price-max" class="filter-input" placeholder="Max" min="0" step="0.01">
      </div>
    </div>
    <button id="filter-reset" class="filter-reset-btn">Reset</button>
  `;

  const triggerChange = () => {
    onChange({
      sortBy: bar.querySelector('#sort-select').value,
      priceMin: parseFloat(bar.querySelector('#price-min').value) || 0,
      priceMax: parseFloat(bar.querySelector('#price-max').value) || 0,
    });
  };

  bar.querySelector('#sort-select').addEventListener('change', triggerChange);
  bar.querySelector('#price-min').addEventListener('input', triggerChange);
  bar.querySelector('#price-max').addEventListener('input', triggerChange);
  bar.querySelector('#filter-reset').addEventListener('click', () => {
    bar.querySelector('#sort-select').value = '';
    bar.querySelector('#price-min').value = '';
    bar.querySelector('#price-max').value = '';
    triggerChange();
  });

  return bar;
};

const applyFilters = (products, searchTerm = '', filterState = {}) => {
  let result = products;
  if (searchTerm) {
    result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  result = filterByPrice(result, filterState.priceMin || 0, filterState.priceMax || 0);
  result = sortProducts(result, filterState.sortBy || '');
  return result;
};

// ===================== ORDER MANAGEMENT =====================

const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV-${timestamp}-${random}`;
};

const saveOrder = (orderData) => {
  const orders = getOrders();
  orders.unshift(orderData);
  localStorage.setItem('lazadoOrders', JSON.stringify(orders));
};

const getOrders = () => {
  const data = localStorage.getItem('lazadoOrders');
  return data ? JSON.parse(data) : [];
};

// ===================== LOADING OVERLAY =====================

const showLoading = (message = 'Memproses...') => {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <p class="loading-text">${message}</p>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
  } else {
    overlay.querySelector('.loading-text').textContent = message;
    overlay.classList.add('active');
  }
};

const hideLoading = () => {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 300);
  }
};

// ===================== INVOICE MODAL =====================

const showInvoice = (order, onClose) => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const modal = document.createElement('div');
  modal.className = 'modal-content invoice-modal';
  modal.innerHTML = `
    <div class="invoice-header">
      <h2>🧾 Invoice</h2>
      <p class="invoice-id">${order.id}</p>
      <p class="invoice-date">${new Date(order.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    </div>
    <div class="invoice-body">
      <div class="invoice-section">
        <h4>Detail Pengiriman</h4>
        <p><strong>Penerima:</strong> ${order.name}</p>
        <p><strong>Telepon:</strong> ${order.phone}</p>
        <p><strong>Alamat:</strong> ${order.address}</p>
        <p><strong>Pembayaran:</strong> ${order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
        <p><strong>Status:</strong> <span class="invoice-status">${order.status}</span></p>
      </div>
      <div class="invoice-section">
        <h4>Item Pesanan</h4>
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Produk</th>
              <th>Qty</th>
              <th>Harga</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="invoice-totals">
        <div class="invoice-total-row"><span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
        <div class="invoice-total-row"><span>Ongkos Kirim</span><span>$${order.shipping.toFixed(2)}</span></div>
        <div class="invoice-total-row invoice-grand-total"><span>Total</span><span>$${order.total.toFixed(2)}</span></div>
      </div>
    </div>
    <div class="invoice-actions">
      <button class="modal-button confirm-btn" id="invoice-close">Tutup</button>
      <button class="modal-button cancel-btn" id="invoice-print">🖨 Print</button>
    </div>
  `;
  const closeModal = () => {
    document.body.removeChild(overlay);
    if (onClose) onClose();
  };
  modal.querySelector('#invoice-close').onclick = closeModal;
  modal.querySelector('#invoice-print').onclick = () => window.print();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
};
