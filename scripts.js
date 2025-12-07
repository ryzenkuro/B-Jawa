"use strict";

document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    setupNavbarScroll();
    setupCards();
    setupNavAnchors();
    setupOutsideClickClose();
    setupTeamLogoAnimation();
    setupTeamMembersToggle();
    setupFeaturedContributor();
    if (typeof setupTeamInteractive === 'function') setupTeamInteractive();
});

function initAOS() {
    if (typeof AOS !== 'undefined' && AOS && typeof AOS.init === 'function') {
        AOS.init({ duration: 1000, once: false });
    }
}

function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const threshold = 700; // pixels scrolled before adding 'scrolled' class

    window.addEventListener('scroll', () => {
        if (window.scrollY > threshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setupCards() {
    const cards = Array.from(document.querySelectorAll('.card'));
    if (!cards.length) return;

    // Reset any pre-existing active state
    cards.forEach(card => card.classList.remove('active'));

    // Text content based on card titles
    const clothingContent = {
        'Surjan Sembagi': {
            title: 'Surjan Sembagi',
            description: 'Surjan miturut jinisipun wonten ingkang dipunsebat Surjan Sembagi, utawi ugi asring winastan surjan kembangan, punika sejatosipun busana ingkang milgi dipunagem dening Sampleyandalem ingkang Sinuwun Sri Sultan Hamengkubuwana ingkang jumeneng nata, lan ugi Sri Paduka Kangjeng Gusti Adipati Pakualam ingkang jumeneng nata. Ananging adatipun ugi kaginakaken ing upacara pawiwahan.'
        },
        'Surjan Lurik': {
            title: 'Surjan Lurik',
            description: 'Surjan Lurik adalah busana tradisional Jawa yang terbuat dari kain lurik. Biasanya digunakan dalam acara-acara formal dan memiliki makna filosofis tersendiri dalam kebudayaan Jawa.'
        },
        'Pranakan': {
            title: 'Pranakan',
            description: 'Pranakan merupakan bagian dari busana tradisional Jawa yang memiliki fungsi dan makna khusus dalam tata cara berbusana adat Jawa.'
        },
        'Beskap': {
            title: 'Beskap',
            description: 'Beskap adalah jas tradisional Jawa yang biasanya dipadukan dengan kain batik. Digunakan dalam acara resmi dan upacara adat.'
        },
        'Antari': {
            title: 'Antari',
            description: 'Antari adalah komponen busana Jawa yang melengkapi penampilan tradisional dan memiliki makna filosofis tertentu.'
        },
        'Atèla': {
            title: 'Atèla',
            description: 'Atèla merupakan aksesori atau bagian dari busana Jawa yang memiliki fungsi khusus dalam melengkapi busana tradisional.'
        },
        // New content for wujuding section
        'Parangbarong': {
            title: 'Parangbarong',
            description: 'Parangbarong adalah motif batik yang memiliki makna filosofis dalam budaya Jawa. Motif ini biasanya digunakan dalam busana kejawen untuk acara-acara khusus.'
        },
        'Parangrusak': {
            title: 'Parangrusak',
            description: 'Parangrusak merupakan salah satu motif batik klasik yang memiliki nilai sejarah dan filosofis tinggi dalam tradisi Jawa.'
        },
        'Parangslobog': {
            title: 'Parangslobog',
            description: 'Parangslobog adalah motif batik yang sering digunakan dalam konteks upacara adat Jawa dan memiliki makna simbolis tertentu.'
        },
        'Parang Garuda': {
            title: 'Parang Garuda',
            description: 'Parang Garuda menggabungkan motif parang dengan simbol garuda, menciptakan desain yang kaya akan makna filosofis dalam budaya Jawa.'
        },
        'Kawung ageng': {
            title: 'Kawung ageng',
            description: 'Kawung ageng adalah motif batik tradisional yang memiliki pola geometris dan sering digunakan dalam busana kejawen untuk acara formal.'
        }
    };

    // Create/attach text content and click handlers
    cards.forEach(card => {
        const cardTitleEl = card.querySelector('.card-title');
        if (!cardTitleEl) return;

        const cardTitle = cardTitleEl.textContent.trim();

        let textContent = card.querySelector('.text-content');
        if (!textContent) {
            textContent = document.createElement('div');
            textContent.className = 'text-content';
            card.appendChild(textContent);
        }

        const content = clothingContent[cardTitle];
        if (content) {
            textContent.innerHTML = `<p>${content.description}</p><h3>${content.title}</h3>`;
        } else {
            textContent.innerHTML = `<p>Informasi detail tentang ${cardTitle} akan ditampilkan di sini.</p><h3>${cardTitle}</h3>`;
        }

        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

function setupOutsideClickClose() {
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.card')) {
            document.querySelectorAll('.card.active').forEach(card => card.classList.remove('active'));
        }
    });
}

function setupNavAnchors() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                const offset = 60; // match navbar height
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                // Smooth scroll with custom easing for better animation
                smoothScrollTo(targetPosition, 500);
            }
        });
    });
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Add touch/click/mouseenter support to trigger logo animation
function setupTeamLogoAnimation() {
    const team = document.getElementById('team');
    if (!team) return;

    const photoRing = team.querySelector('.photo-ring');
    const img = photoRing ? photoRing.querySelector('img') : null;
    if (!photoRing || !img) return;

    let running = false;

    function start() {
        if (running) return;
        running = true;
        // Add class (for CSS-driven animation) and inline style as a stronger fallback
        photoRing.classList.add('is-animated');
        try {
            // Inline animation ensures it runs even if stylesheet rules fail to apply
            img.style.animation = 'logoPopFade 900ms cubic-bezier(.2,.9,.2,1) both';
        } catch (err) {
            console.warn('Failed to set inline animation:', err);
        }

        function done() {
            photoRing.classList.remove('is-animated');
            try { img.style.animation = ''; } catch (e) { }
            running = false;
            img.removeEventListener('animationend', done);
        }

        img.addEventListener('animationend', done);

        setTimeout(() => {
            if (running) {
                photoRing.classList.remove('is-animated');
                try { img.style.animation = ''; } catch (e) { }
                running = false;
            }
        }, 1300);
    }

    // Desktop mouseenter (redundant with :hover but ensures class is applied)
    photoRing.addEventListener('mouseenter', start);

    // Touch and click for mobile
    photoRing.addEventListener('touchstart', function () { start(); }, { passive: true });
    photoRing.addEventListener('click', start);
}

function setupTeamInteractive() {
    const team = document.getElementById('team');
    if (!team) return;
    const photoRing = team.querySelector('.photo-ring');
    const img = photoRing ? photoRing.querySelector('img') : null;
    if (!photoRing || !img) return;

    const maxTilt = 12; // degrees

    function onMove(e) {
        const rect = photoRing.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        const px = (x / rect.width) - 0.5; // -0.5 .. 0.5
        const py = (y / rect.height) - 0.5;

        const rotY = px * maxTilt * -1; // invert for natural feel
        const rotX = py * maxTilt;

        img.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
        // move shine a bit
        const shineX = px * 40;
        const shineY = py * 20;
        photoRing.style.setProperty('--shine-x', `${shineX}px`);
        photoRing.style.setProperty('--shine-y', `${shineY}px`);
    }

    function reset() {
        img.style.transform = '';
    }

    photoRing.addEventListener('mousemove', onMove);
    photoRing.addEventListener('mouseleave', reset);
    photoRing.addEventListener('touchstart', function () { 
        photoRing.classList.add('is-animated'); 
        setTimeout(() => photoRing.classList.remove('is-animated'), 1000); 
    }, { passive: true });
}

function setupTeamMembersToggle() {
    const toggleButton = document.getElementById('toggleTeamMembers');
    const teamMembersWrapper = document.getElementById('teamMembersWrapper');

    if (!toggleButton || !teamMembersWrapper) return;

    toggleButton.addEventListener('click', function (e) {
        e.preventDefault();
        const isExpanded = teamMembersWrapper.classList.contains('expanded');

        if (isExpanded) {
            // Collapse
            teamMembersWrapper.classList.remove('expanded');
            toggleButton.textContent = 'See More';

            // Reset all elements to initial state with animation
            const contactSection = document.getElementById('contact');
            const footer = document.querySelector('footer');
            const container = document.querySelector('.container');
            const main = document.querySelector('main');

            // Add animation class to contact section before resetting
            if (contactSection) {
                // Remove all inline styles first
                contactSection.removeAttribute('style');
                // Reset class to original (remove any added classes)
                contactSection.className = 'contact';
                // Ensure data-aos attribute exists with correct value
                contactSection.setAttribute('data-aos', 'fade-up');
                // Remove any data attributes that might have been added
                const dataAttrs = contactSection.getAttributeNames().filter(attr => attr.startsWith('data-') && attr !== 'data-aos');
                dataAttrs.forEach(attr => contactSection.removeAttribute(attr));
                
                // Add animation class for fade-in effect
                contactSection.classList.add('contact-reset-animate');
                // Force reflow to apply changes
                void contactSection.offsetHeight;
            }

            // Reset footer - restore to original state with animation
            if (footer) {
                footer.removeAttribute('style');
                footer.className = '';
                const footerDataAttrs = footer.getAttributeNames().filter(attr => attr.startsWith('data-'));
                footerDataAttrs.forEach(attr => footer.removeAttribute(attr));
                
                // Add animation class for fade-in effect
                footer.classList.add('footer-reset-animate');
                void footer.offsetHeight;
            }

            // Reset container if it has any inline styles
            if (container) {
                container.removeAttribute('style');
                void container.offsetHeight;
            }

            // Reset main if it has any inline styles
            if (main) {
                main.removeAttribute('style');
                void main.offsetHeight;
            }

            // Wait for collapse transition to complete, then trigger animations
            setTimeout(() => {
                // Re-initialize AOS to ensure animations work correctly
                if (typeof AOS !== 'undefined' && AOS) {
                    if (typeof AOS.refresh === 'function') {
                        AOS.refresh();
                    }
                    if (typeof AOS.init === 'function') {
                        AOS.init({
                            duration: 800,
                            once: false, // Allow animation to trigger again
                            offset: 100
                        });
                    }
                }

                // Remove animation classes after animation completes
                setTimeout(() => {
                    if (contactSection) {
                        contactSection.classList.remove('contact-reset-animate');
                    }
                    if (footer) {
                        footer.classList.remove('footer-reset-animate');
                    }
                }, 800);

                // Scroll to team section after everything is reset
                setTimeout(() => {
                    const teamSection = document.getElementById('team');
                    if (teamSection) {
                        const offset = 60;
                        const top = teamSection.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                }, 100);
            }, 650); // Wait for transition (600ms) + small buffer
        } else {
            // Expand
            teamMembersWrapper.classList.add('expanded');
            toggleButton.textContent = 'See Less';

            // Smooth scroll to expanded section
            const offset = 60;
            const top = teamMembersWrapper.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });

            // Re-initialize AOS for newly visible elements
            if (typeof AOS !== 'undefined' && AOS && typeof AOS.refresh === 'function') {
                setTimeout(() => {
                    AOS.refresh();
                }, 400);
            }
        }
    });
}

function setupFeaturedContributor() {
    const featuredSection = document.querySelector('.featured-contributor-section');
    const profileContainer = document.querySelector('.featured-profile-container');
    const profileImage = document.querySelector('.profile-image');

    if (!featuredSection || !profileContainer) return;

    let isHovering = false;

    profileContainer.addEventListener('mouseenter', () => {
        isHovering = true;
    });

    profileContainer.addEventListener('mouseleave', () => {
        isHovering = false;
        if (profileImage) {
            profileImage.style.transform = '';
        }
    });

    profileContainer.addEventListener('mousemove', (e) => {
        if (!isHovering || !profileImage) return;

        const rect = profileContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        profileImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
    });

    profileContainer.addEventListener('click', () => {
        if (profileImage) {
            profileImage.style.animation = 'none';
            setTimeout(() => {
                profileImage.style.animation = 'profilePulse 0.6s ease-out';
            }, 10);
        }
    });
}