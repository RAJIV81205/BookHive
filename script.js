document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader-container");
  loader.style.display = "none"


});

function scrollLeft() {
  const genre = document.querySelector(".genre");
  genre.scrollBy({ left: -300, behavior: "smooth" });
}

function scrollRight() {
  const genre = document.querySelector(".genre");
  genre.scrollBy({ left: 300, behavior: "smooth" });
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

// Change slides every 3 seconds
setInterval(nextSlide, 3000);
