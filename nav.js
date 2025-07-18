// Setup navigation and dynamic page loading with fade transition
window.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

    // Load navigation only once
    fetch('nav.html')
        .then(resp => resp.text())
        .then(html => {
            document.getElementById('nav-container').innerHTML = html;
            const menu = document.querySelector('.menu');
            const toggle = menu.querySelector('.menu-toggle');
            toggle.addEventListener('click', () => menu.classList.toggle('open'));
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menu.classList.toggle('open');
                }
            });
            menu.querySelectorAll('.links a').forEach(a => {
                a.addEventListener('click', evt => {
                    evt.preventDefault();
                    menu.classList.remove('open');
                    const url = a.getAttribute('href');
                    history.pushState(null, '', url);
                    setActive(url);
                    loadContent(url);
                });
            });
            const page = location.pathname.split('/').pop() || 'index.html';
            setActive(page);
            // When landing on a page directly, ensure correct content is loaded
            if (page !== 'index.html') loadContent(page);
        });

    // Footer (static)
    fetch('footer.html')
        .then(resp => resp.text())
        .then(html => {
            const container = document.getElementById('footer-container');
            if (container) container.innerHTML = html;
        });

    // Handle browser navigation
    window.addEventListener('popstate', () => {
        const page = location.pathname.split('/').pop() || 'index.html';
        setActive(page);
        loadContent(page);
    });

    function setActive(page) {
        const menu = document.querySelector('.menu');
        if (!menu) return;
        menu.querySelectorAll('.links a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === page);
        });
    }

    function loadContent(url) {
        if (!content) return;
        fetch(url)
            .then(resp => resp.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const main = doc.querySelector('#content > main, main');
                if (!main) return;
                const newHtml = main.innerHTML;
                document.title = doc.title;
                content.classList.add('fade-out');
                content.addEventListener('transitionend', function handler() {
                    content.removeEventListener('transitionend', handler);
                    content.innerHTML = `<main class="card">${newHtml}</main>`;
                    content.classList.remove('fade-out');
                }, { once: true });
            });
    }
});
