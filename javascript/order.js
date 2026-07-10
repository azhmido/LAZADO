document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('order-container');
    if (!container) return;

    const orders = getOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="order-empty">
                <span class="material-symbols-outlined" style="font-size:3rem;color:var(--text-color-light);">receipt_long</span>
                <p>Belum ada pesanan. Ayo belanja dulu!</p>
                <a href="product.html" class="buy-button" style="display:inline-block;margin-top:1rem;text-decoration:none;">Mulai Belanja</a>
            </div>
        `;
    } else {
        const list = document.createElement('div');
        list.className = 'order-list';

        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';

            const header = document.createElement('div');
            header.className = 'order-card-header';
            header.innerHTML = `
                <div>
                    <span class="order-id">${order.id}</span>
                    <span class="order-date">${new Date(order.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
            `;

            const body = document.createElement('div');
            body.className = 'order-card-body';
            body.innerHTML = `
                <div class="order-items-preview">
                    ${order.items.slice(0, 3).map(item => `
                        <div class="order-item-preview">
                            <img src="${item.image}" alt="${item.title}" />
                            <span>${item.title.length > 25 ? item.title.substring(0, 25) + '...' : item.title} x${item.quantity}</span>
                        </div>
                    `).join('')}
                    ${order.items.length > 3 ? `<div class="order-more-items">+${order.items.length - 3} item lainnya</div>` : ''}
                </div>
                <div class="order-card-total">
                    <span>Total</span>
                    <strong>$${order.total.toFixed(2)}</strong>
                </div>
            `;

            const footer = document.createElement('div');
            footer.className = 'order-card-footer';
            const detailBtn = document.createElement('button');
            detailBtn.className = 'modal-button confirm-btn';
            detailBtn.textContent = 'Lihat Detail';
            detailBtn.onclick = () => showInvoice(order);
            footer.appendChild(detailBtn);

            card.append(header, body, footer);
            list.appendChild(card);
        });

        container.replaceChildren(list);
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeKey = 'theme-preference';
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem(themeKey, body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
        });
    }

    // Hamburger
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('header-nav');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });
    }
});
