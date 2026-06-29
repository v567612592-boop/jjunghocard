document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const header = document.querySelector('.header');
    
    // ==========================================
    // 1. Digital Business Card Flip
    // ==========================================
    const businessCard = document.getElementById('businessCard');
    if (businessCard) {
        businessCard.addEventListener('click', () => {
            businessCard.classList.toggle('flipped');
        });
    }

    // ==========================================
    // 2. Mobile Navigation Toggle
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // Toggle hamburger icon between bars and times (close)
            const icon = navToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        // Close mobile nav when link is clicked
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('open');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            });
        });
    }

    // ==========================================
    // 3. Custom Smooth Navigation Scroll
    // ==========================================
    const navLinksList = document.querySelectorAll('.nav-item, .hero-buttons a, .scroll-indicator');
    navLinksList.forEach(link => {
        link.addEventListener('click', (e) => {
            let targetId = link.getAttribute('href');
            // In case of scroll-indicator icon which isn't an anchor, target #timeline
            if (!targetId && link.classList.contains('scroll-indicator')) {
                targetId = '#timeline';
            }
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const isDesktopSnapping = scrollContainer && window.innerWidth > 992 && window.innerHeight >= 680;
                    
                    if (isDesktopSnapping) {
                        scrollContainer.scrollTo({
                            top: targetSection.offsetTop,
                            behavior: 'smooth'
                        });
                    } else {
                        const headerOffset = 80;
                        const elementPosition = targetSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // ==========================================
    // 4. Scroll Reveal & Active Nav Highlight
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    // Intersection Observer for Active Nav Highlight
    const sectionObserverOptions = {
        root: scrollContainer && window.innerWidth > 992 && window.innerHeight >= 680 ? scrollContainer : null,
        threshold: 0.4,
        rootMargin: "-10% 0px -40% 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${activeId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Reveal Elements on Scroll
    const revealObserverOptions = {
        root: scrollContainer && window.innerWidth > 992 && window.innerHeight >= 680 ? scrollContainer : null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 5. Header Shadow & Padding on Scroll
    // ==========================================
    const updateHeader = () => {
        const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
        const winScroll = window.pageYOffset || document.documentElement.scrollTop;
        const currentScroll = Math.max(scrollTop, winScroll);
        
        if (currentScroll > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
            header.style.padding = '8px 0';
            header.style.background = 'rgba(7, 10, 19, 0.9)';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '16px 0';
            header.style.background = 'rgba(7, 10, 19, 0.75)';
        }
    };
    
    window.addEventListener('scroll', updateHeader);
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updateHeader);
    }
});

// ==========================================
// 6. Click-to-Copy & Toast Notification
// ==========================================
function copyText(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(successMessage))
            .catch(err => {
                console.error('Failed to copy text: ', err);
                fallbackCopyText(text, successMessage);
            });
    } else {
        fallbackCopyText(text, successMessage);
    }
}

function fallbackCopyText(text, successMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast(successMessage);
        } else {
            console.error('Fallback: Copy command was unsuccessful');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
