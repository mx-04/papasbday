// Slideshow functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let autoPlayInterval;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateIndicators();
    updateSlideCounter();
    startAutoPlay();
    setupImageInteractions();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
        if (e.key === 'Escape') closeModal();
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    const slideshowWrapper = document.querySelector('.slideshow-wrapper');
    
    slideshowWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    slideshowWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only trigger if horizontal swipe is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX < -50) {
                changeSlide(1); // Swipe left - next
            }
            if (deltaX > 50) {
                changeSlide(-1); // Swipe right - previous
            }
        }
    }
    
    // Pause autoplay on hover
    slideshowWrapper.addEventListener('mouseenter', () => {
        stopAutoPlay();
    });
    
    slideshowWrapper.addEventListener('mouseleave', () => {
        startAutoPlay();
    });

    // Parallax effect on mouse move
    slideshowWrapper.addEventListener('mousemove', (e) => {
        const rect = slideshowWrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const activeSlide = slideshowWrapper.querySelector('.slide.active .slide-image');
        if (activeSlide) {
            const moveX = (x - 0.5) * 20;
            const moveY = (y - 0.5) * 20;
            activeSlide.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.08)`;
        }
    });

    slideshowWrapper.addEventListener('mouseleave', () => {
        const activeSlide = slideshowWrapper.querySelector('.slide.active .slide-image');
        if (activeSlide) {
            activeSlide.style.transform = 'translate(0, 0) scale(1.08)';
        }
    });
});

// Generate indicators dynamically
function generateIndicators() {
    const indicatorsContainer = document.getElementById('indicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.onclick = () => goToSlide(i);
        indicatorsContainer.appendChild(indicator);
    }
}

function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide and indicator
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentSlideIndex = index;
    updateSlideCounter();
}

function changeSlide(direction) {
    stopAutoPlay();
    
    let newIndex = currentSlideIndex + direction;
    
    if (newIndex < 0) {
        newIndex = totalSlides - 1;
    } else if (newIndex >= totalSlides) {
        newIndex = 0;
    }
    
    showSlide(newIndex);
    startAutoPlay();
}

function goToSlide(index) {
    stopAutoPlay();
    showSlide(index);
    startAutoPlay();
}

function updateSlideCounter() {
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    
    if (currentSlideEl) {
        currentSlideEl.textContent = currentSlideIndex + 1;
    }
    if (totalSlidesEl) {
        totalSlidesEl.textContent = totalSlides;
    }
}

function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

// Setup image interactions
function setupImageInteractions() {
    const slides = document.querySelectorAll('.slide');
    
    // Preload all images immediately
    slides.forEach((slide) => {
        const img = slide.querySelector('.slide-image');
        if (img && img.src) {
            // Force browser to start loading
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
    
    slides.forEach((slide, index) => {
        const img = slide.querySelector('.slide-image');
        
        // Click to open fullscreen
        slide.addEventListener('click', (e) => {
            if (!e.target.closest('.slide-nav') && !e.target.closest('.indicator')) {
                if (img && img.src) {
                    openModal(img.src);
                }
            }
        });
        
        // Error handling
        if (img) {
            img.addEventListener('error', function() {
                console.warn(`Image failed to load: ${this.src}`);
                this.style.display = 'none';
                const slideInner = this.closest('.slide-inner');
                if (slideInner) {
                    slideInner.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(0,0,0,0.5); color: white; font-size: 1.5rem;">Image not found</div>';
                }
            });
        }
    });
}

// Modal functions
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on background click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('imageModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Confetti creation
function createConfetti() {
    const colors = ['#ff6b9d', '#c44569', '#f8b500', '#667eea', '#f093fb', '#4facfe'];
    const confettiContainer = document.getElementById('confetti');
    const launcher = document.getElementById('confettiLauncher');
    
    // Show launcher
    if (launcher) {
        launcher.classList.add('active');
    }
    
    // Launch confetti from bottom left (launcher position)
    const launchX = 90; // left position (40px) + half of launcher width (50px)
    const launchBottom = 140; // bottom position in pixels (140px from bottom)
    
    for (let i = 0; i < 250; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random colors
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 12 + 6 + 'px';
            confetti.style.height = confetti.style.width;
            
            // Random launch angle (spread out in a cone upward)
            const angle = (Math.random() * 120 - 60) * (Math.PI / 180); // -60 to +60 degrees
            const velocity = Math.random() * 800 + 600; // random velocity
            const distanceX = Math.cos(angle) * velocity;
            const distanceY = -Math.abs(Math.sin(angle) * velocity); // always upward
            const rotation = Math.random() * 1440 - 720; // -720 to +720 degrees
            
            // Set CSS custom properties for animation
            confetti.style.setProperty('--translate-x', `${distanceX}px`);
            confetti.style.setProperty('--translate-y', `${distanceY}px`);
            confetti.style.setProperty('--rotate', `${rotation}deg`);
            confetti.style.left = `${launchX}px`;
            confetti.style.bottom = `${launchBottom}px`;
            
            confettiContainer.appendChild(confetti);
            
            // Trigger animation
            setTimeout(() => {
                confetti.classList.add('launched');
            }, 10);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 2600);
        }, i * 8);
    }
    
    // Hide launcher after animation
    setTimeout(() => {
        if (launcher) {
            launcher.classList.remove('active');
        }
    }, 250 * 8 + 2600);
}

// Celebration trigger
function triggerCelebration() {
    createConfetti();
    
    // Add a fun animation to the header
    const header = document.querySelector('.header');
    if (header) {
        header.style.animation = 'none';
        setTimeout(() => {
            header.style.animation = 'bounce 0.6s ease';
        }, 10);
    }
}

// Bounce animation
const bounceKeyframes = `
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}
`;
if (document.styleSheets[0]) {
    try {
        document.styleSheets[0].insertRule(bounceKeyframes, 0);
    } catch (e) {
        // Fallback if insertRule fails
    }
}

// Add floating balloons on page load
function createBalloon() {
    const emojis = ['🎈', '🎉', '🎊', '🎁', '🎂', '⭐'];
    
    const balloon = document.createElement('div');
    balloon.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    balloon.style.position = 'fixed';
    balloon.style.left = Math.random() * 100 + '%';
    balloon.style.bottom = '-60px';
    balloon.style.fontSize = '2.5rem';
    balloon.style.zIndex = '5000';
    balloon.style.pointerEvents = 'none';
    balloon.style.animation = `balloon-float ${6 + Math.random() * 4}s ease-in forwards`;
    
    document.body.appendChild(balloon);
    
    setTimeout(() => {
        balloon.remove();
    }, 10000);
}

// Balloon animation
const balloonKeyframes = `
@keyframes balloon-float {
    0% {
        transform: translateY(0) translateX(0) rotate(0deg);
        opacity: 0.8;
    }
    50% {
        transform: translateY(-50vh) translateX(${Math.random() * 60 - 30}px) rotate(${Math.random() * 20 - 10}deg);
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 40 - 20}deg);
        opacity: 0;
    }
}
`;
if (document.styleSheets[0]) {
    try {
        document.styleSheets[0].insertRule(balloonKeyframes, 0);
    } catch (e) {
        // Fallback
    }
}

// Create balloons on page load
window.addEventListener('load', () => {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createBalloon(), i * 600);
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.message-card, .wish-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});

// Smooth scroll for sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add sparkle effect on click
document.addEventListener('click', (e) => {
    if (e.target.closest('.celebrate-btn') || 
        e.target.closest('.sms-btn') || 
        e.target.closest('.slide-nav') ||
        e.target.closest('.slide-indicators')) {
        return;
    }
    
    // Create sparkle
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.background = '#f8b500';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkle-fade 1s ease-out';
    sparkle.style.boxShadow = '0 0 15px #f8b500';
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
});

// Sparkle animation
const sparkleKeyframes = `
@keyframes sparkle-fade {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(4);
    }
}
`;
if (document.styleSheets[0]) {
    try {
        document.styleSheets[0].insertRule(sparkleKeyframes, 0);
    } catch (e) {
        // Fallback
    }
}
