const videos = document.querySelectorAll('video');
$('.slick-carousel').on('init', function (event, slick) {
    slick.$slides[0].querySelector('video').play();
    slick.$slides[0].classList.add('centered');
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
    //adaptiveHeight: true,
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

$('.slick-carousel').on('beforeChange', focusCenter);
$('.slick-carousel').on('afterChange', setLinks)

function focusCenter(event, slick, currentSlide, nextSlide) {
    if (currentSlide != nextSlide /*&& (Math.abs(nextSlide - currentSlide) == 1 || Math.abs(nextSlide - currentSlide) == videos.length - 1)*/) {
        slick.$slides[currentSlide % videos.length].querySelector('video').pause();
        slick.$slides[currentSlide % videos.length].classList.remove('centered');
        slick.$slides[currentSlide % videos.length].querySelector('a').href = 'javascript:void(0);';
        slick.$slides[nextSlide % videos.length].querySelector('video').play();
        slick.$slides[nextSlide % videos.length].classList.add('centered');
    }
}

function setLinks(event, slick, currentSlide) {
    slick.$slides[currentSlide].querySelector('a').href = getHrefFromIndex(currentSlide);
}

function getHrefFromIndex(index) {
    let href = '';
    if (index == 0) {
        href = '#projects';
    }
    else if (index > 0) {
        href = '#project-' + (index+1)
    }
    return href;
}