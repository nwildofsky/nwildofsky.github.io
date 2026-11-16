// Menu button for the narrow (phone) layout of the top bar.

const nav = document.getElementById('site-nav');
const menuButton = nav.querySelector('.site-nav-menu-button');

function setOpen(isOpen) {
    nav.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
}

menuButton.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
});

// Links to #sections on the same page do not reload the page, so the dropdown has to close itself
nav.addEventListener('click', (event) => {
    if (event.target.closest('.site-nav-links a')) {
        setOpen(false);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        menuButton.focus();
    }
});
