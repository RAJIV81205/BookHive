document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader-container");
  loader.style.display = "none";
  

  const navlinks = document.querySelectorAll(".navbar ul a")
  const params = new URLSearchParams(window.location.search);
  const genre = params.get("genre");


  


  


  if (genre){
    fetchBooks(genre)
  }
  try {
    loadWishlist();
  } catch (error) {
    console.error("Error in loadWishlist:", error);
  }
  
  try {
    loadCart();
  } catch (error) {
    console.error("Error in loadCart:", error);
  }
  
  try {
    updateCartCount();
  } catch (error) {
    console.error("Error in updateCartCount:", error);
  }

  try{
    navlinks.forEach(nav=>{
      if (genre.toLowerCase() == nav.dataset.name){
      nav.classList.add("current");}
      else {
        nav.classList.remove("current");
      }
    })
  } catch(error){
    console.error("Error in navlinks:", error);
  }

  
});




let currentIndex = 0;
const slides = document.querySelectorAll('.slideshow-container img');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

setInterval(nextSlide, 3000);





async function fetchBooks(genre) {
  const container = document.getElementById("fictional-book-container");
  document.title = `${genre} - BookHive`

  try {
    
    const response = await fetch('books.json');
    const books = await response.json();

    
    const fictionalBooks = books.filter(book => book.category === genre);

    
    container.innerHTML = '';
    fictionalBooks.forEach(book => {
      const bookElement = document.createElement('div');
      bookElement.classList.add('book-container');

      
      bookElement.innerHTML = `
        <img src="${book.image}" alt="${book.name}">
        <h4>${book.name}</h4>
        <p><s>₹${book.original_price}</s> ₹${book.price}</p>
        <div class="btn-container">
        <button class="wishlist-btn" data-isbn="${book.isbn}"><img src="https://i.postimg.cc/5t4Wf5PQ/e-commerce.png"></button>
        <button class="add-to-cart-btn" data-isbn="${book.isbn}">Add to Cart</button>
        </div>
      `;

      container.appendChild(bookElement);
    });



    document.querySelectorAll('.wishlist-btn').forEach(button => {
      button.addEventListener('click', function () {
        const isbn = this.getAttribute('data-isbn');
        const book = fictionalBooks.find(b => b.isbn === isbn);

        
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

       
        if (!wishlist.some(item => item.isbn === isbn)) {
          wishlist.push(book);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
          alert(`${book.name} added to wishlist!`);
        } else {
          alert(`${book.name} is already in the wishlist.`);
        }
      });
    });



  
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', function () {
        const isbn = this.getAttribute('data-isbn');
        const book = fictionalBooks.find(b => b.isbn === isbn);

        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

       
        if (!cart.some(item => item.isbn === isbn)) {
          cart.push(book);
          localStorage.setItem('cart', JSON.stringify(cart));
          alert(`${book.name} added to cart!`);
          updateCartCount()
          button.textContent = "Added"
        } else {
          alert(`${book.name} is already in the cart.`);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}














function loadWishlist() {
  const wishlistContainer = document.getElementById('wishlist-container');
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = '<p>Your wishlist is empty!</p>';
    updatewishlistCount();
    return;
  }

  wishlistContainer.innerHTML = '';

  wishlist.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.classList.add('cart-book-container');

    bookElement.innerHTML = `
      <img src="${book.image}" alt="${book.name}">
      <div class="cart-book-info">
        <h2>${book.name}</h2>
        <h3>${book.author}</h3>
        <p>${book.description}</p>
        <h3>Price: ₹${book.price}</h3>
        <button class="remove-from-wishlist-btn" data-isbn="${book.isbn}">Remove</button>
      </div>
    `;

    wishlistContainer.appendChild(bookElement);
  });

  document.querySelectorAll('.remove-from-wishlist-btn').forEach(button => {
    button.addEventListener('click', function () {
      const isbn = this.getAttribute('data-isbn');
      const updatedwishlist = wishlist.filter(book => book.isbn !== isbn);
      localStorage.setItem('wishlist', JSON.stringify(updatedwishlist));
      loadWishlist();

    });
  });
 
}









function loadCart() {
  const cartContainer = document.getElementById('cart-container');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty!</p>';
    updateCartCount();
    return;
  }

  cartContainer.innerHTML = '';

  cart.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.classList.add('cart-book-container');

    bookElement.innerHTML = `
      <img src="${book.image}" alt="${book.name}">
      <div class="cart-book-info">
        <h2>${book.name}</h2>
        <h3>${book.author}</h3>
        <p>${book.description}</p>
        <h3>Price: ₹${book.price}</h3>
        <button class="remove-from-cart-btn" data-isbn="${book.isbn}">Remove</button>
      </div>
    `;

    cartContainer.appendChild(bookElement);
  });

  document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
    button.addEventListener('click', function () {
      const isbn = this.getAttribute('data-isbn');
      const updatedCart = cart.filter(book => book.isbn !== isbn);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      loadCart();
      updateCartCount();
    });
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElements = document.querySelectorAll('.cart .count');
  cartCountElements.forEach(cartCountElement => {
    cartCountElement.textContent = cart.length > 0 ? cart.length : '0';
  });
  localStorage.setItem('cart-total', cart.length > 0 ? cart.length : '0');
}

document.addEventListener('DOMContentLoaded', updateCartCount);
