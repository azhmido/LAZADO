document.addEventListener('DOMContentLoaded', () => {

    //variabel untuk semua fungsi
    const productContainer = document.getElementById('product-container');
    const searchInput = document.getElementById('search-input');
    const themeToggle = document.getElementById('theme-toggle');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('header-nav');
    const body = document.body;
    
    //untuk menyimpan semua produk dari API
    let allProducts = [];

    //fungsi untuk menampilkan produk ke layar
    const displayProducts = (productsToDisplay) => {
        productContainer.replaceChildren(); 

        productsToDisplay.forEach((product) => {
            const card = document.createElement('div');
            card.classList.add('product');

            const productImage = document.createElement('img');
            productImage.src = product.image;
            productImage.alt = product.title;

            const productTitle = document.createElement('h3');
            productTitle.textContent = product.title;

            const productPrice = document.createElement('p');
            productPrice.textContent = `$${product.price.toFixed(2)}`;

            const productDescription = document.createElement('p');
            productDescription.classList.add('product-description');
            productDescription.textContent = product.description;

            const productCategory = document.createElement('p');
            productCategory.classList.add('product-category');
            productCategory.textContent = `Category: ${product.category}`;

            const productRating = document.createElement('p');
            productRating.classList.add('product-rating');
            productRating.textContent = `Rating: ${product.rating.rate} / 5 (${product.rating.count} reviews)`;

            const buyButton = document.createElement('button');
            buyButton.classList.add('buy-button');
            buyButton.textContent = 'Add to Cart';

            buyButton.addEventListener('click', () => {
                if (isLoggedIn()) {
                    addToCart(product);
                    showNotification(`"${product.title}" telah ditambahkan ke keranjang!`);
                } else {
                    showNotification('Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang!');
                }
            });

            const detailButton = document.createElement('button');
            detailButton.classList.add('detail-button');
            detailButton.textContent = 'Lihat Detail';
            detailButton.addEventListener('click', () => {
                window.location.href = `html/product.html?id=${product.id}`;
            });

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'product-buttons';
            buttonsDiv.append(detailButton, buyButton);

            card.append(productImage, productTitle, productPrice, productDescription, productCategory, productRating, buttonsDiv);
            productContainer.appendChild(card);
        });
    };
    
    //gambil data produk dari API
    if (productContainer) {
        showSkeleton(productContainer, 8);
        fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((products) => {
            //nyimpan semua produk ke variabel allProducts
            allProducts = products;
            
            initFilters();

            //nampilin semua produk saat pertama kali halaman dimuat
            displayProducts(allProducts);

            //event listener untuk fungsi pencarian
            if (searchInput) {
                searchInput.addEventListener('input', renderFiltered);
            }
        })
        .catch((error) => {
            console.error('Error saat mengambil data produk:', error);
            if (productContainer) {
                productContainer.textContent = 'Gagal memuat produk. Silakan coba lagi nanti.';
            }
        });
    }

    const renderFiltered = () => {
        const term = searchInput ? searchInput.value : '';
        const bar = document.querySelector('.filter-bar');
        const state = bar ? {
            sortBy: bar.querySelector('#sort-select').value,
            priceMin: parseFloat(bar.querySelector('#price-min').value) || 0,
            priceMax: parseFloat(bar.querySelector('#price-max').value) || 0,
        } : {};
        const filtered = applyFilters(allProducts, term, state);
        displayProducts(filtered);
    };

    const initFilters = () => {
        if (productContainer && productContainer.parentElement) {
            const filterBar = createFilterBar(renderFiltered);
            productContainer.parentElement.insertBefore(filterBar, productContainer);
        }
    };

    //tama dark mode
    const themeKey = 'theme-preference';
    const savedTheme = localStorage.getItem(themeKey);

    //nerapin tema yang tersimpan saat halaman di buka
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
    }

    //untuk tombol ganti tema
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        //nyimpan preferensi tema ke localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem(themeKey, 'dark-mode');
        } else {
            localStorage.setItem(themeKey, 'light-mode');
        }
    });

    //menu hamburger
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            //toggle class 'active' pada menu navigasi dan tombol hamburger
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });
    }
});