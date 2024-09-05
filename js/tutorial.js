
let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');
const goToWebsiteButton = document.getElementById('goToWebsiteButton');

// Function to create dots dynamically
function createDots() {
    slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        //dot.addEventListener('click', () => currentSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextSlide() {
    if (currentIndex + 1 == slides.length - 1) {
        goToWebsiteButton.innerText = "시작하기"
    }
    if (currentIndex + 1 <= slides.length - 1) {
        const currentSlide = slides[currentIndex];
        currentSlide.classList.remove('active');
        currentSlide.classList.add('left'); // Move the current slide out to the left
        currentIndex = currentIndex + 1;
        const nextSlide = slides[currentIndex];
        nextSlide.classList.remove('right'); // Prepare the next slide to come in from the right
        nextSlide.classList.add('active'); // Make it active
        updateDots();
    }
}

function prevSlide() {
    if (currentIndex - 1 >= 0) {
        const currentSlide = slides[currentIndex];
        currentSlide.classList.remove('active');
        currentSlide.classList.add('right'); // Move the current slide out to the right
        currentIndex = currentIndex - 1;
        const prevSlide = slides[currentIndex];
        prevSlide.classList.remove('left'); // Prepare the previous slide to come in from the left
        prevSlide.classList.add('active'); // Make it active
        updateDots();
        goToWebsiteButton.innerText = "다음으로"
    }
}

function currentSlide(index) {
    const currentSlide = slides[currentIndex];
    currentSlide.classList.remove('active');
    if (index > currentIndex) {
        currentSlide.classList.add('left'); // Slide out to the left
    } else {
        currentSlide.classList.add('right'); // Slide out to the right
    }

    currentIndex = index;

    const nextSlide = slides[currentIndex];
    if (index > currentIndex) {
        nextSlide.classList.remove('right');
    } else {
        nextSlide.classList.remove('left');
    }
    nextSlide.classList.add('active');
    updateDots();
}

// Swipe detection
let startX = 0;
let endX = 0;

document.getElementById('container').addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.getElementById('container').addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
});

document.getElementById('container').addEventListener('touchend', () => {
    if (startX - endX > 50) {
        // Swipe left - go to next slide
        nextSlide();
    } else if (endX - startX > 50) {
        // Swipe right - go to previous slide
        prevSlide();
    }
});

// Event listener for the next button
nextButton.addEventListener('click', nextSlide);

// Event listener for the previous button
prevButton.addEventListener('click', prevSlide);

// Event listener for the Go to Website button
goToWebsiteButton.addEventListener('click', () => {
    if (goToWebsiteButton.innerText == "다음으로") {
        nextSlide();
    } else {
        window.location.href = 'https://www.example.com'; // Replace with your desired URL
    }
});

document.addEventListener("DOMContentLoaded", (event) => {
    // Initialize dots on page load
    createDots();
    if (window.innerWidth >= 600) {
        nextButton.style.display = "block";
        prevButton.style.display = "block";
    }
});