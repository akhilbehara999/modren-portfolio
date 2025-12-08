// Navbar toggle functionality
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}));

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
                
                // Scroll to target with offset for fixed header
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animated');
            // Add staggered animation delay
            const delay = element.dataset.delay || '0s';
            element.style.transitionDelay = delay;
        }
    });
};

// Add animate-on-scroll class to elements that should animate
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.dataset.delay = `${index * 0.1}s`;
        card.classList.add('animate-on-scroll');
    });
    
    // Add animation classes to goals boxes
    const goalsBoxes = document.querySelectorAll('.goals-box, .interests-box');
    goalsBoxes.forEach((box, index) => {
        box.dataset.delay = `${index * 0.1}s`;
        box.classList.add('animate-on-scroll');
    });
    
    // Add animation delays to goal items
    const goalItems = document.querySelectorAll('.goal-item');
    goalItems.forEach((item, index) => {
        item.style.setProperty('--delay', index);
    });
    
    // Add animation delays to competency items
    const competencyItems = document.querySelectorAll('.competency-item');
    competencyItems.forEach((item, index) => {
        item.style.setProperty('--delay', index);
    });
    
    // Add animation classes to skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.dataset.delay = `${index * 0.05}s`;
        item.classList.add('animate-on-scroll');
    });
    
    // Add animation classes to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.dataset.delay = `${index * 0.2}s`;
        item.classList.add('animate-on-scroll');
    });
    
    // Add animation delays to contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.setProperty('--delay', index);
    });
    
    // Add animation delays to hero tags
    const heroTags = document.querySelectorAll('.hero-tag');
    heroTags.forEach((tag, index) => {
        tag.style.setProperty('--delay', index);
    });
    
    // Add animation delays to project tech tags
    const projectTechTags = document.querySelectorAll('.project-tech span');
    projectTechTags.forEach((tag, index) => {
        tag.style.setProperty('--delay', index);
    });
    
    // Add animation delays to skills tags
    const skillsTags = document.querySelectorAll('.skills-tags .tag');
    skillsTags.forEach((tag, index) => {
        tag.style.setProperty('--delay', index);
    });
    
    // Initial check for animations
    animateOnScroll();
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelector('input[type="text"][placeholder="Subject"]').value;
        const message = this.querySelector('textarea').value;
        
        // Show loading message
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Try to send email via a simple backend service (you would need to implement this)
        // For now, we'll use the mailto approach as a fallback
        
        // Create mailto link
        const mailtoLink = `mailto:akhilbehara97@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact Form')}%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(name)}%20(${encodeURIComponent(email)})`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
        // Show confirmation
        setTimeout(() => {
            alert(`Thank you for your message, ${name}! Your email client should open shortly. If it doesn't, please email akhilbehara97@gmail.com directly.`);
            // Reset form
            contactForm.reset();
            // Restore button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 100);
    });
}

// Progress bar animations with enhanced effects
const progressBars = document.querySelectorAll('.progress');
progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    
    // Add glow effect
    bar.style.boxShadow = '0 0 10px rgba(249, 115, 22, 0.5)';
    
    // Animate when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bar.style.width = width;
                // Add animation class for additional effects
                bar.classList.add('progress-animated');
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(bar);
});

// Add floating animation to profile badge
const profileBadge = document.querySelector('.profile-badge');
if (profileBadge) {
    let floating = true;
    setInterval(() => {
        if (floating) {
            profileBadge.style.transform = 'translateY(-10px)';
        } else {
            profileBadge.style.transform = 'translateY(0)';
        }
        floating = !floating;
    }, 2000);
}

// Add hackathon pulse effect to hackathon projects
const hackathonProjects = document.querySelectorAll('.hackathon-project');
hackathonProjects.forEach(project => {
    setInterval(() => {
        project.style.boxShadow = '0 0 20px rgba(0, 255, 157, 0.5)';
        setTimeout(() => {
            project.style.boxShadow = 'var(--shadow)';
        }, 1000);
    }, 3000);
});

// Add parallax effect to hero section
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    
    hero.style.backgroundPosition = `${50 + xAxis}% ${50 + yAxis}%`;
    
    // Add parallax effect to profile badge
    const profileBadge = document.querySelector('.profile-badge');
    if (profileBadge) {
        const profileXAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const profileYAxis = (window.innerHeight / 2 - e.pageY) / 50;
        profileBadge.style.transform = `translate(${profileXAxis}px, ${profileYAxis}px) translateY(-10px)`;
    }
});

// Add typing effect to hero section
document.addEventListener('DOMContentLoaded', () => {
    const heroText = document.querySelector('.hero-content h2');
    if (!heroText) return;
    
    const text = heroText.textContent;
    heroText.textContent = '';
    
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            heroText.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
            // Add blinking cursor effect
            heroText.innerHTML += '<span class="cursor">|</span>';
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                setInterval(() => {
                    cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
                }, 500);
            }
        }
    }, 100);
    
    // Add hackathon confetti effect on page load
    setTimeout(createConfetti, 1000);
});

// Create confetti effect for hackathon theme
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#00c8ff', '#8a2be2', '#00ff9d', '#ff2b9d'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = Math.random();
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        
        confettiContainer.appendChild(confetti);
        
        // Animate confetti
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: 'translateY(' + window.innerHeight + 'px) rotate(' + Math.random() * 360 + 'deg)', opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }
    
    // Remove container after animation
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Add ripple styles
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add hover effect to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Tab functionality for Career Goals section
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

if (tabButtons.length && tabPanes.length) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding pane
            const tabId = button.getAttribute('data-tab');
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Animated background effect
let particles = [];
const canvas = document.createElement('canvas');
canvas.id = 'background-canvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${
            Math.random() > 0.5 ? '0, 200, 255' : '138, 43, 226'
        }, ${Math.random() * 0.5 + 0.1})`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
function initParticles() {
    particles = [];
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 9000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Mouse move effect for particles
window.addEventListener('mousemove', (e) => {
    particles.forEach(particle => {
        const dx = particle.x - e.clientX;
        const dy = particle.y - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.speedX += dx * force * 0.001;
            particle.speedY += dy * force * 0.001;
        }
    });
});



// Add loading animation to body
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        body.style.opacity = '1';
    }, 100);
});

// Add scroll to top button
window.addEventListener('scroll', function() {
    const scrollTopBtn = document.getElementById('scrollToTop');
    if (window.pageYOffset > 300) {
        if (!scrollTopBtn) {
            const btn = document.createElement('button');
            btn.id = 'scrollToTop';
            btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            btn.style.position = 'fixed';
            btn.style.bottom = '30px';
            btn.style.right = '30px';
            btn.style.width = '50px';
            btn.style.height = '50px';
            btn.style.borderRadius = '50%';
            btn.style.background = 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))';
            btn.style.color = 'var(--text-light)';
            btn.style.border = 'none';
            btn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '9999';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.fontSize = '1.2rem';
            btn.style.transition = 'all 0.3s ease';
            
            btn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            document.body.appendChild(btn);
        } else {
            scrollTopBtn.style.display = 'flex';
        }
    } else if (scrollTopBtn) {
        scrollTopBtn.style.display = 'none';
    }
});