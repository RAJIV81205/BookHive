document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader-container");
  loader.style.display = "none";
  
  const current = window.location.pathname.split("/").pop();
  const navlinks = document.querySelectorAll(".navbar ul a")


  navlinks.forEach(nav=>{
    if (current == nav.getAttribute("href")){
    nav.classList.add("current");}
    else {
      nav.classList.remove("current");
    }
  })


  if (current=="fictional.html"){
    fetchFictional()
  }
  else if(current=="cart.html"){
    loadCart()
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





async function fetchFictional() {
  const container = document.getElementById("fictional-book-container");

  try {
    // Fetching books data
    const response = await fetch('books.json');
    const books = await response.json();

    // Filtering for fictional books
    const fictionalBooks = books.filter(book => book.category === "Fictional");

    // Rendering books dynamically
    container.innerHTML = '';
    fictionalBooks.forEach(book => {
      const bookElement = document.createElement('div');
      bookElement.classList.add('book-container');

      // Adding book details
      bookElement.innerHTML = `
        <img src="${book.image}" alt="${book.name}">
        <h4>${book.name}</h4>
        <p><s>₹${book.original_price}</s> ₹${book.price}</p>
        <button class="add-to-cart-btn" data-isbn="${book.isbn}">Add to Cart</button>
      `;

      container.appendChild(bookElement);
    });

    // Add "Add to Cart" functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', function () {
        const isbn = this.getAttribute('data-isbn');
        const book = fictionalBooks.find(b => b.isbn === isbn);

        // Get cart from localStorage or initialize it
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Add book to cart if not already present
        if (!cart.some(item => item.isbn === isbn)) {
          cart.push(book);
          localStorage.setItem('cart', JSON.stringify(cart));
          alert(`${book.name} added to cart!`);
        } else {
          alert(`${book.name} is already in the cart.`);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}


















function loadCart() {
  const cartContainer = document.getElementById('cart-container');


  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length == 0) {
    cartContainer.innerHTML = '<p>Your cart is empty!</p>';
    return;
  }

  cartContainer.innerHTML=""

 
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
    });
  });
}





