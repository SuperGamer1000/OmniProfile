document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // Check for saved user preference, if any, on load of the website
        const currentTheme = localStorage.getItem('theme');
        
        // Apply early to avoid flash if possible
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleBtn.checked = true;
        } else {
            themeToggleBtn.checked = false;
        }

        themeToggleBtn.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Mobile Hamburger Menu Logic
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('change', function() {
            if (this.checked) {
                navLinks.classList.add('mobile-active');
            } else {
                navLinks.classList.remove('mobile-active');
            }
        });
    }

    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    });
});
