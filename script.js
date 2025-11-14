// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
});

// Close mobile menu when clicking on a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    });
});

// Close mobile menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
});

// Toggle Speakers
const toggleBtn = document.getElementById('toggleSpeakersBtn');
const moreSpeakers = document.getElementById('moreSpeakers');
const toggleIcon = document.getElementById('toggleIcon');

if (toggleBtn && moreSpeakers) {
    toggleBtn.addEventListener('click', () => {
        moreSpeakers.classList.toggle('hidden');
        toggleIcon.classList.toggle('rotate-180');

        const btnText = toggleBtn.querySelector('span');
        if (moreSpeakers.classList.contains('hidden')) {
            btnText.textContent = 'View All Speakers';
        } else {
            btnText.textContent = 'Show Less';
            // Scroll to the button smoothly
            setTimeout(() => {
                toggleBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
}

// Toggle Themes
const toggleThemesBtn = document.getElementById('toggleThemesBtn');
const moreThemes = document.getElementById('moreThemes');
const toggleThemesIcon = document.getElementById('toggleThemesIcon');

if (toggleThemesBtn && moreThemes) {
    toggleThemesBtn.addEventListener('click', () => {
        moreThemes.classList.toggle('hidden');
        toggleThemesIcon.classList.toggle('rotate-180');

        const btnText = toggleThemesBtn.querySelector('span');
        if (moreThemes.classList.contains('hidden')) {
            btnText.textContent = 'View All Themes';
        } else {
            btnText.textContent = 'Show Less';
            // Scroll to the button smoothly
            setTimeout(() => {
                toggleThemesBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
}

// Toggle Committee
const toggleCommitteeBtn = document.getElementById('toggleCommitteeBtn');
const moreCommittee = document.getElementById('moreCommittee');
const toggleCommitteeIcon = document.getElementById('toggleCommitteeIcon');

if (toggleCommitteeBtn && moreCommittee) {
    toggleCommitteeBtn.addEventListener('click', () => {
        moreCommittee.classList.toggle('hidden');
        toggleCommitteeIcon.classList.toggle('rotate-180');

        const btnText = toggleCommitteeBtn.querySelector('span');
        if (moreCommittee.classList.contains('hidden')) {
            btnText.textContent = 'View All Committee Members';
        } else {
            btnText.textContent = 'Show Less';
            // Scroll to the button smoothly
            setTimeout(() => {
                toggleCommitteeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// Observe all fade-in-up elements
const fadeElements = document.querySelectorAll('.fade-in-up');
fadeElements.forEach(element => {
    element.classList.add('fade-in-section');
    observer.observe(element);
});

// Observe theme cards for staggered animation
const themeCards = document.querySelectorAll('.theme-card');
themeCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    card.classList.add('fade-in-section');
    observer.observe(card);
});

// Navbar background change on scroll
const navbar = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > 50) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }

    // Hide navbar on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Add transition to navbar
navbar.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

// Active section highlighting in navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNavigation = () => {
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active-nav');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active-nav');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNavigation);

// Parallax effect for hero section
const heroSection = document.querySelector('section');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (heroSection && scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroSection.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Counter animation for stats (if needed in future)
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add hover effect to table rows
const tableRows = document.querySelectorAll('tbody tr');
tableRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });

    row.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Scroll to top button (optional - can be added later)
const createScrollToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
    `;
    button.className = 'fixed bottom-8 right-8 bg-teal-600 text-white p-4 rounded-full shadow-lg opacity-0 pointer-events-none transition-all duration-300 hover:bg-teal-700 z-50';
    button.id = 'scroll-to-top';

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.classList.remove('opacity-0', 'pointer-events-none');
            button.classList.add('opacity-100');
        } else {
            button.classList.add('opacity-0', 'pointer-events-none');
            button.classList.remove('opacity-100');
        }
    });
};

// Initialize scroll to top button
createScrollToTop();

// Form validation (for future contact forms)
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Copy to clipboard functionality (for email addresses)
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Optional: Add copy to clipboard on click
        const email = link.getAttribute('href').replace('mailto:', '');

        // Show a tooltip or notification that email was copied (optional enhancement)
        link.setAttribute('title', 'Click to send email');
    });
});

// Lazy loading images (if images are added later)
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.classList.remove('loading');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
};

// Initialize lazy loading
lazyLoadImages();

// Performance optimization: Debounce scroll events
const debounce = (func, wait = 10) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply debounce to scroll-heavy functions
const debouncedHighlight = debounce(highlightNavigation, 10);
window.addEventListener('scroll', debouncedHighlight);

// Easter egg: Konami code (optional fun feature)
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiPattern.length);

    if (konamiCode.join('') === konamiPattern.join('')) {
        // Add a fun animation or message
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }
});

// Accessibility: Skip to main content
const createSkipLink = () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded';
    document.body.insertBefore(skipLink, document.body.firstChild);
};

createSkipLink();

// Console message for developers
console.log(`
%c🎓 MDICERA 2K26 🎓
%cMulti-Disciplinary International Conference on Emerging Research Areas
%cSustainable Wisdom: Tradition, Technology & Transformation
%c21 & 22 January 2026 | Pazhanji, Thrissur, Kerala

%cInterested in the conference? Visit conference@mdcollege.edu.in
`,
    'color: #0d9488; font-size: 24px; font-weight: bold;',
    'color: #2563eb; font-size: 16px;',
    'color: #7c3aed; font-size: 14px; font-style: italic;',
    'color: #4b5563; font-size: 12px;',
    'color: #059669; font-size: 14px; font-weight: bold;'
);
