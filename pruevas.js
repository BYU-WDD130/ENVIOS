// Configuración básica para simular la interactividad del slider/carrusel
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Datos simulados para las diapositivas
    const slides = [
        {
            title: "0 % aranceles,<br>100 % ahorro",
            text: "Tú haces las compras, nosotros cubrimos los impuestos y aranceles."
        },
        {
            title: "Conoce nuestras líneas<br>de atención directa",
            text: "¿Necesitas comunicarte con nosotros? Estamos listos para ayudarte."
        }
    ];

    let currentSlide = 0;
    const titleElement = document.querySelector('.hero-text h1');
    const textElement = document.querySelector('.hero-text p');

    function updateSlide(index) {
        titleElement.innerHTML = slides[index].title;
        textElement.textContent = slides[index].text;
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide(currentSlide);
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide(currentSlide);
    });
});