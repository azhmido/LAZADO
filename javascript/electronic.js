document.addEventListener('DOMContentLoaded', () => {

  const productContainer = document.getElementById('product-container');
  const searchInput = document.getElementById('search-input');
  const themeToggle = document.getElementById('theme-toggle');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('header-nav');
  const body = document.body;

  let allProducts = []; //untuk menyimpan semua produk dari API

  //untuk nampilin produk
  const displayProducts = (productsToDisplay) => {
    productContainer.replaceChildren();

    if (productsToDisplay.length === 0) {
        const notFoundMessage = document.createElement('p');
        notFoundMessage.classList.add('not-found');
        notFoundMessage.textContent = 'Produk tidak ditemukan.';
        productContainer.appendChild(notFoundMessage);
        return;
    }

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
        addToCart(product);
        // Memanggil pop-up kustom sebagai pengganti alert()
        showNotification(`"${product.title}" telah ditambahkan ke keranjang!`);
      });

      const detailButton = document.createElement('button');
      detailButton.classList.add('detail-button');
      detailButton.textContent = 'Lihat Detail';
      detailButton.addEventListener('click', () => {
        window.location.href = `product.html?id=${product.id}`;
      });

      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'product-buttons';
      buttonsDiv.append(detailButton, buyButton);

      card.append(productImage, productTitle, productPrice, productDescription, productCategory, productRating, buttonsDiv);
      productContainer.appendChild(card);
    });
  };

  //ngambil data dan insialisasi pencarian
  if(productContainer) {
    showSkeleton(productContainer, 8);
    fetch("https://fakestoreapi.com/products/category/electronics")
      .then((response) => response.json())
      .then((products) => {
        allProducts = products;
        initFilters();
        displayProducts(allProducts);
      })
      .catch((error) => {
        console.error('Error saat mengambil data produk:', error);
        productContainer.textContent = 'Gagal memuat produk. Silakan coba lagi nanti.';
      });

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

    if (searchInput) {
      searchInput.addEventListener('input', renderFiltered);
    }

    const initFilters = () => {
      if (productContainer.parentElement) {
        const filterBar = createFilterBar(renderFiltered);
        productContainer.parentElement.insertBefore(filterBar, productContainer);
      }
    };
  }

  //tema dark mode
  const themeKey = 'theme-preference';
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme === 'dark-mode') {
    body.classList.add('dark-mode');
  }
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem(themeKey, body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
  });

  //menu hamburger
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
    });
  }

  //update ikon keranjang
  updateCartIconState();
});