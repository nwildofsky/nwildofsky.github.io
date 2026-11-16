// Media gallery on a project page: one large item with a row of thumbnails under it.

const mainArea = document.querySelector('.project-media-main');
const thumbs = Array.from(document.querySelectorAll('.project-media-thumb'));

function makeImage(thumbImage) {
    const image = document.createElement('img');
    image.src = thumbImage.getAttribute('src');
    image.alt = thumbImage.alt;
    return image;
}

function makeVideo(thumb, thumbImage) {
    const video = document.createElement('video');
    video.controls = true;
    video.muted = true;       // browsers only autoplay muted video
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.poster = thumbImage.getAttribute('src');
    video.src = thumb.dataset.video;
    video.setAttribute('aria-label', thumb.textContent.trim());   // the button's hidden word ("Video") names the player too
    return video;
}

function showItem(index) {
    const thumb = thumbs[index];
    const thumbImage = thumb.querySelector('img');
    pausedByScript = false;
    // Replacing the old item also removes (and so stops) a video that was playing
    mainArea.replaceChildren(thumb.dataset.video ? makeVideo(thumb, thumbImage) : makeImage(thumbImage));
    thumbs.forEach((other, i) => other.setAttribute('aria-pressed', String(i === index)));
}

// ---- Pause while not visible; only resume a video this script paused ----
let areaVisible = true;
let pausedByScript = false;

function updateVideoPlayback() {
    const video = mainArea.querySelector('video');
    if (!video) {
        return;
    }
    const shouldPlay = areaVisible && !document.hidden;
    if (!shouldPlay && !video.paused) {
        video.pause();
        pausedByScript = true;
    } else if (shouldPlay && pausedByScript) {
        pausedByScript = false;
        video.play().catch(() => {});   // play() is rejected if a quick pause() interrupts it, which is harmless
    }
}

new IntersectionObserver((entries) => {
    areaVisible = entries[0].isIntersecting;
    updateVideoPlayback();
}, { threshold: 0.25 }).observe(mainArea);
document.addEventListener('visibilitychange', updateVideoPlayback);

// ---- Start ----
thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => showItem(index)));

if (thumbs.length > 0) {
    showItem(0);
}
