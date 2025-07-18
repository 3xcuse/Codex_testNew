// Load navigation bar and setup mobile menu
window.addEventListener('DOMContentLoaded', () => {
    fetch('nav.html')
        .then(resp => resp.text())
        .then(html => {
            document.getElementById('nav-container').innerHTML = html;
            const menu = document.querySelector('.menu');
            const toggle = menu.querySelector('.menu-toggle');
            toggle.addEventListener('click', () => {
                menu.classList.toggle('open');
            });
            menu.querySelectorAll('.links a').forEach(a => {
                a.addEventListener('click', () => menu.classList.remove('open'));
            });
            const page = location.pathname.split('/').pop();
            const active = menu.querySelector(`a[href="${page}"]`);
            if (active) active.classList.add('active');
        });
});
