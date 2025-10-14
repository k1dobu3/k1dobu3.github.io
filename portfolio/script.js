// Theme and Language Management
class PortfolioManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.currentLanguage = localStorage.getItem('language') || 'ru';
        this.init();
    }

    init() {
        this.applyTheme();
        this.applyLanguage();
        this.bindEvents();
        this.initAnimations();
        this.initScrollEffects();
    }

    // Theme Management
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Language Management
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'ru' ? 'en' : 'ru';
        this.applyLanguage();
        localStorage.setItem('language', this.currentLanguage);
    }

    applyLanguage() {
        const elements = document.querySelectorAll('[data-ru][data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                element.textContent = text;
            }
        });

        const langToggle = document.querySelector('#langToggle .current-lang');
        if (langToggle) {
            langToggle.textContent = this.currentLanguage.toUpperCase();
        }
    }

    // Event Binding
    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => this.handleScroll());

        // Skill item interactions
        this.initSkillInteractions();

        // Project interactions
        this.initProjectInteractions();

        // Social link interactions
        this.initSocialInteractions();
    }

    // Scroll Effects
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            navbar.style.background = this.currentTheme === 'dark' 
                ? 'rgba(10, 10, 10, 0.98)'
                : 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = this.currentTheme === 'dark'
                ? 'rgba(10, 10, 10, 0.95)'
                : 'rgba(255, 255, 255, 0.95)';
        }
    }

    // Animations
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.hero-content, .skill-item, .project-item, .social-link').forEach(el => {
            observer.observe(el);
        });

        // Add loading class and remove when page is loaded
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            document.querySelectorAll('.loading').forEach(el => {
                el.classList.add('loaded');
            });
        });
    }

    // Scroll Effects for Parallax
    initScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero::before');
            
            // Parallax effect for hero background
            const heroBackground = document.querySelector('.hero::before');
            if (heroBackground) {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                heroBackground.style.transform = `translateY(${yPos}px)`;
            }

            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate);
    }

    // Skill Interactions
    initSkillInteractions() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.animateSkillIcon(item);
            });

            item.addEventListener('click', () => {
                this.showSkillInfo(item);
            });
        });
    }

    animateSkillIcon(skillItem) {
        const icon = skillItem.querySelector('.skill-icon i, .skill-icon img');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }
    }

    showSkillInfo(skillItem) {
        const skillName = skillItem.querySelector('.skill-name').textContent;
        const skillData = {
            'Unreal Engine': 'Game development with advanced 3D graphics',
            'Figma': 'UI/UX design and prototyping',
            'Miro': 'Collaborative planning and brainstorming',
            'WEEEK': 'Project management and task tracking',
            'Notion': 'Documentation and knowledge management',
            'Unity': 'Cross-platform game development',
            'Adobe Package': 'Creative design and media production',
            'Google Sheets': 'Data analysis and automation'
        };

        // Create temporary tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = skillData[skillName] || 'Professional skill';
        tooltip.style.cssText = `
            position: absolute;
            background: var(--bg);
            color: var(--text);
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--neon-green);
            font-size: 0.9rem;
            z-index: 1000;
            pointer-events: none;
            transform: translateY(-10px);
            opacity: 0;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = skillItem.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - 40}px`;

        // Show tooltip
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });

        // Remove tooltip
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 300);
        }, 2000);
    }

    // Project Interactions
    initProjectInteractions() {
        const projectItems = document.querySelectorAll('.project-item');
        
        projectItems.forEach(item => {
            const projectLinks = item.querySelectorAll('.project-link');
            
            projectLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (link.getAttribute('href') === '#') {
                        e.preventDefault();
                        this.showComingSoon(link);
                    }
                });
            });

            // Add loading animation to project images
            const projectImages = item.querySelectorAll('.project-img');
            projectImages.forEach(img => {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                });
            });
        });
    }

    showComingSoon(link) {
        const originalText = link.innerHTML;
        link.style.background = 'var(--neon-green)';
        link.style.color = '#000';
        link.innerHTML = '<i class="fas fa-clock"></i> Coming Soon';
        
        setTimeout(() => {
            link.style.background = 'transparent';
            link.style.color = 'var(--text)';
            link.innerHTML = originalText;
        }, 2000);
    }

    // Social Link Interactions
    initSocialInteractions() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                    this.animateSocialLink(link);
                }
            });

            link.addEventListener('mouseenter', () => {
                this.pulseAnimation(link);
            });
        });
    }

    animateSocialLink(link) {
        const icon = link.querySelector('i');
        
        // Bounce animation
        link.style.animation = 'bounce 0.6s ease';
        
        setTimeout(() => {
            link.style.animation = '';
        }, 600);

        // Show message
        this.showSocialMessage(link);
    }

    pulseAnimation(element) {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    showSocialMessage(link) {
        const platform = link.querySelector('span').textContent;
        const messages = {
            'Telegram': 'Connect on Telegram!',
            'YouTube': 'Subscribe to my channel!',
            'Behance': 'View my portfolio!',
            'Dribbble': 'Check out my designs!',
            'GitHub': 'Explore my code!',
            'Email': 'Send me a message!'
        };

        // Create floating message
        const message = document.createElement('div');
        message.textContent = messages[platform] || 'Coming soon!';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg);
            color: var(--text);
            padding: 15px 25px;
            border-radius: 10px;
            border: 2px solid var(--neon-green);
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 255, 65, 0.3);
            opacity: 0;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(message);

        // Animate in
        requestAnimationFrame(() => {
            message.style.opacity = '1';
            message.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });

        // Animate out
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 2000);
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Enhanced CSS for animations
const additionalStyles = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0,-15px,0);
        }
        70% {
            transform: translate3d(0,-7px,0);
        }
        90% {
            transform: translate3d(0,-2px,0);
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }

    .pulse {
        animation: pulse 2s infinite;
    }

    .skill-tooltip {
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .project-img {
        opacity: 0;
        transform: scale(0.95);
        transition: all 0.5s ease;
    }

    .project-img.loaded {
        opacity: 1;
        transform: scale(1);
    }

    /* Loading states */
    .loading {
        position: relative;
        overflow: hidden;
    }

    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.1), transparent);
        animation: loading 1.5s infinite;
    }

    @keyframes loading {
        0% { left: -100%; }
        100% { left: 100%; }
    }

    /* Performance optimizations */
    .skill-item, .project-item, .social-link {
        will-change: transform;
    }

    .skill-item:hover, .project-item:hover, .social-link:hover {
        will-change: transform, box-shadow;
    }

    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }

    /* Focus styles for keyboard navigation */
    .skill-item:focus, .project-link:focus, .social-link:focus {
        outline: 2px solid var(--neon-green);
        outline-offset: 2px;
    }
`;

// Add additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the portfolio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});

// Add some fun easter eggs
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        
        // Show easter egg message
        const message = document.createElement('div');
        message.textContent = '🎮 Konami Code Activated!';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--neon-green);
            color: #000;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 20px 40px rgba(0, 255, 65, 0.5);
            animation: bounce 1s ease;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
        
        konamiCode = [];
    }
});

// Console message for developers
console.log('%c👋 Hey there, developer!', 'color: #00ff41; font-size: 16px; font-weight: bold;');
console.log('%cThis portfolio was built with love and code. 💻✨', 'color: #ffffff; font-size: 14px;');
console.log('%cWant to see the source code? Check out the GitHub repository!', 'color: #b0b0b0; font-size: 12px;');