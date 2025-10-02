// Fieles e Idóneos Foundation - Landing Page JavaScript
// All functionality implemented in vanilla JavaScript

(function() {
    'use strict';

    // ========================================
    // 1. LANGUAGE TOGGLE
    // ========================================

    const languageToggle = document.getElementById('language-toggle');
    const currentLang = localStorage.getItem('language') || 'es';

    // Initialize language on page load
    function initLanguage() {
        setLanguage(currentLang);
    }

    // Set language and update UI
    function setLanguage(lang) {
        // Hide all language-specific elements
        document.querySelectorAll('[data-lang-es]').forEach(el => {
            el.style.display = lang === 'es' ? '' : 'none';
        });
        document.querySelectorAll('[data-lang-en]').forEach(el => {
            el.style.display = lang === 'en' ? '' : 'none';
        });

        // Update toggle button text
        if (languageToggle) {
            languageToggle.textContent = lang === 'es' ? 'EN' : 'ES';
            languageToggle.setAttribute('aria-label', `Switch to ${lang === 'es' ? 'English' : 'Spanish'}`);
        }

        // Store preference
        localStorage.setItem('language', lang);
    }

    // Toggle language event listener
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            const newLang = localStorage.getItem('language') === 'es' ? 'en' : 'es';
            setLanguage(newLang);
        });
    }

    // ========================================
    // 2. DONATION MODAL
    // ========================================

    const donationModal = document.getElementById('donation-modal');
    const donateButtons = document.querySelectorAll('.donate-btn, [data-donate-trigger]');
    const closeModalBtn = document.querySelector('.close-modal');
    const donationTypeButtons = document.querySelectorAll('.donation-type-btn');
    const donationAmountButtons = document.querySelectorAll('.donation-amount-btn');

    // Open modal
    function openDonationModal() {
        if (donationModal) {
            donationModal.classList.add('active');
            donationModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Focus first focusable element in modal
            const firstFocusable = donationModal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    }

    // Close modal
    function closeDonationModal() {
        if (donationModal) {
            donationModal.classList.remove('active');
            donationModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // Event listeners for opening modal
    donateButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openDonationModal();
        });
    });

    // Event listener for closing modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDonationModal);
    }

    // Click outside modal to close
    if (donationModal) {
        donationModal.addEventListener('click', (e) => {
            if (e.target === donationModal) {
                closeDonationModal();
            }
        });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && donationModal && donationModal.classList.contains('active')) {
            closeDonationModal();
        }
    });

    // Toggle between one-time and monthly donations
    donationTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            donationTypeButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        });
    });

    // Highlight selected donation amount
    donationAmountButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            donationAmountButtons.forEach(b => {
                b.classList.remove('selected');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('selected');
            btn.setAttribute('aria-pressed', 'true');
        });
    });

    // ========================================
    // 3. SMOOTH SCROLLING
    // ========================================

    const navLinks = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scroll to anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            // Skip empty anchors
            if (targetId === '#' || targetId === '#!') return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                e.preventDefault();

                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });

    // Update active navigation item on scroll
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Throttle scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNav, 100);
    });

    // ========================================
    // 4. MOBILE MENU
    // ========================================

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a[href^="#"]');

    // Toggle mobile menu
    function toggleMobileMenu() {
        if (mobileMenu) {
            const isOpen = mobileMenu.classList.toggle('active');

            if (mobileMenuToggle) {
                mobileMenuToggle.classList.toggle('active');
                mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            }

            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 300);
        });
    });

    // ========================================
    // 5. TESTIMONIALS CAROUSEL
    // ========================================

    const testimonialsContainer = document.querySelector('.testimonials-container');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    let currentTestimonial = 0;
    let testimonialInterval;
    let isTestimonialPaused = false;

    // Show specific testimonial
    function showTestimonial(index) {
        if (!testimonialItems.length) return;

        // Ensure index is within bounds
        if (index >= testimonialItems.length) {
            currentTestimonial = 0;
        } else if (index < 0) {
            currentTestimonial = testimonialItems.length - 1;
        } else {
            currentTestimonial = index;
        }

        // Hide all testimonials
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active');
            item.setAttribute('aria-hidden', 'true');

            if (i === currentTestimonial) {
                item.classList.add('active');
                item.setAttribute('aria-hidden', 'false');
            }
        });
    }

    // Next testimonial
    function nextTestimonial() {
        showTestimonial(currentTestimonial + 1);
    }

    // Previous testimonial
    function previousTestimonial() {
        showTestimonial(currentTestimonial - 1);
    }

    // Auto-rotate testimonials
    function startTestimonialRotation() {
        testimonialInterval = setInterval(() => {
            if (!isTestimonialPaused) {
                nextTestimonial();
            }
        }, 5000);
    }

    // Stop rotation
    function stopTestimonialRotation() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
        }
    }

    // Event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            previousTestimonial();
            stopTestimonialRotation();
            startTestimonialRotation();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextTestimonial();
            stopTestimonialRotation();
            startTestimonialRotation();
        });
    }

    // Pause on hover
    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('mouseenter', () => {
            isTestimonialPaused = true;
        });

        testimonialsContainer.addEventListener('mouseleave', () => {
            isTestimonialPaused = false;
        });
    }

    // Keyboard navigation for carousel
    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                previousTestimonial();
                stopTestimonialRotation();
                startTestimonialRotation();
            } else if (e.key === 'ArrowRight') {
                nextTestimonial();
                stopTestimonialRotation();
                startTestimonialRotation();
            }
        });
    }

    // Initialize testimonials
    if (testimonialItems.length > 0) {
        showTestimonial(0);
        startTestimonialRotation();
    }

    // ========================================
    // 6. FORM VALIDATION
    // ========================================

    const volunteerForm = document.getElementById('volunteer-form');
    const newsletterForm = document.getElementById('newsletter-form');

    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        let errorElement = formGroup.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
    }

    // Clear error message
    function clearError(input) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');

        if (errorElement) {
            errorElement.remove();
        }

        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
    }

    // Volunteer form validation
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = volunteerForm.querySelector('[name="name"]');
            const emailInput = volunteerForm.querySelector('[name="email"]');
            let isValid = true;

            // Clear previous errors
            volunteerForm.querySelectorAll('input').forEach(clearError);

            // Validate name
            if (nameInput && !nameInput.value.trim()) {
                const lang = localStorage.getItem('language') || 'es';
                const message = lang === 'es' ? 'Por favor ingrese su nombre' : 'Please enter your name';
                showError(nameInput, message);
                isValid = false;
            }

            // Validate email
            if (emailInput) {
                if (!emailInput.value.trim()) {
                    const lang = localStorage.getItem('language') || 'es';
                    const message = lang === 'es' ? 'Por favor ingrese su correo electrónico' : 'Please enter your email';
                    showError(emailInput, message);
                    isValid = false;
                } else if (!isValidEmail(emailInput.value.trim())) {
                    const lang = localStorage.getItem('language') || 'es';
                    const message = lang === 'es' ? 'Por favor ingrese un correo electrónico válido' : 'Please enter a valid email';
                    showError(emailInput, message);
                    isValid = false;
                }
            }

            // If valid, submit form (you can add AJAX submission here)
            if (isValid) {
                const lang = localStorage.getItem('language') || 'es';
                const successMessage = lang === 'es'
                    ? 'Gracias por registrarte como voluntario. Te contactaremos pronto.'
                    : 'Thank you for signing up as a volunteer. We will contact you soon.';

                alert(successMessage);
                volunteerForm.reset();
            }
        });

        // Real-time validation
        volunteerForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim()) {
                    clearError(input);
                }
            });
        });
    }

    // Newsletter form validation
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = newsletterForm.querySelector('[name="email"]');
            let isValid = true;

            // Clear previous errors
            clearError(emailInput);

            // Validate email
            if (emailInput) {
                if (!emailInput.value.trim()) {
                    const lang = localStorage.getItem('language') || 'es';
                    const message = lang === 'es' ? 'Por favor ingrese su correo electrónico' : 'Please enter your email';
                    showError(emailInput, message);
                    isValid = false;
                } else if (!isValidEmail(emailInput.value.trim())) {
                    const lang = localStorage.getItem('language') || 'es';
                    const message = lang === 'es' ? 'Por favor ingrese un correo electrónico válido' : 'Please enter a valid email';
                    showError(emailInput, message);
                    isValid = false;
                }
            }

            // If valid, submit form
            if (isValid) {
                const lang = localStorage.getItem('language') || 'es';
                const successMessage = lang === 'es'
                    ? 'Gracias por suscribirte a nuestro boletín.'
                    : 'Thank you for subscribing to our newsletter.';

                alert(successMessage);
                newsletterForm.reset();
            }
        });
    }

    // ========================================
    // 7. SCROLL ANIMATIONS
    // ========================================

    // Fade in sections using Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-in, .program-card, .impact-stat, .testimonial-item');

    const fadeObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Animate counter numbers for impact stats
    const counterElements = document.querySelectorAll('.counter');
    let hasCounterAnimated = false;

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target') || element.textContent);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    // Observe impact section for counter animation
    const impactSection = document.querySelector('#impact, .impact-section');

    if (impactSection && counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounterAnimated) {
                    hasCounterAnimated = true;
                    counterElements.forEach(counter => {
                        animateCounter(counter);
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(impactSection);
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    // Initialize language on page load
    initLanguage();

    // Trap focus within modal when open
    if (donationModal) {
        donationModal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && donationModal.classList.contains('active')) {
                const focusableElements = donationModal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    // Add smooth scroll behavior to document
    document.documentElement.style.scrollBehavior = 'smooth';

    // Log initialization complete
    console.log('Fieles e Idóneos Foundation - JavaScript initialized');

})();
