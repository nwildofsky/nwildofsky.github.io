// Hero video stage and thumbnail rail on the home page.
//
// What it does: shows one project at a time (a muted looping video, the project's name and
// one-line blurb, and a "Learn More" button). The rail under it has one thumbnail per project.
// The stage moves to the next project every few seconds (the time is --hero-rotate-time in
// stylesheet.css; the thumbnail's progress bar is what counts it down).
//
// What it reads from the HTML (it never contains visible text of its own):
//   - every .project-card inside #project-grid: .project-card-title, .project-card-blurb, its first
//     button (the Learn More link), and the data-video and data-poster attributes
//   - <template id="hero-stage-template"> and <template id="hero-rail-thumb-template"> in index.html,
//     which hold the stage's markup and the button words (Learn More, Pause, Play)
// To add a project to the hero, just add a project card with data-video and data-poster.

const hero = document.getElementById('hero');
const showcase = hero.querySelector('.hero-showcase');
const stage = document.getElementById('hero-stage');
const rail = document.getElementById('hero-rail');
const stageTemplate = document.getElementById('hero-stage-template');
const thumbTemplate = document.getElementById('hero-rail-thumb-template');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ---- Collect the projects from the cards ----
const projects = Array.from(document.querySelectorAll('#project-grid .project-card')).map((card) => ({
    title: card.querySelector('.project-card-title').textContent.trim(),
    blurb: card.querySelector('.project-card-blurb').textContent.trim(),
    link: card.querySelector('.project-card-buttons a').getAttribute('href'),
    video: card.dataset.video,
    poster: card.dataset.poster,
}));

// ---- Build the stage (once) and one thumbnail per project ----
stage.append(stageTemplate.content.cloneNode(true));
const video = stage.querySelector('.hero-stage-video');
const stageLink = stage.querySelector('.hero-stage-link');
const stageTitle = stage.querySelector('.hero-stage-title');
const stageBlurb = stage.querySelector('.hero-stage-blurb');
const stageButton = stage.querySelector('.hero-stage-button');
const toggleButton = stage.querySelector('.hero-stage-toggle');
video.muted = true;   // a video cloned from a template can lose its muted attribute, and browsers only autoplay muted video

const thumbs = projects.map((project, index) => {
    const thumb = thumbTemplate.content.firstElementChild.cloneNode(true);
    thumb.querySelector('img').src = project.poster;
    thumb.setAttribute('aria-label', project.title);
    thumb.addEventListener('click', () => showProject(index));
    rail.append(thumb);
    return thumb;
});

// ---- Showing a project ----
let currentIndex = 0;

function showProject(index) {
    const project = projects[index];
    currentIndex = index;

    stageTitle.textContent = project.title;
    stageBlurb.textContent = project.blurb;
    stageLink.href = project.link;
    stageButton.href = project.link;

    // Only this project's video is ever loaded (the others stay untouched until picked)
    video.poster = project.poster;
    video.src = project.video;
    updatePlayback();

    // Move the highlight and restart the thumbnail's progress bar
    thumbs.forEach((thumb, i) => {
        thumb.classList.remove('is-active');
        thumb.removeAttribute('aria-current');
        if (i === index) {
            void thumb.offsetWidth;   // lets the progress animation start over if the same thumbnail is picked again
            thumb.classList.add('is-active');
            thumb.setAttribute('aria-current', 'true');
        }
    });
}

function showNextProject() {
    showProject((currentIndex + 1) % projects.length);
}

// The progress bar finishing is the signal to move on
rail.addEventListener('animationend', (event) => {
    if (event.target.classList.contains('hero-rail-progress')) {
        showNextProject();
    }
});

// ---- Pausing ----
// The video pauses when the visitor presses the Pause button, the tab is hidden, or the stage is
// scrolled out of view. The rotation also pauses while the pointer or keyboard focus is on the stage.
let pausedByVisitor = false;
let tabHidden = document.hidden;
let outOfView = false;
let pointerOnStage = false;
let focusOnStage = false;

function updatePlayback() {
    const videoShouldPlay = !pausedByVisitor && !tabHidden && !outOfView;
    if (videoShouldPlay) {
        video.play().catch(() => {});   // play() is rejected if a quick pause() interrupts it, which is harmless
    } else {
        video.pause();
    }
    stage.classList.toggle('is-paused-by-visitor', pausedByVisitor);
    showcase.classList.toggle('is-rotation-paused', !videoShouldPlay || pointerOnStage || focusOnStage);
}

toggleButton.addEventListener('click', () => {
    pausedByVisitor = !pausedByVisitor;
    toggleButton.setAttribute('aria-label',
        pausedByVisitor ? toggleButton.dataset.labelPlay : toggleButton.dataset.labelPause);
    updatePlayback();
});

stage.addEventListener('pointerenter', () => { pointerOnStage = true; updatePlayback(); });
stage.addEventListener('pointerleave', () => { pointerOnStage = false; updatePlayback(); });
stage.addEventListener('focusin', () => { focusOnStage = true; updatePlayback(); });
stage.addEventListener('focusout', () => { focusOnStage = false; updatePlayback(); });

document.addEventListener('visibilitychange', () => { tabHidden = document.hidden; updatePlayback(); });

new IntersectionObserver((entries) => {
    outOfView = !entries[0].isIntersecting;
    updatePlayback();
}, { threshold: 0.25 }).observe(stage);

// ---- Reduced motion: the video still plays, but the stage stays on the project it is on ----
function applyReducedMotion() {
    showcase.classList.toggle('is-static', reducedMotion.matches);
}
reducedMotion.addEventListener('change', applyReducedMotion);
applyReducedMotion();

// ---- Start ----
toggleButton.setAttribute('aria-label', toggleButton.dataset.labelPause);
showProject(0);
