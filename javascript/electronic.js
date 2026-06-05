//untuk kelola keranjang
const getCart = () => {
  const cartString = localStorage.getItem('lazadoCart');
  return cartString ? JSON.parse(cartString) : [];
};

const saveCart = (cart) => {
  localStorage.setItem('lazadoCart', JSON.stringify(cart));
  updateCartIconState(); // maanggil update ikon setelah menyimpan
};

const addToCart = (productToAdd) => {
  let cart = getCart();
  const existingProduct = cart.find(item => item.id === productToAdd.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    //salinan objek produk agar tidak mengubah objek asli di 'allProducts'
    const newProductInCart = { ...productToAdd, quantity: 1 };
    cart.push(newProductInCart);
  }
  saveCart(cart);
};

const updateCartIconState = () => {
  const cartIcon = document.getElementById('cart-icon');
  if (!cartIcon) return; // jika ikon tidak ada (misal: di halaman login)
  const cart = getCart();
  if (cart.length > 0) {
    cartIcon.classList.add('cart-active');
  } else {
    cartIcon.classList.remove('cart-active');
  }
};

// Fungsi untuk membuat Pop-up Notifikasi Kustom
const showNotification = (message) => {
  // Membuat elemen div untuk notifikasi
  const notification = document.createElement('div');
  notification.classList.add('custom-notification');
  notification.textContent = message;

  // Memasukkan notifikasi ke dalam body HTML
  document.body.appendChild(notification);

  // Menghilangkan notifikasi secara otomatis setelah 3 detik
  setTimeout(() => {
    notification.classList.add('hide'); // Tambah class hide untuk animasi pudar
    // Hapus elemen dari DOM setelah animasi selesai
    setTimeout(() => {
      notification.remove();
    }, 500); 
  }, 3000);
};

//insialisasi DOM 
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

      card.append(productImage, productTitle, productPrice, productDescription, productCategory, productRating, buyButton);
      productContainer.appendChild(card);
    });
  };

  //ngambil data dan insialisasi pencarian
  if(productContainer) {
    fetch("https://fakestoreapi.com/products/category/electronics")
      .then((response) => response.json())
      .then((products) => {
        allProducts = products;
        displayProducts(allProducts); // nampilin semua produk awal
      })
      .catch((error) => {
        console.error('Error saat mengambil data produk:', error);
        productContainer.textContent = 'Gagal memuat produk. Silakan coba lagi nanti.';
      });
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = allProducts.filter(product => {
            return product.title.toLowerCase().includes(searchTerm);
        });
        displayProducts(filteredProducts);
    });
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