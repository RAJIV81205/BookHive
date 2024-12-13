document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader-container");
  loader.style.display = "none"

  const current = window.location.pathname.split("/").pop();

  if (current=="fictional.html"){
    fetchFictional()
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
    
    const response = await fetch('books.json');
    const books = await response.json();

    
    const fictionalBooks = books.filter(book => book.category === "Fictional");

   
    container.innerHTML = '';

    
    fictionalBooks.forEach(book => {
      const bookElement = document.createElement('div');
      bookElement.classList.add('book-container'); 
      bookElement.setAttribute('onclick', 'getBook(this)');
      bookElement.setAttribute('data-isbn', book.isbn); 

      bookElement.innerHTML = `
        <img src="${book.image}" alt="${book.name}" ">
        <h4>${book.name}</h4>
        <p><s>₹${book.original_price}</s>  ₹${book.price}</p>
      `;
      container.appendChild(bookElement);
    });

    console.log(fictionalBooks); 
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}


function getBook(element) {

  window.location.href = "book.html"
  const isbn = element.getAttribute('data-isbn');
  console.log(`Book ISBN: ${isbn}`);
  // Add your logic here to display book details or take further actions
}






