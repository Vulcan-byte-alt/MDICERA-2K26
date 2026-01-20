// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// SVG icons for burger and close
const burgerIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
</svg>`;
const closeIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>`;

mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');

    // Toggle button color and icon
    if (!isHidden) {
        // Menu is open - change to close icon with dark color
        mobileMenuBtn.classList.remove('text-white');
        mobileMenuBtn.classList.add('text-gray-800');
        mobileMenuBtn.innerHTML = closeIcon;
    } else {
        // Menu is closed - change back to burger icon with white color
        mobileMenuBtn.classList.remove('text-gray-800');
        mobileMenuBtn.classList.add('text-white');
        mobileMenuBtn.innerHTML = burgerIcon;
    }
});

// Function to close mobile menu and reset button
const closeMobileMenu = () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    mobileMenuBtn.classList.remove('text-gray-800');
    mobileMenuBtn.classList.add('text-white');
    mobileMenuBtn.innerHTML = burgerIcon;
};

// Close mobile menu when clicking on a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu();
    }
});

// Speaker Carousel
const carousel = document.getElementById('speakerCarousel');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const dotsContainer = document.getElementById('carouselDots');

// Check if mobile
const isMobile = () => window.innerWidth < 768;

if (carousel && prevBtn && nextBtn && dotsContainer) {
    const items = carousel.querySelectorAll('.speaker-carousel-item');
    const itemWidth = 176; // 160px width + 16px gap
    let currentIndex = 0;
    let visibleItems = 5;
    let autoScrollInterval;

    // Calculate visible items based on screen width
    const calculateVisibleItems = () => {
        const containerWidth = carousel.parentElement.offsetWidth;
        visibleItems = Math.floor(containerWidth / itemWidth);
        return Math.max(1, visibleItems);
    };

    // Calculate max index
    const getMaxIndex = () => {
        return Math.max(0, items.length - calculateVisibleItems());
    };

    // Create dots
    const createDots = () => {
        dotsContainer.innerHTML = '';
        dotsContainer.style.display = 'flex';

        // For mobile, create dots based on individual items for scroll indication
        const totalDots = isMobile() ? items.length : getMaxIndex() + 1;

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                if (isMobile()) {
                    // On mobile, scroll to the item
                    const item = items[i];
                    if (item) {
                        item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                        updateMobileDots(i);
                    }
                } else {
                    goToSlide(i);
                }
            });
            dotsContainer.appendChild(dot);
        }
    };

    // Update dots for mobile scroll
    const updateMobileDots = (activeIndex) => {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    };

    // Track scroll position on mobile to update dots
    if (isMobile()) {
        const carouselWrapper = carousel.parentElement;
        let scrollTimeout;
        carouselWrapper.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollLeft = carouselWrapper.scrollLeft;
                const itemWidth = 176; // 160px + 16px gap
                const activeIndex = Math.round(scrollLeft / itemWidth);
                updateMobileDots(Math.min(activeIndex, items.length - 1));
            }, 50);
        }, { passive: true });
    }

    // Update dots
    const updateDots = () => {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    // Go to slide (desktop only)
    const goToSlide = (index) => {
        if (isMobile()) return; // Skip on mobile - use native scroll
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        updateDots();
    };

    // Next slide
    const nextSlide = () => {
        if (isMobile()) return;
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0); // Loop back to start
        }
    };

    // Previous slide
    const prevSlide = () => {
        if (isMobile()) return;
        const maxIndex = getMaxIndex();
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(maxIndex); // Loop to end
        }
    };

    // Auto scroll (desktop only)
    const startAutoScroll = () => {
        if (isMobile()) return;
        autoScrollInterval = setInterval(nextSlide, 4000);
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    // Event listeners for desktop
    prevBtn.addEventListener('click', () => {
        stopAutoScroll();
        prevSlide();
        startAutoScroll();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoScroll();
        nextSlide();
        startAutoScroll();
    });

    // Pause on hover (desktop)
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);

    // Resize handler with inline debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createDots();
            if (!isMobile()) {
                goToSlide(Math.min(currentIndex, getMaxIndex()));
            } else {
                carousel.style.transform = 'none';
            }
        }, 200);
    });

    // Initialize
    createDots();
    if (!isMobile()) {
        startAutoScroll();
    }
}

// Speaker Modal Functionality
const speakerModal = document.getElementById('speakerModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModal');
const speakerItems = document.querySelectorAll('.speaker-carousel-item');

// Modal elements
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalTitle = document.getElementById('modalTitle');
const modalDept = document.getElementById('modalDept');
const modalInstitution = document.getElementById('modalInstitution');

// Open modal function
const openSpeakerModal = (speakerData) => {
    if (!speakerModal) return;

    // Populate modal with speaker data
    modalImage.src = speakerData.image;
    modalImage.alt = speakerData.name;
    modalName.textContent = speakerData.name;
    modalTitle.textContent = speakerData.title;

    // Show/hide department if exists
    if (speakerData.dept) {
        modalDept.textContent = speakerData.dept;
        modalDept.classList.remove('hidden');
    } else {
        modalDept.classList.add('hidden');
    }

    modalInstitution.textContent = speakerData.institution;

    // Show modal
    speakerModal.classList.remove('hidden');
    speakerModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Trigger animation
    requestAnimationFrame(() => {
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '1';
    });
};

// Close modal function
const closeSpeakerModal = () => {
    if (!speakerModal) return;

    speakerModal.classList.add('closing');

    setTimeout(() => {
        speakerModal.classList.remove('show', 'closing');
        speakerModal.classList.add('hidden');
        document.body.style.overflow = '';
        modalContent.style.transform = 'scale(0.95)';
        modalContent.style.opacity = '0';
    }, 200);
};

// Add click/tap event to speaker items
if (speakerItems.length > 0 && speakerModal) {
    speakerItems.forEach(item => {
        // Track touch for distinguishing tap vs scroll
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        const handleSpeakerClick = () => {
            const speakerData = {
                name: item.dataset.name,
                title: item.dataset.title,
                dept: item.dataset.dept,
                institution: item.dataset.institution,
                image: item.dataset.image
            };
            openSpeakerModal(speakerData);
        };

        // Desktop click
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            handleSpeakerClick();
        });

        // Mobile touch - track start position
        item.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });

        // Mobile touch - check if it was a tap (not scroll)
        item.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;

            const deltaX = Math.abs(touchEndX - touchStartX);
            const deltaY = Math.abs(touchEndY - touchStartY);

            // If movement is small and duration is short, treat as tap
            if (deltaX < 10 && deltaY < 10 && touchDuration < 300) {
                e.preventDefault();
                handleSpeakerClick();
            }
        }, { passive: false });
    });

    // Close modal on backdrop click/tap
    const handleBackdropClose = (e) => {
        e.stopPropagation();
        closeSpeakerModal();
    };
    modalBackdrop.addEventListener('click', handleBackdropClose);
    modalBackdrop.addEventListener('touchend', handleBackdropClose);

    // Close modal on close button click/tap
    const handleCloseBtn = (e) => {
        e.stopPropagation();
        closeSpeakerModal();
    };
    closeModalBtn.addEventListener('click', handleCloseBtn);
    closeModalBtn.addEventListener('touchend', handleCloseBtn);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && speakerModal.classList.contains('show')) {
            closeSpeakerModal();
        }
    });
}

// Committee Carousel
const committeeCarousel = document.getElementById('committeeCarouselTrack');
const committeePrevBtn = document.getElementById('committeeCarouselPrev');
const committeeNextBtn = document.getElementById('committeeCarouselNext');
const committeeDotsContainer = document.getElementById('committeeCarouselDots');

if (committeeCarousel && committeePrevBtn && committeeNextBtn && committeeDotsContainer) {
    const committeeItems = committeeCarousel.querySelectorAll('.committee-member');
    const committeeItemWidth = 176; // 160px width + 16px gap
    let committeeCurrentIndex = 0;
    let committeeVisibleItems = 5;
    let committeeAutoScrollInterval;

    // Calculate visible items based on screen width
    const calculateCommitteeVisibleItems = () => {
        const containerWidth = committeeCarousel.parentElement.offsetWidth;
        committeeVisibleItems = Math.floor(containerWidth / committeeItemWidth);
        return Math.max(1, committeeVisibleItems);
    };

    // Calculate max index
    const getCommitteeMaxIndex = () => {
        return Math.max(0, committeeItems.length - calculateCommitteeVisibleItems());
    };

    // Create dots
    const createCommitteeDots = () => {
        committeeDotsContainer.innerHTML = '';
        committeeDotsContainer.style.display = 'flex';

        // For mobile, create dots based on individual items for scroll indication
        const totalDots = isMobile() ? committeeItems.length : getCommitteeMaxIndex() + 1;

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                if (isMobile()) {
                    // On mobile, scroll to the item
                    const item = committeeItems[i];
                    if (item) {
                        item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                        updateCommitteeMobileDots(i);
                    }
                } else {
                    goToCommitteeSlide(i);
                }
            });
            committeeDotsContainer.appendChild(dot);
        }
    };

    // Update dots for mobile scroll
    const updateCommitteeMobileDots = (activeIndex) => {
        const dots = committeeDotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    };

    // Track scroll position on mobile to update dots
    if (isMobile()) {
        const committeeCarouselWrapper = committeeCarousel.parentElement;
        let scrollTimeout;
        committeeCarouselWrapper.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollLeft = committeeCarouselWrapper.scrollLeft;
                const itemWidth = 176; // 160px + 16px gap
                const activeIndex = Math.round(scrollLeft / itemWidth);
                updateCommitteeMobileDots(Math.min(activeIndex, committeeItems.length - 1));
            }, 50);
        }, { passive: true });
    }

    // Update dots
    const updateCommitteeDots = () => {
        const dots = committeeDotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === committeeCurrentIndex);
        });
    };

    // Go to slide (desktop only)
    const goToCommitteeSlide = (index) => {
        if (isMobile()) return; // Skip on mobile - use native scroll
        const maxIndex = getCommitteeMaxIndex();
        committeeCurrentIndex = Math.max(0, Math.min(index, maxIndex));
        committeeCarousel.style.transform = `translateX(-${committeeCurrentIndex * committeeItemWidth}px)`;
        updateCommitteeDots();
    };

    // Next slide
    const nextCommitteeSlide = () => {
        if (isMobile()) return;
        const maxIndex = getCommitteeMaxIndex();
        if (committeeCurrentIndex < maxIndex) {
            goToCommitteeSlide(committeeCurrentIndex + 1);
        } else {
            goToCommitteeSlide(0); // Loop back to start
        }
    };

    // Previous slide
    const prevCommitteeSlide = () => {
        if (isMobile()) return;
        const maxIndex = getCommitteeMaxIndex();
        if (committeeCurrentIndex > 0) {
            goToCommitteeSlide(committeeCurrentIndex - 1);
        } else {
            goToCommitteeSlide(maxIndex); // Loop to end
        }
    };

    // Auto scroll (desktop only)
    const startCommitteeAutoScroll = () => {
        if (isMobile()) return;
        committeeAutoScrollInterval = setInterval(nextCommitteeSlide, 4000);
    };

    const stopCommitteeAutoScroll = () => {
        clearInterval(committeeAutoScrollInterval);
    };

    // Event listeners for desktop
    committeePrevBtn.addEventListener('click', () => {
        stopCommitteeAutoScroll();
        prevCommitteeSlide();
        startCommitteeAutoScroll();
    });

    committeeNextBtn.addEventListener('click', () => {
        stopCommitteeAutoScroll();
        nextCommitteeSlide();
        startCommitteeAutoScroll();
    });

    // Pause on hover (desktop)
    committeeCarousel.addEventListener('mouseenter', stopCommitteeAutoScroll);
    committeeCarousel.addEventListener('mouseleave', startCommitteeAutoScroll);

    // Resize handler with inline debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createCommitteeDots();
            if (!isMobile()) {
                goToCommitteeSlide(Math.min(committeeCurrentIndex, getCommitteeMaxIndex()));
            } else {
                committeeCarousel.style.transform = 'none';
            }
        }, 200);
    });

    // Initialize
    createCommitteeDots();
    if (!isMobile()) {
        startCommitteeAutoScroll();
    }
}

// Committee Member Modal Functionality
const committeeMembers = document.querySelectorAll('.committee-member');

// Add click/tap event to committee member items
if (committeeMembers.length > 0 && speakerModal) {
    committeeMembers.forEach(item => {
        // Track touch for distinguishing tap vs scroll
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        const handleCommitteeClick = () => {
            const committeeData = {
                name: item.dataset.name,
                title: item.dataset.title,
                dept: item.dataset.dept || item.dataset.phone || '',
                institution: item.dataset.institution,
                image: item.dataset.image
            };
            openSpeakerModal(committeeData);
        };

        // Desktop click
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            handleCommitteeClick();
        });

        // Mobile touch - track start position
        item.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });

        // Mobile touch - check if it was a tap (not scroll)
        item.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;

            const deltaX = Math.abs(touchEndX - touchStartX);
            const deltaY = Math.abs(touchEndY - touchStartY);

            // If movement is small and duration is short, treat as tap
            if (deltaX < 10 && deltaY < 10 && touchDuration < 300) {
                e.preventDefault();
                handleCommitteeClick();
            }
        }, { passive: false });
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

// Video Player Controls
const videoContainers = document.querySelectorAll('.video-container');

videoContainers.forEach(container => {
    const video = container.querySelector('video');
    const overlay = container.querySelector('.video-play-overlay');

    // Play video on overlay click only (not on controls)
    overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
            video.play();
        }
    });

    // Show/hide controls and overlay based on play state
    video.addEventListener('play', () => {
        overlay.classList.add('hidden');
        video.setAttribute('controls', 'controls');
    });

    video.addEventListener('pause', () => {
        if (video.currentTime !== video.duration) {
            overlay.classList.remove('hidden');
            video.removeAttribute('controls');
        }
    });

    // Show overlay when video ends
    video.addEventListener('ended', () => {
        overlay.classList.remove('hidden');
        video.removeAttribute('controls');
    });
});
