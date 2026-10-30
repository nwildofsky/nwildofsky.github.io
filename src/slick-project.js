$('.slick-carousel').slick({
    arrows: true,
    centerMode: true,
    centerPadding: '50px',
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 6500,
    draggable: true,
    focusOnSelect: true,
    infinite: true,
    pauseOnHover: true,
    variableWidth: true,
    adaptiveHeight: true,
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
