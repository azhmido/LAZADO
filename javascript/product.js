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
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
      // Mode detail produk
      const pageTitle = document.querySelector('section h2');
      if (searchInput) searchInput.style.display = 'none';

      const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

      const getCategoryLink = (cat) => {
        const map = {
          "men's clothing": 'men-clothing.html',
          "women's clothing": 'women-clothing.html',
          jewelery: 'jewelery.html',
          electronics: 'electronic.html',
        };
        return map[cat] || 'product.html';
      };

      const getCategoryColor = (cat) => {
        const map = {
          "men's clothing": '#4a90d9',
          "women's clothing": '#e84393',
          jewelery: '#f39c12',
          electronics: '#27ae60',
        };
        return map[cat] || '#6c757d';
      };

      const createStarRating = (rate) => {
        const full = Math.floor(rate);
        const dec = rate - full;
        const half = dec >= 0.2 && dec < 0.8;
        const empty = 5 - full - (half ? 1 : 0);
        let html = '';
        for (let i = 0; i < full; i++) html += '<span class="star star-filled">★</span>';
        if (half) html += '<span class="star star-half">★</span>';
        for (let i = 0; i < empty; i++) html += '<span class="star star-empty">★</span>';
        return html;
      };

      const truncate = (s, n) => s.length > n ? s.substring(0, n) + '...' : s;

      showSkeleton(productContainer, 1);
      fetch(`https://fakestoreapi.com/products/${productId}`)
        .then((response) => {
          if (!response.ok) throw new Error('Produk tidak ditemukan');
          return response.json();
        })
        .then((product) => {
          productContainer.replaceChildren();
          if (pageTitle) pageTitle.textContent = '';

          const detailDiv = document.createElement('div');
          detailDiv.className = 'product-detail';

          // Breadcrumb
          const breadcrumb = document.createElement('div');
          breadcrumb.className = 'breadcrumb';
          breadcrumb.innerHTML = `
            <a href="product.html">Home</a>
            <span class="breadcrumb-sep">›</span>
            <a href="${getCategoryLink(product.category)}">${capitalize(product.category.replace("'", ''))}</a>
            <span class="breadcrumb-sep">›</span>
            <span class="breadcrumb-current">${truncate(product.title, 40)}</span>
          `;

          // Image section with zoom wrapper
          const imageSection = document.createElement('div');
          imageSection.className = 'detail-image-section';
          const imageWrapper = document.createElement('div');
          imageWrapper.className = 'detail-image-wrapper';
          const image = document.createElement('img');
          image.src = product.image;
          image.alt = product.title;
          image.className = 'product-detail-image';
          imageWrapper.appendChild(image);
          imageSection.appendChild(imageWrapper);

          // Info section
          const infoDiv = document.createElement('div');
          infoDiv.className = 'product-detail-info';

          const title = document.createElement('h1');
          title.className = 'detail-title';
          title.textContent = product.title;

          // Star rating
          const ratingDiv = document.createElement('div');
          ratingDiv.className = 'detail-rating';
          ratingDiv.innerHTML = `
            ${createStarRating(product.rating.rate)}
            <span class="rating-text">${product.rating.rate}</span>
            <span class="rating-count">(${product.rating.count} reviews)</span>
          `;

          // Price
          const price = document.createElement('div');
          price.className = 'product-detail-price';
          price.innerHTML = `$${product.price.toFixed(2)} <span class="price-shipping">Free Shipping</span>`;

          // Category badge
          const catColor = getCategoryColor(product.category);
          const badge = document.createElement('span');
          badge.className = 'detail-category-badge';
          badge.textContent = capitalize(product.category.replace("'", ''));
          badge.style.backgroundColor = catColor + '18';
          badge.style.color = catColor;
          badge.style.borderColor = catColor;

          // Description
          const desc = document.createElement('p');
          desc.className = 'product-detail-description';
          desc.textContent = product.description;

          // Divider
          const divider = document.createElement('hr');
          divider.className = 'detail-divider';

          // Actions (Quantity + Add to Cart)
          const actionDiv = document.createElement('div');
          actionDiv.className = 'detail-actions';

          const qtyDiv = document.createElement('div');
          qtyDiv.className = 'detail-qty';

          const minusBtn = document.createElement('button');
          minusBtn.className = 'qty-btn qty-minus';
          minusBtn.textContent = '−';
          const qtyInput = document.createElement('input');
          qtyInput.type = 'number';
          qtyInput.className = 'qty-input';
          qtyInput.value = '1';
          qtyInput.min = '1';
          qtyInput.max = '99';
          const plusBtn = document.createElement('button');
          plusBtn.className = 'qty-btn qty-plus';
          plusBtn.textContent = '+';

          minusBtn.addEventListener('click', () => {
            const val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
          });
          plusBtn.addEventListener('click', () => {
            const val = parseInt(qtyInput.value) || 1;
            if (val < 99) qtyInput.value = val + 1;
          });
          qtyInput.addEventListener('change', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val < 1) val = 1;
            if (val > 99) val = 99;
            qtyInput.value = val;
          });

          qtyDiv.append(minusBtn, qtyInput, plusBtn);

          const addBtn = document.createElement('button');
          addBtn.className = 'buy-button detail-add-btn';
          addBtn.innerHTML = '<span class="material-symbols-outlined">shopping_cart</span> Add to Cart';

          addBtn.addEventListener('click', () => {
            const qty = parseInt(qtyInput.value) || 1;
            for (let i = 0; i < qty; i++) addToCart(product);
            showNotification(`${qty > 1 ? qty + 'x ' : ''}"${product.title}" telah ditambahkan ke keranjang!`);
          });

          actionDiv.append(qtyDiv, addBtn);
          infoDiv.append(title, ratingDiv, price, badge, desc, divider, actionDiv);
          detailDiv.append(breadcrumb, imageSection, infoDiv);
          productContainer.appendChild(detailDiv);

          // Fade-in
          requestAnimationFrame(() => {
            detailDiv.style.opacity = '1';
            detailDiv.style.transition = 'opacity 0.5s ease';
          });

          // Related products
          const categoryMap = {
            "men's clothing": "men's%20clothing",
            "women's clothing": "women's%20clothing",
            jewelery: 'jewelery',
            electronics: 'electronics',
          };
          const catParam = categoryMap[product.category];
          if (catParam) {
            const relatedSection = document.createElement('div');
            relatedSection.className = 'related-products';
            relatedSection.innerHTML = '<h3 class="related-title">Produk Terkait</h3><div class="related-grid"></div>';
            productContainer.appendChild(relatedSection);
            const grid = relatedSection.querySelector('.related-grid');

            fetch(`https://fakestoreapi.com/products/category/${catParam}`)
              .then((r) => r.json())
              .then((related) => {
                related
                  .filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .forEach((p) => {
                    const card = document.createElement('a');
                    card.className = 'related-card';
                    card.href = `product.html?id=${p.id}`;
                    card.innerHTML = `
                      <div class="related-card-img">
                        <img src="${p.image}" alt="${p.title}" loading="lazy">
                      </div>
                      <div class="related-card-info">
                        <h4>${truncate(p.title, 36)}</h4>
                        <span class="related-price">$${p.price.toFixed(2)}</span>
                      </div>
                    `;
                    grid.appendChild(card);
                  });
                if (grid.children.length === 0) relatedSection.style.display = 'none';
              })
              .catch(() => {
                relatedSection.style.display = 'none';
              });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          productContainer.innerHTML = '<p class="not-found">Produk tidak ditemukan.</p>';
        });
    } else {
      // Mode semua produk
      showSkeleton(productContainer, 8);
      fetch("https://fakestoreapi.com/products")
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