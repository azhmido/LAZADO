document.addEventListener('DOMContentLoaded', () => {

    // Proteksi halaman: redirect ke login jika belum login
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // variabel utama untuk elemen keranjang dan ongkir
    const cartContentContainer = document.getElementById('cart-content-container');
    const shippingCost = 5.00;

    // ngapus item dari keranjang berdasarkan ID produk
    const removeItemFromCart = (productId) => {
        const cart = getCart();
        const item = cart.find(item => item.id === productId);
        const itemName = item ? item.title : 'Item ini';
        showConfirmDialog(`Hapus "${itemName}" dari keranjang?`, () => {
            let cart = getCart();
            const newCart = cart.filter(item => item.id !== productId);
            saveCart(newCart);
            renderCart();
        });
    };

    // ngubah jumlah item di keranjang
    const updateItemQuantity = (productId, newQuantity) => {
        // jika kuantitas kurang dari 1, hapus item dari keranjang
        if (newQuantity < 1) {
            removeItemFromCart(productId);
            return;
        }
        let cart = getCart();
        const newCart = cart.map(item => {
            if (item.id === productId) {
                item.quantity = newQuantity;
            }
            return item;
        });
        saveCart(newCart);
        renderCart(); // nampilin ulang keranjang setelah kuantitas diubah
    };

    // ngitung dan menampilkan subtotal dan total pada ringkasan pesanan
    const updateSummary = () => {
        const summarySubtotalEl = document.getElementById('summary-subtotal');
        const summaryTotalEl = document.getElementById('summary-total');
        if (!summarySubtotalEl || !summaryTotalEl) return;

        const cart = getCart();
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const total = subtotal + shippingCost;

        summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        summaryTotalEl.textContent = `$${total.toFixed(2)}`;
    };

    // untuk membuat satu baris di ringkasan pesanan
    const createSummaryLine = (labelText, valueOrId, isId = false) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'summary-line';
        const labelSpan = document.createElement('span');
        labelSpan.textContent = labelText;
        const valueSpan = document.createElement('span');
        if (isId) {
            valueSpan.id = valueOrId;
        } else {
            valueSpan.textContent = valueOrId;
        }
        lineDiv.append(labelSpan, valueSpan);
        return lineDiv;
    };

    // ==========================================
    // PROSES CHECKOUT TERSTRUKTUR & KOMPLEKS
    // ==========================================
    const handleCheckout = () => {
        const cart = getCart();
        if (cart.length === 0) {
            showNotification('Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.', true);
            return;
        }

        // State untuk menyimpan data pesanan (Multi-step)
        let orderData = {
            name: '',
            phone: '',
            address: '',
            paymentMethod: 'bank_transfer',
            paymentDetails: {}
        };

        // buat elemen dasar untuk modal (popup)
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content checkout-modal';

        // Helper untuk membuat input
        const createInputField = (id, labelText, type = 'text', placeholder = '', value = '') => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'form-field';
            fieldWrapper.style.marginBottom = '15px';
            const label = document.createElement('label');
            label.htmlFor = id;
            label.textContent = labelText;
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            const input = document.createElement('input');
            input.type = type;
            input.id = id;
            input.placeholder = placeholder;
            input.value = value;
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.boxSizing = 'border-box';
            fieldWrapper.append(label, input);
            return { wrapper: fieldWrapper, input: input };
        };

        // Helper untuk navigasi tombol modal
        const createModalActions = (backText, backAction, nextText, nextAction) => {
            const actions = document.createElement('div');
            actions.className = 'modal-actions';
            actions.style.marginTop = '20px';
            actions.style.display = 'flex';
            actions.style.justifyContent = 'space-between';

            const backBtn = document.createElement('button');
            backBtn.className = 'modal-button cancel-btn';
            backBtn.textContent = backText;
            backBtn.onclick = backAction;

            const nextBtn = document.createElement('button');
            nextBtn.className = 'modal-button confirm-btn';
            nextBtn.textContent = nextText;
            nextBtn.onclick = nextAction;

            actions.append(backBtn, nextBtn);
            return actions;
        };

        // --- LANGKAH 1: DETAIL PENGIRIMAN ---
        const renderShippingStep = () => {
            modalContent.replaceChildren();

            const title = document.createElement('h3');
            title.textContent = 'Langkah 1/3: Detail Pengiriman';

            const form = document.createElement('div');
            const { wrapper: nameWrapper, input: nameInput } = createInputField('ship-name', 'Nama Penerima', 'text', 'Masukkan nama lengkap', orderData.name);
            const { wrapper: phoneWrapper, input: phoneInput } = createInputField('ship-phone', 'Nomor Telepon', 'tel', 'Contoh: 081234567890', orderData.phone);
            const { wrapper: addressWrapper, input: addressInput } = createInputField('ship-address', 'Alamat Lengkap', 'text', 'Jalan, RT/RW, Kota, Kode Pos', orderData.address);

            form.append(nameWrapper, phoneWrapper, addressWrapper);

            const actions = createModalActions('Batal', () => document.body.removeChild(modalOverlay), 'Lanjut ke Pembayaran', () => {
                if (!nameInput.value || !phoneInput.value || !addressInput.value) {
                    showNotification('Harap lengkapi semua data pengiriman!', true);
                    return;
                }
                if (!isValidPhone(phoneInput.value)) {
                    showNotification('Nomor telepon tidak valid! Minimal 10 digit.', true);
                    return;
                }
                if (nameInput.value.trim().length < 3) {
                    showNotification('Nama penerima minimal 3 karakter!', true);
                    return;
                }
                // Simpan state
                orderData.name = nameInput.value;
                orderData.phone = phoneInput.value;
                orderData.address = addressInput.value;
                renderPaymentStep();
            });

            modalContent.append(title, form, actions);
        };

        // --- LANGKAH 2: METODE PEMBAYARAN ---
        const renderPaymentStep = () => {
            modalContent.replaceChildren();

            const title = document.createElement('h3');
            title.textContent = 'Langkah 2/3: Metode Pembayaran';

            const paymentSelect = document.createElement('select');
            paymentSelect.style.width = '100%';
            paymentSelect.style.padding = '8px';
            paymentSelect.style.marginBottom = '15px';

            const options = [
                { value: 'bank_transfer', text: 'Transfer Bank (Virtual Account)' },
                { value: 'e-wallet', text: 'E-Wallet (OVO, GoPay, Dana)' },
                { value: 'credit_card', text: 'Kartu Kredit / Debit' },
                { value: 'cod', text: 'Cash on Delivery (COD)' }
            ];

            options.forEach(opt => {
                const optionEl = document.createElement('option');
                optionEl.value = opt.value;
                optionEl.textContent = opt.text;
                if (orderData.paymentMethod === opt.value) optionEl.selected = true;
                paymentSelect.appendChild(optionEl);
            });

            // Container dinamis untuk input detail pembayaran
            const dynamicDetails = document.createElement('div');
            
            const updateDynamicDetails = () => {
                dynamicDetails.replaceChildren();
                orderData.paymentMethod = paymentSelect.value;

                if (paymentSelect.value === 'credit_card') {
                    const { wrapper: ccWrapper, input: ccInput } = createInputField('cc-number', 'Nomor Kartu', 'text', '16 Digit Nomor Kartu');
                    const { wrapper: expWrapper, input: expInput } = createInputField('cc-exp', 'Masa Berlaku (MM/YY)', 'text', '12/26');
                    const { wrapper: cvvWrapper, input: cvvInput } = createInputField('cc-cvv', 'CVV', 'text', '123');
                    dynamicDetails.append(ccWrapper, expWrapper, cvvWrapper);
                    
                    // Simpan referensi input ke object agar mudah dicek saat lanjut
                    orderData.paymentDetails = { ccInput, expInput, cvvInput };
                } else if (paymentSelect.value === 'e-wallet') {
                    const { wrapper: ewalletWrapper, input: ewalletInput } = createInputField('ewallet-number', 'Nomor Handphone E-Wallet', 'tel', '081234567890');
                    dynamicDetails.append(ewalletWrapper);
                    orderData.paymentDetails = { ewalletInput };
                } else if (paymentSelect.value === 'bank_transfer') {
                    const bankText = document.createElement('p');
                    bankText.textContent = 'Nomor Virtual Account akan diberikan pada langkah konfirmasi.';
                    bankText.style.fontSize = '14px';
                    bankText.style.color = '#555';
                    dynamicDetails.appendChild(bankText);
                    orderData.paymentDetails = {};
                }
            };

            paymentSelect.addEventListener('change', updateDynamicDetails);
            updateDynamicDetails(); // Trigger pertama kali

            const actions = createModalActions('Kembali', renderShippingStep, 'Tinjau Pesanan', () => {
                // Validasi dinamis
                if (orderData.paymentMethod === 'credit_card') {
                    if (!orderData.paymentDetails.ccInput.value || !orderData.paymentDetails.expInput.value || !orderData.paymentDetails.cvvInput.value) {
                        showNotification('Harap lengkapi informasi Kartu Kredit!', true);
                        return;
                    }
                    if (!isValidCreditCard(orderData.paymentDetails.ccInput.value)) {
                        showNotification('Nomor kartu kredit tidak valid!', true);
                        return;
                    }
                    if (!isValidExpiry(orderData.paymentDetails.expInput.value)) {
                        showNotification('Masa berlaku kartu tidak valid atau sudah kedaluwarsa!', true);
                        return;
                    }
                    if (!isValidCVV(orderData.paymentDetails.cvvInput.value)) {
                        showNotification('CVV harus 3 atau 4 digit angka!', true);
                        return;
                    }
                } else if (orderData.paymentMethod === 'e-wallet') {
                    if (!orderData.paymentDetails.ewalletInput.value) {
                        showNotification('Harap masukkan nomor E-Wallet!', true);
                        return;
                    }
                    if (!isValidPhone(orderData.paymentDetails.ewalletInput.value)) {
                        showNotification('Nomor E-Wallet tidak valid! Minimal 10 digit.', true);
                        return;
                    }
                }
                renderConfirmationStep();
            });

            modalContent.append(title, paymentSelect, dynamicDetails, actions);
        };

        // --- LANGKAH 3: KONFIRMASI & PEMBAYARAN AKHIR ---
        const renderConfirmationStep = () => {
            modalContent.replaceChildren();

            const title = document.createElement('h3');
            title.textContent = 'Langkah 3/3: Konfirmasi Pesanan';

            const summary = document.createElement('div');
            summary.style.background = '#f9f9f9';
            summary.style.padding = '15px';
            summary.style.borderRadius = '5px';
            summary.style.marginBottom = '20px';
            summary.style.fontSize = '14px';
            
            // Hitung Ulang Total
            const cartItems = getCart();
            const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            const totalStr = `$${(subtotal + shippingCost).toFixed(2)}`;

            summary.innerHTML = `
                <p><strong>Penerima:</strong> ${orderData.name} (${orderData.phone})</p>
                <p><strong>Alamat:</strong> ${orderData.address}</p>
                <p><strong>Metode Pembayaran:</strong> ${orderData.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ccc;">
                <h4 style="margin:0; display:flex; justify-content:space-between;">
                    <span>Total Tagihan:</span>
                    <span style="color: #28a745;">${totalStr}</span>
                </h4>
            `;

            const actions = createModalActions('Kembali', renderPaymentStep, 'Bayar Sekarang', () => {
                showLoading('Memproses pembayaran...');
                
                setTimeout(() => {
                    hideLoading();
                    const cartItems = getCart();
                    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
                    const total = subtotal + shippingCost;
                    const order = {
                        id: generateOrderId(),
                        date: new Date().toISOString(),
                        items: [...cartItems],
                        subtotal,
                        shipping: shippingCost,
                        total,
                        name: orderData.name,
                        phone: orderData.phone,
                        address: orderData.address,
                        paymentMethod: orderData.paymentMethod,
                        status: 'Lunas'
                    };
                    saveOrder(order);
                    saveCart([]);
                    document.body.removeChild(modalOverlay);
                    showInvoice(order, renderCart);
                }, 1500);
            });

            modalContent.append(title, summary, actions);
        };

        // Mulai dari langkah pertama
        renderShippingStep();
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    };
    // ==========================================

    // nampilin seluruh isi keranjang belanja di halaman
    const renderCart = () => {
        // jalankan jika elemen kontainer keranjang ada di halaman
        if (!cartContentContainer) return;

        const cart = getCart();
        cartContentContainer.replaceChildren(); // ngosongin kontainer sebelum menampilkan yang baru

        // jika keranjang kosong, tampilkan pesan
        if (cart.length === 0) {
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'cart-items';
            const emptyCartDiv = document.createElement('div');
            emptyCartDiv.className = 'cart-empty';
            const p = document.createElement('p');
            p.textContent = 'Keranjang Anda masih kosong.';
            emptyCartDiv.append(p);
            itemsContainer.appendChild(emptyCartDiv);
            cartContentContainer.appendChild(itemsContainer);
        } else {
            // jika ada item, tampilkan semua item dan ringkasan pesanan
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'cart-items';
            
            // loop untuk setiap item di keranjang untuk menampilkannya
            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                // untuk buat elemen gambar, detail, harga, kuantitas, dll
                const image = document.createElement('img');
                image.src = item.image;
                image.className = 'cart-item-image';
                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'cart-item-details';
                const title = document.createElement('h3');
                title.className = 'cart-item-title';
                title.textContent = item.title;
                const price = document.createElement('p');
                price.className = 'cart-item-price';
                price.textContent = `$${item.price.toFixed(2)}`;
                detailsDiv.append(title, price);
                const quantityDiv = document.createElement('div');
                quantityDiv.className = 'cart-item-quantity';
                const minusBtn = document.createElement('button');
                minusBtn.className = 'quantity-btn';
                minusBtn.textContent = '-';
                minusBtn.onclick = () => updateItemQuantity(item.id, item.quantity - 1);
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.value = item.quantity;
                quantityInput.min = '1';
                quantityInput.className = 'quantity-input';
                quantityInput.onchange = (e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1);
                const plusBtn = document.createElement('button');
                plusBtn.className = 'quantity-btn';
                plusBtn.textContent = '+';
                plusBtn.onclick = () => updateItemQuantity(item.id, item.quantity + 1);
                quantityDiv.append(minusBtn, quantityInput, plusBtn);
                detailsDiv.appendChild(quantityDiv);
                const removeBtn = document.createElement('button');
                removeBtn.className = 'cart-item-remove';
                removeBtn.onclick = () => removeItemFromCart(item.id);
                const removeIcon = document.createElement('span');
                removeIcon.className = 'material-symbols-outlined';
                removeIcon.textContent = 'delete';
                removeBtn.appendChild(removeIcon);
                itemDiv.append(image, detailsDiv, removeBtn);
                itemsContainer.appendChild(itemDiv);
            });

            // buat bagian ringkasan pesanan (subtotal, total, tombol checkout)
            const summaryContainer = document.createElement('div');
            summaryContainer.className = 'cart-summary';
            const summaryTitle = document.createElement('h3');
            summaryTitle.textContent = 'Ringkasan Pesanan';
            const subtotalLine = createSummaryLine('Subtotal', 'summary-subtotal', true);
            const shippingLine = createSummaryLine('Ongkos Kirim', `$${shippingCost.toFixed(2)}`);
            const totalLine = document.createElement('div');
            totalLine.className = 'summary-total';
            const totalLabel = document.createElement('span');
            totalLabel.textContent = 'Total';
            const totalValue = document.createElement('span');
            totalValue.id = 'summary-total';
            totalLine.append(totalLabel, totalValue);
            const checkoutBtn = document.createElement('button');
            checkoutBtn.className = 'buy-button checkout-btn';
            checkoutBtn.textContent = 'Lanjut ke Pembayaran';
            checkoutBtn.onclick = handleCheckout;
            summaryContainer.append(summaryTitle, subtotalLine, shippingLine, totalLine, checkoutBtn);
            
            cartContentContainer.append(itemsContainer, summaryContainer);
        }
        // update angka subtotal dan total setelah menampilkan keranjang
        updateSummary();
    };

    // manggil fungsi utama untuk menampilkan keranjang dan status ikon saat halaman pertama kali dimuat
    renderCart();
    updateCartIconState();

    // inisialisasi variabel untuk tombol tema, body, dan kunci localStorage
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeKey = 'theme-preference';

    // pas halaman dimuat, meriksa tema yang tersimpan dan terapkan jika ada
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
    }

    // nambahk event listener saat tombol tema diklik
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // ngubah (menambah/menghapus) kelas dark-mode pada body
            body.classList.toggle('dark-mode');
            // nyimpan preferensi tema ke localStorage.
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem(themeKey, 'dark-mode');
            } else {
                localStorage.setItem(themeKey, 'light-mode');
            }
        });
    }
    // variabel untuk tombol hamburger dan menu navigasi.
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('header-nav');

    // jika kedua elemen ada sebelum menambahkan event listener.
    if (hamburgerBtn && navMenu) {
        // event listener saat tombol hamburger diklik.
        hamburgerBtn.addEventListener('click', () => {
            // nampilin/nyembunyikan menu dan mengubah tampilan tombol
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });
    }
});