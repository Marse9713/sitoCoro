document.addEventListener('DOMContentLoaded', function () {

    // --- Slideshow ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    let timer;

    function showSlide(n) {
        slides.forEach(s => s.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        clearTimeout(timer);
        timer = setTimeout(() => showSlide(currentSlide + 1), 5000);
    }

    if (slides.length > 0) showSlide(0);

    // --- Navigazione ---
    const pages = document.querySelectorAll('.page');

    document.querySelectorAll('.sidebar a[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            pages.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(link.dataset.page);
            if (target) target.classList.add('active');
            if (sidebar.classList.contains('open')) sidebar.classList.remove('open');
        });
    });

    // --- Hamburger ---
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');

    hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));

    // --- Parallax ---
    window.addEventListener('scroll', () => {
        const img = document.querySelector('.hero-image img');
        if (img) img.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    });

});