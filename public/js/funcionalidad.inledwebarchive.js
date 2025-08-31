// Interactividad para las tarjetas de eventos
document.addEventListener('DOMContentLoaded', () => {
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.addEventListener('click', () => {
            const eventSlug = card.getAttribute('data-event-slug');
            // Redirigir a la página específica del evento
            window.location.href = `/eventos/${eventSlug}`;
        });
    });
});

// Interactividad para las tarjetas de entradas
document.addEventListener('DOMContentLoaded', () => {
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('click', () => {
            const newsSlug = card.getAttribute('data-news-slug');
            // Redirigir a la página específica de la noticia
            window.location.href = `/blog/${newsSlug}`;
        });
    });
});
