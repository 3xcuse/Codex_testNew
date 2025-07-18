// Setup navigation and dynamic page loading with fade transition
window.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

    // Load navigation only once
    fetch('nav.html')
        .then(resp => {
            if (!resp.ok) throw new Error(`Failed to load navigation: ${resp.status}`);
            return resp.text();
        })
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
            const search = menu.querySelector('.search-container');
            if (search) {
                const searchToggle = search.querySelector('.search-toggle');
                const input = search.querySelector('.search-input');
                const results = document.createElement('div');
                results.className = 'search-results';
                results.setAttribute('role', 'listbox');
                search.appendChild(results);
                let searchTimer;
                let activeIndex = -1;

                const toggleSearch = () => {
                    search.classList.toggle('open');
                    if (search.classList.contains('open')) {
                        input.focus();
                    } else {
                        results.innerHTML = '';
                        activeIndex = -1;
                    }
                };

                searchToggle.addEventListener('click', toggleSearch);
                searchToggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSearch();
                    }
                });

                input.addEventListener('input', () => {
                    clearTimeout(searchTimer);
                    searchTimer = setTimeout(() => {
                        performSearch(input.value.trim());
                    }, 1000);
                });

                input.addEventListener('keydown', (e) => {
                    const items = Array.from(results.querySelectorAll('a'));
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (!items.length) return;
                        activeIndex = (activeIndex + 1) % items.length;
                        updateSelection(items);
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (!items.length) return;
                        activeIndex = (activeIndex - 1 + items.length) % items.length;
                        updateSelection(items);
                    } else if (e.key === 'Enter' && activeIndex >= 0) {
                        e.preventDefault();
                        items[activeIndex].click();
                    }
                });

                function updateSelection(items) {
                    items.forEach((el, i) => {
                        const selected = i === activeIndex;
                        el.classList.toggle('selected', selected);
                        el.setAttribute('aria-selected', selected);
                        if (selected) {
                            el.scrollIntoView({ block: 'nearest' });
                        }
                    });
                }

                async function performSearch(query) {
                    results.innerHTML = '';
                    activeIndex = -1;
                    if (!query) return;
                    const pages = ['index.html', 'foci.html', 'uszas.html', 'ur.html'];
                    const matches = [];
                    await Promise.all(pages.map(async page => {
                        try {
                            const resp = await fetch(page);
                            if (!resp.ok) return;
                            const text = await resp.text();
                            const doc = new DOMParser().parseFromString(text, 'text/html');
                            if (doc.body.textContent.toLowerCase().includes(query.toLowerCase())) {
                                const title = doc.querySelector('title');
                                matches.push({ url: page, title: title ? title.textContent : page });
                            }
                        } catch (_) {
                            /* ignore */
                        }
                    }));

                    if (!matches.length) {
                        results.textContent = 'Nincs találat';
                        return;
                    }

                    matches.forEach(match => {
                        const a = document.createElement('a');
                        a.href = match.url;
                        a.textContent = match.title;
                        a.setAttribute('role', 'option');
                        a.addEventListener('click', (evt) => {
                            evt.preventDefault();
                            search.classList.remove('open');
                            results.innerHTML = '';
                            history.pushState(null, '', match.url);
                            setActive(match.url);
                            loadContent(match.url);
                        });
                        results.appendChild(a);
                    });
                }
            }
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
        })
        .catch(err => {
            console.error(err);
            const container = document.getElementById('nav-container');
            if (container) container.textContent = 'Navigation failed to load.';
        });

    // Footer (static)
    fetch('footer.html')
        .then(resp => {
            if (!resp.ok) throw new Error(`Failed to load footer: ${resp.status}`);
            return resp.text();
        })
        .then(html => {
            const container = document.getElementById('footer-container');
            if (container) {
                container.innerHTML = html;
                if (window.feather) window.feather.replace(container);
            }
        })
        .catch(err => {
            console.error(err);
            const container = document.getElementById('footer-container');
            if (container) container.textContent = 'Footer failed to load.';
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
            .then(resp => {
                if (!resp.ok) throw new Error(`Failed to load ${url}: ${resp.status}`);
                return resp.text();
            })
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
            })
            .catch(err => {
                console.error(err);
                content.innerHTML = '<main class="card">Failed to load content.</main>';
                content.classList.remove('fade-out');
            });
    }
});
