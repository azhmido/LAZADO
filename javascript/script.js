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
                alert('Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang!');
            });

            card.append(productImage, productTitle, productPrice, productDescription, productCategory, productRating, buyButton);
            productContainer.appendChild(card);
        });
    };
    
    //gambil data produk dari API
    fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((products) => {
            //nyimpan semua produk ke variabel allProducts
            allProducts = products;
            
            //nampilin semua produk saat pertama kali halaman dimuat
            displayProducts(allProducts);

            //event listener untuk fungsi pencarian
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();

                //filter produk berdasarkan judul
                const filteredProducts = allProducts.filter(product => {
                    return product.title.toLowerCase().includes(searchTerm);
                });

                //nampilin produk yang sudah difilter
                displayProducts(filteredProducts);
            });
        })
        .catch((error) => {
            console.error('Error saat mengambil data produk:', error);
            productContainer.textContent = 'Gagal memuat produk. Silakan coba lagi nanti.';
        });

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