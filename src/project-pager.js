// Count and Previous / Next links on a project page.
//
// What it does: works out where this project sits among the project cards on the home page, then
// fills in the count ("3 of 12") and points Previous and Next (top bar and bottom of the page) at the
// neighbouring projects, going around from the last project back to the first. Adding, removing or
// reordering a card on the home page is all it takes; no project page needs editing.
//
// If it cannot do this (scripts off or blocked, offline, page opened straight from disk, this page
// has no card), it changes nothing. The count and the Previous / Next links stay hidden by
// project.css until this file adds the class "project-pager-ready" to <html>, so the top bar then
// only shows "All projects", which always works.
//
// What it reads from the HTML (it never contains visible text of its own; it only writes numbers):
//   - index.html: the first button (Learn More) of every .project-card in #project-grid. Only cards
//     that link to a project-*.html page count, so placeholder cards (href="#") are skipped.
//   - this page: the empty spans #project-position and #project-total, and the first (Previous) and
//     second (Next) link inside .project-bar-pager and .project-pager. The word "of" is in the page.

// "./project-3.html" and "/project-3" (GitHub Pages can leave off .html) both become "project-3"
const pageName = (path) => path.split('/').pop().replace(/\.html$/, '');

async function fillPager() {
    const response = await fetch('./index.html');
    if (!response.ok) return;
    const home = new DOMParser().parseFromString(await response.text(), 'text/html');

    const links = Array.from(home.querySelectorAll('#project-grid .project-card'))
        .map((card) => card.querySelector('.project-card-buttons a')?.getAttribute('href'))
        .filter((link) => /^\.\/project-.*\.html$/.test(link));
    const position = links.map(pageName).indexOf(pageName(location.pathname));
    const positionSpan = document.getElementById('project-position');
    const totalSpan = document.getElementById('project-total');
    const pagers = Array.from(document.querySelectorAll('.project-bar-pager, .project-pager'));
    if (position === -1 || !positionSpan || !totalSpan || pagers.length === 0) return;

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
