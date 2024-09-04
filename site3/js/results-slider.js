document.addEventListener('DOMContentLoaded', function () {
    const phones = document.querySelectorAll('.phone');
    let currentIndex = 0;
    let slideInterval;

    function updateSlides() {
        phones.forEach((phone, index) => {
            phone.classList.remove('phone-left', 'phone-right', 'active');
            if (index === currentIndex) {
                phone.classList.add('active');
                phone.style.zIndex = "2";
            } else if (index === (currentIndex + 1) % phones.length) {
                phone.classList.add('phone-right');
                phone.style.zIndex = "1";
            } else {
                phone.classList.add('phone-left');
                phone.style.zIndex = "1";
            }
        });
    }

    // Объявляем функции глобально
    window.nextSlide = function() {
        currentIndex = (currentIndex + 1) % phones.length;
        updateSlides();
        resetAutoSlide();
    };

    window.prevSlide = function() {
        currentIndex = (currentIndex - 1 + phones.length) % phones.length;
        updateSlides();
        resetAutoSlide();
    };

    function autoSlide() {
        nextSlide();
        startAutoSlide();
    }

    function startAutoSlide() {
        clearTimeout(slideInterval);
        slideInterval = setTimeout(autoSlide, 5000);
    }

    function resetAutoSlide() {
        startAutoSlide();
    }

    updateSlides();
    startAutoSlide();
});
