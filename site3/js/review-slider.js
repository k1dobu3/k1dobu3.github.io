let currentIndex = 0;
let slideInterval = null;
const slides = document.querySelectorAll('.review-slide');
const totalSlides = slides.length;
const activeSegment = document.getElementById('review-active-segment');
const reviewDivider = document.getElementById('review-divider');

const timerMs = 15000;

reviewDivider.addEventListener('click', function(event) {
    const rect = reviewDivider.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const totalWidth = rect.width;
    const segmentWidth = totalWidth / totalSlides;
    const clickedIndex = Math.floor(clickPosition / segmentWidth);

    if (clickedIndex >= 0 && clickedIndex < totalSlides) {
        jumpToReview(clickedIndex);
    }
});

function initSlider() {
    if (totalSlides === 0) {
        console.error('No slides to show!');
        return;
    }
    showSlide(currentIndex);
    startAutoSlide();
}

function updateNavigationPosition() {
    const activeSlide = document.querySelector('.review-slide.active .review-text');
    const reviewNavigation = document.querySelector('.review-navigation');
    
    if (activeSlide && reviewNavigation) {
        const textHeight = activeSlide.offsetHeight;
        reviewNavigation.style.marginTop = `${textHeight + 20}px`;
    }
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
    updateActiveSegment(index);
    updateNavigationPosition();
}

function updateActiveSegment(index) {
    const segmentWidth = 110 / totalSlides;
    const leftPosition = index * segmentWidth;
    activeSegment.setAttribute('width', `${segmentWidth}`);
    activeSegment.setAttribute('x', `${leftPosition}`);
}

function nextReview() {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
    resetAutoSlide();
}

function prevReview() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentIndex);
    resetAutoSlide();
}

function autoSlide() {
    nextReview();
    startAutoSlide();
}

function startAutoSlide() {
    clearTimeout(slideInterval);
    slideInterval = setTimeout(autoSlide, timerMs);
}

function resetAutoSlide() {
    startAutoSlide();
}

function jumpToReview(index) {
    currentIndex = index;
    showSlide(currentIndex);
    resetAutoSlide();
}

document.addEventListener('DOMContentLoaded', function () {
    initSlider();
    updateNavigationPosition();
    window.addEventListener('resize', updateNavigationPosition);
});