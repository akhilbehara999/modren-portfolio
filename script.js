/* ========================================================
   BIOLUMINESCENT DEEP SEA PORTFOLIO - COMPLETE JAVASCRIPT
   Author: Pondara Akhil Behara
   Theme: Underwater Bioluminescence
======================================================== */

// ===== CONFIGURATION =====
const CONFIG = {
    github: {
        username: 'akhilbehara999',
        reposToShow: 6
    },
    particles: {
        planktonCount: 80,
        jellyfishCount: 5,
        bubbleCount: 25
    },
    typing: {
        phrases: [
            'Game Developer',
            'AI Enthusiast',
            'Deep Sea Explorer',
            'Code Architect',
            'BTech Student',
            'Problem Solver',
            'Creative Coder'
        ],
        speed: 100,
        deleteSpeed: 50,
        pauseDuration: 2000
    }
};

// ===== GLOBAL STATE =====
const STATE = {
    scrollProgress: 0,
    currentDepth: 0,
    currentZone: 'Surface',
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    mousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// ===== UTILITY FUNCTIONS =====
const utils = {
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },
    
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
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
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ===== LOADER =====
class DiveLoader {
    constructor() {
        this.loader = document.getElementById('diveLoader');
        this.minDisplayTime = 2500;
        this.startTime = Date.now();
        
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            const elapsed = Date.now() - this.startTime;
            const remaining = Math.max(0, this.minDisplayTime - elapsed);
            
            setTimeout(() => this.hide(), remaining);
        });
    }
    
    hide() {
        if (this.loader) {
            this.loader.classList.add('submerged');
            STATE.isLoaded = true;
            
            // Remove from DOM after animation
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 1000);
        }
        
        console.log('🌊 Dive initiated! Welcome to the deep sea.');
    }
}

// ===== DEEP SEA CANVAS =====
class DeepSeaCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas || STATE.reducedMotion) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.plankton = [];
        this.jellyfish = [];
        this.bubbles = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.max(
            document.documentElement.scrollHeight,
            window.innerHeight * 5
        );
    }
    
    createParticles() {
        // Plankton
        const planktonCount = STATE.isMobile ? 40 : CONFIG.particles.planktonCount;
        for (let i = 0; i < planktonCount; i++) {
            this.plankton.push(new Plankton(this.canvas));
        }
        
        // Jellyfish (desktop only)
        if (!STATE.isMobile) {
            for (let i = 0; i < CONFIG.particles.jellyfishCount; i++) {
                this.jellyfish.push(new Jellyfish(this.canvas));
            }
        }
        
        // Bubbles
        for (let i = 0; i < CONFIG.particles.bubbleCount; i++) {
            this.bubbles.push(new Bubble(this.canvas));
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', utils.debounce(() => {
            this.resize();
            this.plankton = [];
            this.jellyfish = [];
            this.bubbles = [];
            this.createParticles();
        }, 300));
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw all particles
        this.plankton.forEach(p => {
            p.update();
            p.draw(this.ctx);
        });
        
        this.bubbles.forEach(b => {
            b.update();
            b.draw(this.ctx);
        });
        
        this.jellyfish.forEach(j => {
            j.update();
            j.draw(this.ctx);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ===== PLANKTON PARTICLE =====
class Plankton {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset(true);
    }
    
    reset(initial = false) {
        this.x = Math.random() * this.canvas.width;
        this.y = initial ? Math.random() * this.canvas.height : this.canvas.height + 50;
        this.radius = utils.random(1, 3);
        this.speed = utils.random(0.3, 1);
        this.drift = utils.random(-0.5, 0.5);
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = utils.random(0.02, 0.06);
        this.color = this.getColor();
    }
    
    getColor() {
        const colors = [
            { r: 0, g: 255, b: 247 },
            { r: 0, g: 128, b: 255 },
            { r: 57, g: 255, b: 20 },
            { r: 255, g: 0, b: 255 },
            { r: 157, g: 78, b: 221 }
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.y -= this.speed;
        this.x += this.drift + Math.sin(this.pulse) * 0.3;
        this.pulse += this.pulseSpeed;
        
        // Mouse attraction
        const dx = STATE.mousePos.x - this.x;
        const dy = (STATE.mousePos.y + window.scrollY) - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150 && dist > 0) {
            this.x += (dx / dist) * 0.5;
            this.y += (dy / dist) * 0.5;
        }
        
        // Reset if off screen
        if (this.y < -20) {
            this.reset();
        }
        
        // Keep in horizontal bounds
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
    }
    
    draw(ctx) {
        const opacity = 0.4 + Math.sin(this.pulse) * 0.3;
        const glowSize = this.radius * (2 + Math.sin(this.pulse));
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, glowSize * 4
        );
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity + 0.4})`;
        ctx.fill();
    }
}

// ===== JELLYFISH PARTICLE =====
class Jellyfish {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset(true);
    }
    
    reset(initial = false) {
        this.x = Math.random() * this.canvas.width;
        this.y = initial ? Math.random() * this.canvas.height : this.canvas.height + 150;
        this.size = utils.random(35, 65);
        this.speed = utils.random(0.3, 0.7);
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = utils.random(0.015, 0.035);
        this.tentaclePhase = Math.random() * Math.PI * 2;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.color = this.getColor();
    }
    
    getColor() {
        const colors = [
            { r: 0, g: 255, b: 247 },
            { r: 255, g: 0, b: 255 },
            { r: 157, g: 78, b: 221 },
            { r: 0, g: 200, b: 255 }
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.y -= this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.8;
        this.tentaclePhase += 0.05;
        this.pulsePhase += 0.03;
        
        if (this.y < -200) {
            this.reset();
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.1;
        
        // Outer glow
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2.5);
        glowGradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.25)`);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        // Bell body
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.7 * pulseScale, this.size * 0.5 * pulseScale, 0, Math.PI, 0);
        ctx.quadraticCurveTo(
            this.size * 0.7 * pulseScale, 
            this.size * 0.2, 
            0, 
            this.size * 0.35
        );
        ctx.quadraticCurveTo(
            -this.size * 0.7 * pulseScale, 
            this.size * 0.2, 
            -this.size * 0.7 * pulseScale, 
            0
        );
        
        const bellGradient = ctx.createLinearGradient(0, -this.size * 0.5, 0, this.size * 0.4);
        bellGradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.7)`);
        bellGradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.4)`);
        bellGradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.1)`);
        
        ctx.fillStyle = bellGradient;
        ctx.fill();
        
        // Inner glow
        const innerGlow = ctx.createRadialGradient(0, -this.size * 0.1, 0, 0, -this.size * 0.1, this.size * 0.3);
        innerGlow.addColorStop(0, `rgba(255, 255, 255, 0.4)`);
        innerGlow.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(0, -this.size * 0.1, this.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();
        
        // Tentacles
        const tentacleCount = 7;
        for (let i = 0; i < tentacleCount; i++) {
            const startX = (i - (tentacleCount - 1) / 2) * (this.size * 0.15);
            const phase = this.tentaclePhase + i * 0.4;
            
            ctx.beginPath();
            ctx.moveTo(startX, this.size * 0.25);
            
            const segments = 5;
            for (let j = 1; j <= segments; j++) {
                const segY = this.size * 0.25 + j * this.size * 0.35;
                const segX = startX + Math.sin(phase + j * 0.5) * this.size * 0.12;
                ctx.lineTo(segX, segY);
            }
            
            ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${0.5 - i * 0.05})`;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// ===== BUBBLE PARTICLE =====
class Bubble {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset(true);
    }
    
    reset(initial = false) {
        this.x = Math.random() * this.canvas.width;
        this.y = initial ? Math.random() * this.canvas.height : this.canvas.height + 50;
        this.radius = utils.random(4, 14);
        this.speed = utils.random(1, 3);
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = utils.random(0.03, 0.08);
        this.opacity = utils.random(0.3, 0.7);
    }
    
    update() {
        this.y -= this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;
        
        // Slight size variation as bubble rises
        this.radius += 0.002;
        
        if (this.y < -30) {
            this.reset();
        }
    }
    
    draw(ctx) {
        // Main bubble
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            0,
            this.x,
            this.y,
            this.radius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.4, `rgba(200, 240, 255, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(150, 220, 255, ${this.opacity * 0.1})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Highlight
        ctx.beginPath();
        ctx.arc(
            this.x - this.radius * 0.35,
            this.y - this.radius * 0.35,
            this.radius * 0.25,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.2})`;
        ctx.fill();
        
        // Secondary small highlight
        ctx.beginPath();
        ctx.arc(
            this.x + this.radius * 0.2,
            this.y + this.radius * 0.2,
            this.radius * 0.1,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        ctx.fill();
    }
}

// ===== CUSTOM CURSOR =====
class BioluminescentCursor {
    constructor() {
        if (STATE.isMobile) return;
        
        this.cursor = document.getElementById('cursorGlow');
        if (!this.cursor) return;
        
        this.pos = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        
        this.init();
        this.animate();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.targetPos.x = e.clientX;
            this.targetPos.y = e.clientY;
            STATE.mousePos.x = e.clientX;
            STATE.mousePos.y = e.clientY;
        });
        
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
            this.cursor.classList.add('click');
            setTimeout(() => this.cursor.classList.remove('click'), 500);
        });
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .coral, .capsule, .treasure-chest, .jelly-link, .frequency-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
    }
    
    animate() {
        // Smooth follow
        this.pos.x = utils.lerp(this.pos.x, this.targetPos.x, 0.15);
        this.pos.y = utils.lerp(this.pos.y, this.targetPos.y, 0.15);
        
        this.cursor.style.left = this.pos.x + 'px';
        this.cursor.style.top = this.pos.y + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
    
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'sonar-ripple';
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border: 2px solid var(--bio-cyan);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9998;
            animation: sonarExpand 1s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    }
}

// Add sonar animation
const sonarStyle = document.createElement('style');
sonarStyle.textContent = `
    @keyframes sonarExpand {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
            border-width: 2px;
        }
        100% {
            width: 250px;
            height: 250px;
            opacity: 0;
            border-width: 1px;
        }
    }
`;
document.head.appendChild(sonarStyle);

// ===== DEPTH GAUGE =====
class DepthGauge {
    constructor() {
        this.fill = document.querySelector('.depth-fill');
        this.value = document.querySelector('.depth-value');
        this.zone = document.querySelector('.depth-zone');
        
        if (!this.fill || !this.value || !this.zone) return;
        
        this.maxDepth = 11000;
        this.zones = [
            { max: 200, name: 'Surface' },
            { max: 1000, name: 'Twilight' },
            { max: 4000, name: 'Midnight' },
            { max: 6000, name: 'Abyssal' },
            { max: 11000, name: 'Hadal' }
        ];
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', utils.throttle(() => this.update(), 50));
        this.update();
    }
    
    update() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        
        STATE.scrollProgress = scrollProgress;
        STATE.currentDepth = Math.round(scrollProgress * this.maxDepth);
        
        // Update UI
        this.fill.style.height = `${scrollProgress * 100}%`;
        this.value.textContent = STATE.currentDepth;
        
        // Determine zone
        let zoneName = 'Surface';
        for (const z of this.zones) {
            if (STATE.currentDepth <= z.max) {
                zoneName = z.name;
                break;
            }
        }
        
        if (STATE.currentZone !== zoneName) {
            STATE.currentZone = zoneName;
            this.zone.textContent = zoneName;
            
            // Trigger zone change animation
            this.zone.style.animation = 'none';
            this.zone.offsetHeight; // Force reflow
            this.zone.style.animation = 'letter-glow 3s ease-in-out infinite';
        }
    }
}

// ===== JELLYFISH NAVIGATION =====
class JellyfishNavigation {
    constructor() {
        this.jellyLinks = document.querySelectorAll('.jelly-link');
        this.mobileLinks = document.querySelectorAll('.mobile-nav-item');
        this.sections = document.querySelectorAll('.depth-zone');
        
        if (this.sections.length === 0) return;
        
        this.init();
    }
    
    init() {
        // Click handlers
        this.jellyLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
        
        this.mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
        
        // Scroll spy
        window.addEventListener('scroll', utils.throttle(() => this.updateActive(), 100));
        this.updateActive();
    }
    
    handleClick(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    updateActive() {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        
        this.sections.forEach((section, index) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.jellyLinks.forEach((link, i) => {
                    link.classList.toggle('active', i === index);
                });
                
                this.mobileLinks.forEach((link, i) => {
                    link.classList.toggle('active', i === index);
                });
            }
        });
    }
}

// ===== TYPING EFFECT =====
class OceanTyping {
    constructor(selector) {
        this.element = document.querySelector(selector);
        if (!this.element) return;
        
        this.phrases = CONFIG.typing.phrases;
        this.phraseIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.type();
    }
    
    type() {
        const currentPhrase = this.phrases[this.phraseIndex];
        
        if (this.isPaused) {
            setTimeout(() => {
                this.isPaused = false;
                this.isDeleting = true;
                this.type();
            }, CONFIG.typing.pauseDuration);
            return;
        }
        
        if (this.isDeleting) {
            this.charIndex--;
            this.element.textContent = currentPhrase.substring(0, this.charIndex);
        } else {
            this.charIndex++;
            this.element.textContent = currentPhrase.substring(0, this.charIndex);
        }
        
        let speed = this.isDeleting ? CONFIG.typing.deleteSpeed : CONFIG.typing.speed;
        
        // Add natural variation
        speed += Math.random() * 50 - 25;
        
        if (!this.isDeleting && this.charIndex === currentPhrase.length) {
            this.isPaused = true;
            speed = 0;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
            speed = 500;
        }
        
        setTimeout(() => this.type(), speed);
    }
}

// ===== SCROLL REVEAL =====
class DeepReveal {
    constructor() {
        this.zoneContents = document.querySelectorAll('.zone-content');
        this.skillCreatures = document.querySelectorAll('.skill-creature');
        this.treasureChests = document.querySelectorAll('.treasure-chest');
        
        this.init();
    }
    
    init() {
        // Zone content observer
        const contentObserver = new IntersectionObserver(
            (entries) => this.revealContent(entries),
            { threshold: 0.15, rootMargin: '-50px' }
        );
        
        this.zoneContents.forEach(el => contentObserver.observe(el));
        
        // Skill creatures observer
        const skillObserver = new IntersectionObserver(
            (entries) => this.revealSkills(entries),
            { threshold: 0.25 }
        );
        
        this.skillCreatures.forEach(el => skillObserver.observe(el));
    }
    
    revealContent(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animate child elements
                const animateElements = entry.target.querySelectorAll(
                    '.capsule, .coral, .bio-chamber, .frequency-item'
                );
                
                animateElements.forEach((el, i) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, i * 100);
                });
            }
        });
    }
    
    revealSkills(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars
                const bars = entry.target.querySelectorAll('.bar-fill');
                bars.forEach((bar, i) => {
                    setTimeout(() => {
                        const level = bar.dataset.level || 0;
                        bar.style.width = `${level}%`;
                    }, i * 150);
                });
            }
        });
    }
}

// ===== GITHUB PROJECTS (TREASURE LOADER) =====
class TreasureLoader {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.icons = ['🏴‍☠️', '💎', '🔱', '⚓', '🐚', '🦑', '🐙', '🦀'];
        
        this.load();
    }
    
    async load() {
        try {
            const response = await fetch(
                `https://api.github.com/users/${CONFIG.github.username}/repos?sort=updated&per_page=${CONFIG.github.reposToShow}`
            );
            
            if (!response.ok) throw new Error('GitHub API error');
            
            const repos = await response.json();
            this.render(repos);
        } catch (error) {
            console.warn('GitHub unavailable, using fallback projects:', error);
            this.renderFallback();
        }
    }
    
    render(repos) {
        this.container.innerHTML = '';
        
        repos.forEach((repo, index) => {
            const card = this.createCard({
                name: this.formatName(repo.name),
                description: repo.description || 'A mysterious treasure discovered in the depths of code.',
                url: repo.html_url,
                homepage: repo.homepage,
                language: repo.language,
                topics: repo.topics || [],
                stars: repo.stargazers_count,
                icon: this.icons[index % this.icons.length]
            });
            
            this.container.appendChild(card);
            
            // Staggered animation
            setTimeout(() => {
                card.classList.add('discovered');
            }, index * 200);
        });
    }
    
    renderFallback() {
        const fallbackProjects = [
            {
                name: 'Portfolio Website',
                description: 'A bioluminescent deep sea themed portfolio with stunning underwater animations.',
                url: 'https://github.com/akhilbehara999',
                language: 'JavaScript',
                topics: ['html', 'css', 'javascript', 'portfolio'],
                icon: '🏴‍☠️'
            },
            {
                name: 'AI Explorer',
                description: 'Diving deep into artificial intelligence experiments and neural network discoveries.',
                url: 'https://github.com/akhilbehara999',
                language: 'Python',
                topics: ['ai', 'machine-learning', 'python'],
                icon: '💎'
            },
            {
                name: 'Game Development',
                description: 'Crafting immersive game experiences with Godot engine and creative mechanics.',
                url: 'https://github.com/akhilbehara999',
                language: 'GDScript',
                topics: ['godot', 'game-dev', 'gdscript'],
                icon: '🔱'
            },
            {
                name: 'Web Applications',
                description: 'Full-stack web applications built with modern technologies and best practices.',
                url: 'https://github.com/akhilbehara999',
                language: 'React',
                topics: ['react', 'node', 'mongodb'],
                icon: '⚓'
            }
        ];
        
        this.container.innerHTML = '';
        
        fallbackProjects.forEach((project, index) => {
            const card = this.createCard(project);
            this.container.appendChild(card);
            
            setTimeout(() => {
                card.classList.add('discovered');
            }, index * 200);
        });
    }
    
    createCard(project) {
        const card = document.createElement('div');
        card.className = 'treasure-chest';
        
        card.innerHTML = `
            <div class="treasure-glow"></div>
            <div class="treasure-header">
                <span class="treasure-icon">${project.icon}</span>
                <h3 class="treasure-name">${project.name}</h3>
            </div>
            <p class="treasure-desc">${project.description}</p>
            <div class="treasure-tags">
                ${project.language ? `<span class="treasure-tag">${project.language}</span>` : ''}
                ${project.topics.slice(0, 3).map(topic => 
                    `<span class="treasure-tag">${topic}</span>`
                ).join('')}
            </div>
            <div class="treasure-links">
                <a href="${project.url}" class="treasure-link" target="_blank" rel="noopener">
                    🔗 Source Code
                </a>
                ${project.homepage ? `
                    <a href="${project.homepage}" class="treasure-link" target="_blank" rel="noopener">
                        🌐 Live Demo
                    </a>
                ` : ''}
            </div>
            ${project.stars !== undefined ? `
                <div class="treasure-stats">
                    <span>⭐ ${project.stars}</span>
                </div>
            ` : ''}
        `;
        
        return card;
    }
    
    formatName(name) {
        return name
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }
}

// ===== CONTACT FORM =====
class MessagePod {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.submitBtn = this.form.querySelector('.transmit-button');
        this.originalText = this.submitBtn ? this.submitBtn.innerHTML : '';
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input focus effects
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => this.createBubbles(input));
        });
    }
    
    createBubbles(input) {
        const bubbles = input.parentElement.querySelector('.field-bubbles');
        if (bubbles) {
            bubbles.style.opacity = '1';
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validate()) return;
        
        // Show sending state
        this.submitBtn.innerHTML = '<span class="button-label">TRANSMITTING...</span>';
        this.submitBtn.classList.add('sending');
        this.submitBtn.disabled = true;
        
        // Simulate sending
        await this.simulateSend();
        
        // Show success
        this.submitBtn.innerHTML = '<span class="button-label">MESSAGE SENT! ✓</span>';
        this.submitBtn.classList.remove('sending');
        this.submitBtn.classList.add('success');
        
        // Reset
        setTimeout(() => {
            this.form.reset();
            this.submitBtn.innerHTML = this.originalText;
            this.submitBtn.classList.remove('success');
            this.submitBtn.disabled = false;
        }, 3000);
    }
    
    validate() {
        const name = this.form.querySelector('#name').value.trim();
        const email = this.form.querySelector('#email').value.trim();
        const message = this.form.querySelector('#message').value.trim();
        
        if (name.length < 2) {
            this.showNotification('Please enter your name', 'error');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email', 'error');
            return false;
        }
        
        if (message.length < 10) {
            this.showNotification('Message must be at least 10 characters', 'error');
            return false;
        }
        
        return true;
    }
    
    showNotification(text, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background: ${type === 'error' ? 'var(--bio-orange)' : 'var(--bio-green)'};
            color: var(--hadal);
            border-radius: 10px;
            font-weight: 600;
            z-index: 9999;
            animation: slideUp 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    simulateSend() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(notificationStyle);

// ===== WAVE TEXT ANIMATION =====
class WaveText {
    constructor() {
        this.waveTexts = document.querySelectorAll('.wave-text');
        this.init();
    }
    
    init() {
        this.waveTexts.forEach(text => {
            const content = text.textContent;
            text.innerHTML = '';
            text.setAttribute('data-text', content);
            
            [...content].forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = `${i * 0.1}s`;
                span.className = 'wave-char';
                text.appendChild(span);
            });
        });
    }
}

// ===== GLOW LETTER ANIMATION =====
class GlowLetters {
    constructor() {
        this.glowLetters = document.querySelectorAll('.glow-letter');
        this.init();
    }
    
    init() {
        this.glowLetters.forEach((letter, i) => {
            letter.style.animationDelay = `${i * 0.1}s`;
        });
    }
}

// ===== MOBILE DETECTION =====
class MobileHandler {
    constructor() {
        this.checkMobile();
        window.addEventListener('resize', utils.debounce(() => this.checkMobile(), 250));
    }
    
    checkMobile() {
        STATE.isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('is-mobile', STATE.isMobile);
    }
}

// ===== PARALLAX EFFECT =====
class OceanParallax {
    constructor() {
        if (STATE.isMobile || STATE.reducedMotion) return;
        
        this.elements = document.querySelectorAll('.sun-rays, .caustic-light');
        
        window.addEventListener('scroll', utils.throttle(() => this.update(), 16));
    }
    
    update() {
        const scrollY = window.scrollY;
        
        this.elements.forEach(el => {
            const speed = el.dataset.parallaxSpeed || 0.5;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 Initializing Deep Sea Portfolio...');
    
    // Core systems
    const loader = new DiveLoader();
    const mobileHandler = new MobileHandler();
    
    // Canvas and particles
    const deepSeaCanvas = new DeepSeaCanvas('deep-sea-canvas');
    
    // Cursor
    const cursor = new BioluminescentCursor();
    
    // Navigation and UI
    const depthGauge = new DepthGauge();
    const navigation = new JellyfishNavigation();
    
    // Typing effect
    const typing = new OceanTyping('.typing-ocean');
    
    // Scroll reveal
    const reveal = new DeepReveal();
    
    // Load projects from GitHub
    const treasures = new TreasureLoader('projectGrid');
    
    // Contact form
    const contactForm = new MessagePod('contactForm');
    
    // Text animations
    const waveText = new WaveText();
    const glowLetters = new GlowLetters();
    
    // Parallax
    const parallax = new OceanParallax();
    
    // Log completion
    console.log('🐙 Deep Sea Portfolio fully loaded!');
    console.log('📍 Current depth: 0m - Surface Zone');
});

// ===== EASTER EGG: KONAMI CODE =====
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            activateDeepSeaMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateDeepSeaMode() {
    console.log('🦑 DEEP SEA MODE ACTIVATED!');
    
    document.body.style.animation = 'deepSeaRave 0.5s ease infinite';
    
    // Create special creatures
    for (let i = 0; i < 10; i++) {
        const creature = document.createElement('div');
        creature.innerHTML = ['🦑', '🐙', '🦀', '🐠', '🐡', '🦈'][Math.floor(Math.random() * 6)];
        creature.style.cssText = `
            position: fixed;
            font-size: 3rem;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            z-index: 10000;
            animation: creatureSwim 3s ease-in-out infinite;
            pointer-events: none;
        `;
        document.body.appendChild(creature);
        
        setTimeout(() => creature.remove(), 5000);
    }
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Add easter egg animations
const easterEggStyle = document.createElement('style');
easterEggStyle.textContent = `
    @keyframes deepSeaRave {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    @keyframes creatureSwim {
        0%, 100% {
            transform: translateX(0) rotate(0deg);
        }
        25% {
            transform: translateX(50px) rotate(15deg);
        }
        50% {
            transform: translateX(0) rotate(0deg);
        }
        75% {
            transform: translateX(-50px) rotate(-15deg);
        }
    }
`;
document.head.appendChild(easterEggStyle);

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = performance.getEntriesByType('navigation')[0];
            if (timing) {
                console.log(`⚡ Page loaded in ${Math.round(timing.loadEventEnd)}ms`);
            }
        }, 0);
    });
}

// ===== VISIBILITY CHANGE HANDLER =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('🌙 Portfolio is resting in the deep...');
    } else {
        console.log('🌊 Welcome back to the ocean!');
    }
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DeepSeaCanvas,
        BioluminescentCursor,
        DepthGauge,
        JellyfishNavigation,
        OceanTyping,
        TreasureLoader,
        MessagePod
    };
}