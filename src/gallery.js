// Media gallery on a project page: one large item with a row of thumbnails under it.
//
// What it does: clicking a thumbnail shows that item in the large area. An image thumbnail
// shows the same image; a video thumbnail shows its video with the browser's own controls.
// A video starts by itself, muted and looping (browsers only allow autoplay when muted); the
// controls let the visitor pause it or turn the sound on. It pauses while it is scrolled out
// of view or the tab is hidden, and it stops loading as soon as another thumbnail is picked.
//
// What it reads from the HTML (it never contains visible text of its own):
//   - <div class="project-media-main">: the empty large area
//   - every <button class="project-media-thumb"> in <ul class="project-media-thumbs">, in order.
//     Its <img> gives the picture (and the alt text). If the button has a data-video attribute,
//     the item is a video and the <img> is only the preview picture shown before it plays.
// To add an image or a video, copy a thumbnail <li> in the page. The first thumbnail shows first.

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

// ---- Pause the video while nobody can see it (and only resume it if this script paused it) ----
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
