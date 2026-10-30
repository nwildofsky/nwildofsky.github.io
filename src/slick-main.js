// Mark a slide as the centered one (or not) and play or pause its video to match
function setCentered(slide, isCentered) {
    const video = slide.querySelector('video');
    slide.classList.toggle('centered', isCentered);
    if (isCentered) {
        // play() rejects when a quick pause() interrupts it, which is harmless
        video.play().catch(() => {});
    }
    else {
        video.pause();
    }
}

$('.slick-carousel').on('init', function (event, slick) {
    setCentered(slick.$slides[0], true);
});

$('.slick-carousel').slick({
    arrows: true,
    centerMode: true,
    centerPadding: '50px',
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 14500,
    draggable: true,
    focusOnSelect: true,
    infinite: true,
    pauseOnHover: true,
    variableWidth: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 410,
            settings: {
                centerPadding: '10px',
                slidesToShow: 3
            }
        }
    ]
});

$('.slick-carousel').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    if (currentSlide != nextSlide) {
        setCentered(slick.$slides[currentSlide], false);
        setCentered(slick.$slides[nextSlide], true);
    }
});

// Each slide links to its project in the markup, but only the centered slide may follow it.
// Clicking any other slide just brings it to the center (focusOnSelect). This listener captures
// the click so it runs before Slick re-centers the clicked slide.
document.querySelector('.slick-carousel').addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (link && !link.closest('.slick-slide').classList.contains('slick-center')) {
        event.preventDefault();
    }
}, true);
