// Menu button for the narrow (phone) layout of the top bar.
//
// Relies on this markup (the same on every page):
//   <nav id="site-nav"> ... <button class="site-nav-menu-button"> ... <ul class="site-nav-links"> ... </nav>
// At 760px and below the CSS hides the links; this file adds or removes the
// "is-open" class on #site-nav, which shows them as a dropdown.
// It never creates or changes any visible text.

const nav = document.getElementById('site-nav');
const menuButton = nav.querySelector('.site-nav-menu-button');

function setOpen(isOpen) {
    nav.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
}

// The Menu button opens and closes the dropdown
menuButton.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
});

// Choosing a link closes the dropdown (matters for links to #sections on the same page)
nav.addEventListener('click', (event) => {
    if (event.target.closest('.site-nav-links a')) {
        setOpen(false);
    }
});

// Escape closes the dropdown and returns focus to the Menu button
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        menuButton.focus();
    }
});
