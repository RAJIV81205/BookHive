document.addEventListener("DOMContentLoaded", () => {

  const navlinks = document.querySelectorAll(".navbar ul a")
  const params = new URLSearchParams(window.location.search);
  const genre = params.get("genre");
  const booktitle = params.get("title")



  if (booktitle) {
    getbookbytitle(booktitle);
  }



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
    const response = await fetch('https://bookhive2-1k7bw13r.b4a.run/verify', {
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



    } else {
      console.log(data.message || 'Unknown');
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('mobile')
      console.log('Token Expired');
      document.getElementById('user-details').innerHTML = `<button class="login-page">Login Now</button>`;

    }



  } catch (error) {
    console.error("unknown")
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('mobile')
    console.log('Token Expired');
    document.getElementById('user-details').innerHTML = `<button class="login-page">Login Now</button>`;

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
        <h5>${mobile}</h5>
        <button id="sign-out-btn">Sign Out</button>`


  document.querySelectorAll('#sign-out-btn').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('mobile')
      console.log('Token Expired');
      location.reload();


    })
  })

}



try {

  document.querySelector('.search-input').addEventListener('input', async () => {
    const input = document.querySelector('.search-input').value;
    document.querySelector('.search-bar').style.borderRadius = "25px";
    document.querySelector('.suggestions').style.display = "none";

    try {
      const response = await fetch('books.json');
      const data = await response.json();
      document.querySelector('.suggestions').innerHTML = '';
      if (input.length < 2) {
        document.querySelector('.search-bar').style.borderRadius = "25px";
        document.querySelector('.suggestions').style.display = "none";
        return;
      }


      data.forEach(book => {
        if (book.name.toLowerCase().includes(input.toLowerCase())) {
          document.querySelector('.search-bar').style.borderRadius = "25px 25px 25px 0"
          document.querySelector('.suggestions').style.display = "flex";
          const suggestion = document.createElement('div');
          suggestion.classList.add('suggestion');
          suggestion.innerHTML = book.name;
          document.querySelector('.suggestions').appendChild(suggestion);

        }
      })
    } catch (error) {
      console.error(error);
    }


    document.querySelectorAll('.suggestion').forEach(suggest => {
      suggest.addEventListener('click', async function () {
        document.querySelector('.search-input').value = suggest.innerHTML;
        document.querySelector('.search-bar').style.borderRadius = "25px";
        document.querySelector('.suggestions').innerHTML = '';
        document.querySelector('.suggestions').style.display = "none"


      })
    })


    document.querySelectorAll('.search-button').forEach(button => {
      button.addEventListener('click', async function () {
        const input = document.querySelector('.search-input').value;
        window.location.href = `book.html?title=${input}`


      })
    })
  })
}
catch (error) {
  console.log(error);
}







try {
  document.querySelector('.search-input-mobile').addEventListener('input', async () => {
    const input = document.querySelector('.search-input-mobile').value;
    document.querySelector('.search-bar-mobile').style.borderRadius = "25px";
    document.querySelector('.suggestions-mobile').style.display = "none";

    try {
      const response = await fetch('books.json');
      const data = await response.json();
      document.querySelector('.suggestions-mobile').innerHTML = '';
      if (input.length < 2) {
        document.querySelector('.search-bar-mobile').style.borderRadius = "25px";
        document.querySelector('.suggestions-mobile').style.display = "none";
        return;
      }


      data.forEach(book => {
        if (book.name.toLowerCase().includes(input.toLowerCase())) {
          document.querySelector('.search-bar-mobile').style.borderRadius = "25px 25px 25px 0"
          document.querySelector('.suggestions-mobile').style.display = "flex";
          const suggestion = document.createElement('div');
          suggestion.classList.add('suggestion');
          suggestion.innerHTML = book.name;
          document.querySelector('.suggestions-mobile').appendChild(suggestion);

        }
      })
    } catch (error) {
      console.error(error);
    }


    document.querySelectorAll('.suggestion').forEach(suggest => {
      suggest.addEventListener('click', async function () {
        document.querySelector('.search-input-mobile').value = suggest.innerHTML;
        document.querySelector('.search-bar-mobile').style.borderRadius = "25px";
        document.querySelector('.suggestions-mobile').innerHTML = '';
        document.querySelector('.suggestions-mobile').style.display = "none"


      })
    })



    document.querySelectorAll('.search-button-mobile').forEach(button => {
      button.addEventListener('click', async function () {
        const input = document.querySelector('.search-input-mobile').value;
        window.location.href = `book.html?title=${input}`


      })
    })

  })
}
catch (error) {
  console.log(error);
}




async function getbookbytitle(booktitle) {

  const container = document.getElementById("fictional-book-container");


  try {
    const response = await fetch('books.json');
    const books = await response.json();


    var fictionalBooks = books.filter(book => book.name === booktitle);



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




  } catch (error) {
    console.error(error)
  }

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







document.querySelectorAll('.account').forEach(acc =>
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

    if (genre == "All") {
      var fictionalBooks = books;

    } else {
      var fictionalBooks = books.filter(book => book.category === genre);
    }


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
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: `${book.name} added to the wishlist!.`
          });
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "info",
            title: `${book.name} is already in the wishlist.`
          });
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
          updateCartCount()
          button.textContent = "Added"
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "info",
            title: `${book.name} is already in the cart.`
          });
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
  localStorage.setItem('price', total);

}

try {
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    localStorage.removeItem('cart');
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Your Cart has been cleared!"
    });
    loadCart();

  })
} catch (error) {
  console.log(error);
}





try {
  document.getElementById('checkout-btn').addEventListener('click', () => {
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire({
        title: 'Please Login First!',
        text: 'Login to Checkout',
        icon: 'warning',
        showConfirmButton: true,
        confirmButtonText: 'Login',
        timer: 3000, // 3 seconds
        timerProgressBar: true,
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          confirmButton: 'custom-swal-button',
          timerProgressBar: 'custom-swal-timer-bar',
        },
      }).then((result) => {

        if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
          window.location.href = 'login.html';
        }
      });
      return;
    }


    const username = localStorage.getItem('username');
    const mobile = localStorage.getItem('mobile');
    const email = localStorage.getItem('email');

    document.getElementById('cart-container').style.display = "none";
    document.getElementById('checkout-container').style.display = "none";
    document.getElementById('btn-container').style.display = "none";

    const paymentcon = document.getElementById('payment-container');
    paymentcon.style.display = "flex";
    document.getElementById("cart-title").innerText = "Payment Details";

    document.getElementById('payment-name').value = username;
    document.getElementById('payment-email').value = email;
    document.getElementById('payment-mobile').value = mobile;

    document.getElementById('submit-order').addEventListener('click', () => {
      submitOrder(username, mobile, email);
    })

    window.location.href = "#payment-container"





    document.getElementById('payment-pin').addEventListener('input', async () => {
      const pin = document.getElementById('payment-pin').value;

      fetch(`https://api.postalpincode.in/pincode/${pin}`)
        .then((response) => response.json())
        .then((data) => {

          if (data[0].Status === "Error") {
            console.error("Invalid PIN code or data not found");
            return;
          }

          const city = document.getElementById("payment-city");
          const postOfficeList = data[0].PostOffice;


          city.innerHTML = "";
          city.innerHTML = `<option> Select City</option>`


          postOfficeList.forEach((el) => {
            const citydet = `${el.Name}, ${el.District}`;
            const optcity = `<option value="${el.Name}">${citydet}</option>`;
            console.log(citydet);
            city.innerHTML += optcity;
          });
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });


    })




  })
}
catch (error) {
  console.log(error);
}

try {
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





  document.getElementById('main-user-container').addEventListener('click', async (event) => {
    if (event.target && event.target.id === 'login-btn') {
    document.querySelector('.login-loader-container').style.display = "flex"
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Please enter valid information."
      });
      document.querySelector('.login-loader-container').style.display = "none";
      return;
    }

    try {
      const response = await fetch('https://bookhive2-1k7bw13r.b4a.run/login', {
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
        console.log('User data:', data);
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.user.name)
        localStorage.setItem('email', data.user.email)
        localStorage.setItem('mobile', data.user.mobile)
        document.querySelector('.login-loader-container').style.display = "none";



        Swal.fire({
          title: 'Login Successful!',
          text: `Welcome Back! ${data.user.name}.`,
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'Start Shopping',
          timer: 3000, // 3 seconds
          timerProgressBar: true,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            confirmButton: 'custom-swal-button',
            timerProgressBar: 'custom-swal-timer-bar',
          },
        }).then((result) => {

          if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
            window.location.href = 'index.html';
          }
        });










      } else {
        document.querySelector('.login-loader-container').style.display = "none";
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${data.message}` || 'Login failed',
          timer: 3000,
          showConfirmButton: true,
          confirmButtonText: 'Try Again',
        }).then((result) => {

          if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
            location.reload()
          }
        })

      }
    } catch (error) {
      console.error('Error:', error);
      document.querySelector('.login-loader-container').style.display = "none";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong , Please try Again Later!",
        timer: 3000
      });
      location.reload()
    }
  }
})

} catch (error) {
  console.error(error)
}








try {

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
      document.querySelector('.login-loader-container').style.display = "flex"
      const name = document.getElementById('signup-text').value;
      const mobile = document.getElementById('signup-number').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const time = new Date().toLocaleString();


      if (!name || !mobile || !email || !password) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Please fill in all fields"
        });

        document.querySelector('.login-loader-container').style.display = "none"
        return;
      }

      try {

        const response = await fetch('https://bookhive2-1k7bw13r.b4a.run/signup', {
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
          Swal.fire({
            title: 'Signup Successful!',
            text: `Login to continue.`,
            icon: 'success',
            showConfirmButton: true,
            confirmButtonText: 'Login',
            timer: 3000, // 3 seconds
            timerProgressBar: true,
            customClass: {
              popup: 'custom-swal-popup',
              title: 'custom-swal-title',
              confirmButton: 'custom-swal-button',
              timerProgressBar: 'custom-swal-timer-bar',
            },
          }).then((result) => {

            if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
              window.location.href = 'login.html';
            }
          });
          console.log(data);
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title: `${data.message} || 'Signup failed'`
          });
          location.reload()
        }
      } catch (error) {
        console.error('Error:', error);
        document.querySelector('.login-loader-container').style.display = "none";
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong , Please try Again Later!",
          timer: 3000
        });
        location.reload()
      }
    });





  })
} catch (error) {
  console.error(error)
}











async function submitOrder(username, mobile, email) {
  const orderNumber = Math.round(Math.random() * 1000000);
  const add = document.getElementById('payment-address').value;
  const pincode = document.getElementById('payment-pin').value;
  const state = document.getElementById('payment-state').value;
  const city = document.getElementById('payment-city').value;
  const paytype = document.getElementById('payment-type').value;
  const cart = JSON.parse(localStorage.getItem('cart'));
  const cost = localStorage.getItem('price');

  if (!add || !pincode || !state || !paytype || !cart || !cost) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "Please fill in all fields"
    });
    return;
  }

  if (pincode < 100000 || pincode > 999999) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "Wrong Pincode"
    });
    location.reload()
    return;
  }


  const items = [];
  cart.forEach(item => {
    if (item.isbn) {
      items.push(item.isbn);
    }
  });

  try {

    const response = await fetch('https://bookhive2-1k7bw13r.b4a.run/submit-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderNumber: orderNumber,
        name: username,
        mobile: mobile,
        email: email,
        add: add,
        pincode: parseInt(pincode),
        city: city,
        state: state,
        paytype: paytype,
        items: items,
        cost: parseFloat(cost)
      })
    });


    const responseData = await response.json();

    if (response.ok) {
      console.log('Order Submitted Successfully:', responseData);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Order Submitted Successully!"
      });
      displayConfirmation(orderNumber, username, mobile, email, add, pincode, state, paytype, items, cost, city)

    } else {
      console.error('Error submitting order:', responseData);
      alert('Error submitting order: ' + (responseData.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Fetch error:', error);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "An Error Occurred, Please Try Again Later"
    });
  }
}


async function displayConfirmation(orderNumber, username, mobile, email, add, pincode, state, paytype, items, cost) {
  window.location.href = "#confirm-container";
  document.getElementById('confirm-container').style.display = "flex";

  const response = await fetch('books.json');
  const books = await response.json();


  let tableRows = "";
  items.forEach(item => {
    const book = books.find(b => b.isbn === item);
    if (book) {
      const totalPrice = 1 * book.price;
      tableRows += `
        <tr>
          <td>${book.name}</td>
          <td>1</td>
          <td>₹${book.price}</td>
          <td>₹${totalPrice}</td>
        </tr>
      `;
    }
  });

  // HTML content for the invoice
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    .invoice-container {
      max-width: 800px;
      margin: auto;
      border: 1px solid #ddd;
      padding: 20px;
      border-radius: 5px;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
    .invoice-header img {
      max-width: 150px;
    }
    .invoice-header h1 {
      font-size: 24px;
      color: #333;
    }
    .invoice-details {
      margin-top: 20px;
    }
    .invoice-details table {
      width: 100%;
      border-collapse: collapse;
    }
    .invoice-details th, .invoice-details td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .invoice-details th {
      background-color: #f5f5f5;
    }
    .total-container {
      margin-top: 20px;
      text-align: right;
    }
    .total-container h3 {
      font-size: 18px;
      color: #333;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="invoice-container" id="invoice">
    <div class="invoice-header">
      <h1>BookHive</h1>
    </div>

    <div class="invoice-details">
      <h3>Order Details:</h3>
      <p><strong>Order No:</strong> ${orderNumber}</p>
      <p><strong>Name:</strong> ${username}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Address:</strong> ${add},${city} ,${state} - ${pincode}</p>
      
      <h3>Items Ordered:</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>

    <div class="total-container">
      <h3>Total Amount: ₹${cost}</h3>
    </div>

    <div class="footer">
      <p>Thank you for shopping with us!</p>
      <p>BookHive - India - bookhive@gmail.com</p>
    </div>
  </div>
</body>
</html>
  `;



  document.getElementById('download').addEventListener('click', async () => {
    try {


      // Send HTML to backend
      const response = await fetch('https://bookhive2-1k7bw13r.b4a.run/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to generate PDF:', await response.text());
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  });



  localStorage.removeItem('cart');
  localStorage.removeItem('price');


  document.getElementById('close-popup').addEventListener('click', () => {
    window.location.href = "index.html";
  });
}











