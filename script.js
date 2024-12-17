document.addEventListener("DOMContentLoaded", () => {

  const navlinks = document.querySelectorAll(".navbar ul a")
  const params = new URLSearchParams(window.location.search);
  const genre = params.get("genre");



  if (genre) {
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

  try {
    verifyToken();
  } catch (error) {
    console.error("WebToken Invalid or Expired:", error);
  }



  try {
    navlinks.forEach(nav => {
      if (genre.toLowerCase() == nav.dataset.name) {
        nav.classList.add("current");
      }
      else {
        nav.classList.remove("current");
      }
    })
  } catch (error) {
    console.error("Error in navlinks:", error);
  }



  const loader = document.getElementById("loader-container");
  loader.style.display = "none";


});


async function verifyToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log("No Token Found");
    return
  }

  try {
    const response = await fetch('https://bookhive-yxmn.onrender.com/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.id);

      const at = new Date(data.iat * 1000);
      const exp = new Date(data.exp * 1000);
      console.log(at.toLocaleString());
      console.log(exp.toLocaleString());

      const exptime = data.exp;
      const current = new Date().getTime();


      if (current > exptime) {
        updateUser();
        return;
      }
      else {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('email')
        localStorage.removeItem('mobile')
        console.log('Token Expired');
        document.getElementById('user-details').innerHTML = `<button class="login-page">Login Now</button>`;

      }



    


  } catch (error) {
    console.error("unknown")
  }
}


function updateUser() {
  const name = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const mobile = localStorage.getItem('mobile');

  document.getElementById('user-details').innerHTML = ''


  document.getElementById('user-details').innerHTML = `
  <h3>${name}</h3>
        <h5>${email}</h5>
        <h5>${mobile}</h5>`

}




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



document.querySelectorAll('.hamburger-menu').forEach(menu => {
  menu.addEventListener('click', () => {
    const menuContent = document.querySelector('.menu-content');
    if (menuContent) {
      menuContent.classList.toggle('open');
    }
  });
});



document.querySelectorAll('.account').forEach(acc=>
  acc.addEventListener('click', () => {
  const userDetails = document.getElementById('user-details');


  if (userDetails.style.display === 'none' || userDetails.style.display === '') {
    userDetails.style.display = 'flex';
  } else {
    userDetails.style.display = 'none';
  }
  document.querySelectorAll('.login-page').forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = 'login.html';
  
    })
  })
}))









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
    document.getElementById('checkout-container').style.display = 'none';
    document.getElementById('btn-container').style.display = "none";
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
        <h3 class="price">Price: ₹${book.price}</h3>
        <button class="remove-from-cart-btn" data-isbn="${book.isbn}">Remove</button>
      </div>
    `;

    cartContainer.appendChild(bookElement);

  });

  cartTotal();

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



function cartTotal() {
  var totalprice = 0;
  document.querySelectorAll('.price').forEach(book => {
    totalprice = totalprice + Math.floor(book.textContent.slice(8));
  })

  console.log(totalprice);
  const taxes = Math.round((18 / 100) * totalprice);
  const total = totalprice + taxes;

  const checkoutcontainer = document.getElementById('checkout-container');

  checkoutcontainer.innerHTML = '';

  checkoutcontainer.innerHTML = `<h1>Checkout</h1>
        <div class="check-price">
            <p>Subtotal</p>
            <p>₹ ${totalprice}</p>
        </div>
        <div class="taxes">
            <p>Taxes (18%)</p>
            <p>₹ ${taxes}</p>
        </div>
        <span></span>
        <div class="total-price">
            <strong>Total</strong>
            <strong>₹ ${total}</strong>
        </div>`

  document.getElementById('btn-container').style.display = "flex";

}


function clearCart() {
  localStorage.removeItem('cart');
  loadCart();

}


document.getElementById('choose-login-btn').addEventListener('click', () => {
  document.querySelector('.selected-btn').style.transform = "translateX(0%)";


  const container = document.getElementById('main-user-container');
  container.innerHTML = '';

  container.innerHTML = `<label for="username">Email</label>
            <input type="email" name="username" id="login-email" placeholder="john@gmail.com">
            <label for="password">Password</label>
            <input type="password" name="password" id="login-password" placeholder="********">
            <button id="login-btn">Login</button>`


});

document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Please enter valid information');
    return;
  }

  try {
    const response = await fetch('https://bookhive-yxmn.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login successful');
      console.log('User data:', data);
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.user.name)
      localStorage.setItem('email', data.user.email)
      localStorage.setItem('mobile', data.user.mobile)
      verifyToken();

      window.location.href = "index.html";


    } else {
      alert(data.message || 'Login failed');
      location.reload()
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again later.');
    location.reload()
  }
});










document.getElementById('choose-signup-btn').addEventListener('click', () => {
  document.querySelector('.selected-btn').style.transform = "translateX(100%)";

  const container = document.getElementById('main-user-container');
  container.innerHTML = '';

  container.innerHTML = `<label for="name">Name</label>
            <input type="text" name="name" id="signup-text" placeholder="John Doe">
            <label for="mobile">Phone Number</label>
            <input type="number" name="mobile" id="signup-number" placeholder="9999999999">
            <label for="username">Email</label>
            <input type="email" name="username" id="signup-email" placeholder="john@gmail.com">
            <label for="password">Password</label>
            <input type="password" name="password" id="signup-password" placeholder="********">

            <button id="signup-btn">Signup</button>`;


  document.getElementById('signup-btn').addEventListener('click', async () => {
    const name = document.getElementById('signup-text').value;
    const mobile = document.getElementById('signup-number').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const time = new Date().toLocaleString();


    if (!name || !mobile || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {

      const response = await fetch('https://bookhive-yxmn.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: name,
          mobile: mobile,
          email: email,
          password: password,
          time: time
        })
      });


      const data = await response.json();
      if (response.ok) {
        alert('Signup successful');
        console.log(data);
        location.reload()
      } else {
        alert(data.message || 'Signup failed');
        location.reload()
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
      location.reload()
    }
  });





})




