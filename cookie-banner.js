(function() {
    function createBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <p>Az oldal cookie-kat használ a jobb felhasználói élmény érdekében. Részletek a <a href="cookie.html">sütiszabályzatban</a>.</p>
            <div class="buttons">
                <button class="accept">Elfogadom</button>
                <button class="decline">Elutasítom</button>
            </div>`;
        banner.querySelector('.accept').addEventListener('click', () => {
            setConsent('accepted');
        });
        banner.querySelector('.decline').addEventListener('click', () => {
            setConsent('rejected');
        });
        document.body.appendChild(banner);
        return banner;
    }

    function setConsent(value) {
        try {
            localStorage.setItem('cookie_consent', value);
        } catch (_) {}
        const b = document.querySelector('.cookie-banner');
        if (b) b.remove();
    }

    function showBanner() {
        try {
            if (!localStorage.getItem('cookie_consent')) {
                createBanner();
            }
        } catch (_) {
            createBanner();
        }
    }

    window.resetCookieConsent = function() {
        try {
            localStorage.removeItem('cookie_consent');
        } catch (_) {}
        location.reload();
    };

    window.addEventListener('DOMContentLoaded', showBanner);
})();
