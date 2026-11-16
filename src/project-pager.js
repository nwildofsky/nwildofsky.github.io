// Count and Previous / Next links on a project page, worked out from the order of the cards on the home page.

// "./project-3.html" and "/project-3" (GitHub Pages can leave off .html) both become "project-3"
const pageName = (path) => path.split('/').pop().replace(/\.html$/, '');

async function fillPager() {
    const response = await fetch('./index.html');
    if (!response.ok) {
        return;
    }
    const home = new DOMParser().parseFromString(await response.text(), 'text/html');

    const links = Array.from(home.querySelectorAll('#project-grid .project-card'))
        .map((card) => card.querySelector('.project-card-buttons a')?.getAttribute('href'))
        .filter((link) => /^\.\/project-.*\.html$/.test(link));
    const position = links.map(pageName).indexOf(pageName(location.pathname));
    const positionSpan = document.getElementById('project-position');
    const totalSpan = document.getElementById('project-total');
    const pagers = Array.from(document.querySelectorAll('.project-bar-pager, .project-pager'));
    if (position === -1 || !positionSpan || !totalSpan || pagers.length === 0) {
        return;
    }

    // Everything is found; from here on nothing can fail, so the page is never half updated
    const previous = links[(position + links.length - 1) % links.length];
    const next = links[(position + 1) % links.length];
    positionSpan.textContent = position + 1;
    totalSpan.textContent = links.length;
    for (const pager of pagers) {
        const [previousLink, nextLink] = pager.querySelectorAll('a');
        previousLink.setAttribute('href', previous);
        nextLink.setAttribute('href', next);
    }
    document.documentElement.classList.add('project-pager-ready');
}

fillPager().catch(() => {});   // any failure (offline, blocked, bad file) just leaves the page as it is
