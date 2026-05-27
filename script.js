/* ==========================================================================
   Pham Thanh Ha - Ghibli Professional Portfolio Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Theme Toggle (Day Sky / Starry Night Sky) ---
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');
  const starryBg = document.getElementById('starry-bg');
  
  // Initialize theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  if (savedTheme === 'dark') {
    createTwinklingStars();
  }

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Smooth transitions
    updateThemeIcon(newTheme);
    
    if (newTheme === 'dark') {
      createTwinklingStars();
    } else {
      clearTwinklingStars();
    }
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-moon';
      themeBtn.setAttribute('title', 'Chuyển sang chế độ ban ngày');
    } else {
      themeIcon.className = 'fa-regular fa-sun';
      themeBtn.setAttribute('title', 'Chuyển sang chế độ ban đêm');
    }
  }

  function createTwinklingStars() {
    clearTwinklingStars();
    const starCount = 80;
    const colors = ['#fff', '#fffae0', '#e0f3ff', '#fff4d6'];
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 2.5 + 1; // 1px to 3.5px
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      star.className = 'ghibli-star';
      star.style.position = 'absolute';
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.borderRadius = '50%';
      star.style.backgroundColor = color;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.left = `${Math.random() * 100}vw`;
      star.style.opacity = Math.random() * 0.8 + 0.2;
      
      // Star twinkling animation keyframe injected dynamically if not present
      star.style.animation = `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite alternate`;
      starryBg.appendChild(star);
    }
    
    // Inject animation CSS rule if not exists
    if (!document.getElementById('twinkle-style')) {
      const style = document.createElement('style');
      style.id = 'twinkle-style';
      style.innerHTML = `
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function clearTwinklingStars() {
    if (starryBg) starryBg.innerHTML = '';
  }


  // --- Sticky Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // --- Intersection Observer for Scroll Reveals ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // --- HTML5 Canvas Ghibli Leaves / Petals Particle System ---
  const canvas = document.getElementById('leaves-canvas');
  const ctx = canvas.getContext('2d');
  
  let animationFrameId;
  let particles = [];
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', () => {
    resizeCanvas();
  });
  resizeCanvas();

  class LeafParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Distribute evenly at startup
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 12 + 8; // Leaf size
      this.speedX = Math.random() * 1.5 + 0.5; // Wind blow speed to the right
      this.speedY = Math.random() * 1.2 + 0.8; // Falling speed
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 1.5 - 0.75;
      
      // Dynamic green / pink palette (leaves and sakura petals)
      const isSakura = Math.random() > 0.7;
      if (isSakura) {
        // Soft pink Ghibli Cherry Blossom
        this.color = `hsla(${Math.random() * 10 + 350}, 85%, 85%, ${Math.random() * 0.4 + 0.45})`;
        this.shapeType = 'sakura';
      } else {
        // Soft moss green Ghibli Leaf
        this.color = `hsla(${Math.random() * 40 + 90}, 50%, 65%, ${Math.random() * 0.4 + 0.45})`;
        this.shapeType = 'leaf';
      }
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      
      // Reset if gone off bottom or sides
      if (this.y > canvas.height + 20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      
      if (this.shapeType === 'leaf') {
        // Curved leaf geometry
        ctx.moveTo(0, -this.size / 2);
        ctx.quadraticCurveTo(this.size / 2, 0, 0, this.size / 2);
        ctx.quadraticCurveTo(-this.size / 2, 0, 0, -this.size / 2);
      } else {
        // Heart-like sakura petal geometry
        ctx.moveTo(0, -this.size / 2);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size / 2);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, -this.size / 2);
      }
      
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate particles
  const maxParticles = 40;
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new LeafParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    animationFrameId = requestAnimationFrame(animateParticles);
  }
  animateParticles();


  // --- Interactive Avatar Dialogues ---
  const avatarImg = document.getElementById('avatar-img');
  
  const ghibliQuotes = [
    "Chào bạn! Rất vui được gặp bạn ghé thăm portfolio của Thanh Hà! ✨",
    "“Gió vẫn thổi, ta phải sống!” — Hãy cùng nhau cố gắng nhé! 🍃",
    "“Một khi đã gặp, bạn sẽ không bao giờ quên đi thực tại.” — Chihiro 🌸",
    "Cảm ơn bạn đã ghé qua! Chúc bạn có một ngày làm việc ngập tràn năng lượng tích cực! ☀️",
    "Bạn có biết nhấp vào nút ở góc phải trên cùng để đổi bầu trời từ Ngày sang Đêm không? Try it! 🌙",
    "Ước mơ của Thanh Hà là cống hiến hết mình cho các chiến dịch Marketing sáng tạo. 🎯"
  ];
  
  let currentQuoteIndex = 0;
  let speechBubble = null;
  let bubbleTimeout = null;

  if (avatarImg) {
    avatarImg.parentElement.addEventListener('click', (e) => {
      e.stopPropagation();
      showSpeechBubble(ghibliQuotes[currentQuoteIndex]);
      currentQuoteIndex = (currentQuoteIndex + 1) % ghibliQuotes.length;
      
      // Cute bubble bounce action
      avatarImg.parentElement.style.transform = 'scale(0.96) rotate(-2deg)';
      setTimeout(() => {
        avatarImg.parentElement.style.transform = '';
      }, 150);
    });
  }

  function showSpeechBubble(text) {
    removeSpeechBubble();
    
    speechBubble = document.createElement('div');
    speechBubble.className = 'ghibli-speech-bubble';
    speechBubble.innerText = text;
    
    // Bubble absolute styling
    speechBubble.style.position = 'absolute';
    speechBubble.style.bottom = '100%';
    speechBubble.style.left = '50%';
    speechBubble.style.transform = 'translateX(-50%) translateY(-20px)';
    speechBubble.style.background = 'var(--card-bg)';
    speechBubble.style.border = '2px solid var(--accent-secondary)';
    speechBubble.style.borderRadius = '16px';
    speechBubble.style.padding = '0.9rem 1.4rem';
    speechBubble.style.fontSize = '0.9rem';
    speechBubble.style.fontWeight = '600';
    speechBubble.style.color = 'var(--text-primary)';
    speechBubble.style.boxShadow = 'var(--shadow-hover)';
    speechBubble.style.zIndex = '50';
    speechBubble.style.maxWidth = '250px';
    speechBubble.style.textAlign = 'center';
    speechBubble.style.backdropFilter = 'blur(8px)';
    speechBubble.style.animation = 'bubble-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    
    // Bubble indicator arrow
    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.top = '100%';
    arrow.style.left = '50%';
    arrow.style.transform = 'translateX(-50%)';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderStyle = 'solid';
    arrow.style.borderWidth = '10px 10px 0 10px';
    arrow.style.borderColor = 'var(--accent-secondary) transparent transparent transparent';
    speechBubble.appendChild(arrow);
    
    const arrowInner = document.createElement('div');
    arrowInner.style.position = 'absolute';
    arrowInner.style.top = '-12px';
    arrowInner.style.left = '50%';
    arrowInner.style.transform = 'translateX(-50%)';
    arrowInner.style.width = '0';
    arrowInner.style.height = '0';
    arrowInner.style.borderStyle = 'solid';
    arrowInner.style.borderWidth = '9px 9px 0 9px';
    arrowInner.style.borderColor = 'var(--card-bg) transparent transparent transparent';
    arrow.appendChild(arrowInner);
    
    avatarImg.parentElement.parentElement.appendChild(speechBubble);
    
    // Auto remove after 6 seconds
    bubbleTimeout = setTimeout(() => {
      removeSpeechBubble();
    }, 6000);
  }

  function removeSpeechBubble() {
    if (speechBubble) {
      speechBubble.remove();
      speechBubble = null;
    }
    if (bubbleTimeout) {
      clearTimeout(bubbleTimeout);
      bubbleTimeout = null;
    }
  }

  // Dismiss speech bubble when clicking elsewhere
  document.addEventListener('click', () => {
    removeSpeechBubble();
  });

  // Inject bubble popup animation
  if (!document.getElementById('bubble-style')) {
    const style = document.createElement('style');
    style.id = 'bubble-style';
    style.innerHTML = `
      @keyframes bubble-pop {
        0% { opacity: 0; transform: translateX(-50%) translateY(0px) scale(0.8); }
        100% { opacity: 1; transform: translateX(-50%) translateY(-20px) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }


  // --- Interactive Form Actions with custom Ghibli Toast Notification ---
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('inp-name').value;
      const email = document.getElementById('inp-email').value;
      const subject = document.getElementById('inp-subject').value;
      const message = document.getElementById('inp-message').value;
      
      // Perform validation check
      if (name && email && subject && message) {
        showGhibliToast(`🌸 Cảm ơn ${name}! Tin nhắn của bạn đã bay đi cùng gió và sẽ sớm phản hồi tới ${email}! 🍃`);
        contactForm.reset();
      }
    });
  }

  function showGhibliToast(messageText) {
    // Remove existing toast
    const existingToast = document.querySelector('.ghibli-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'ghibli-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.background = 'var(--accent-primary)';
    toast.style.color = '#fff';
    toast.style.padding = '1.2rem 2rem';
    toast.style.borderRadius = '16px';
    toast.style.boxShadow = 'var(--shadow-hover)';
    toast.style.zIndex = '2000';
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '700';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.75rem';
    toast.style.maxWidth = '380px';
    toast.style.lineHeight = '1.5';
    toast.style.backdropFilter = 'blur(10px)';
    toast.style.border = '2px solid rgba(255,255,255,0.2)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    toast.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles" style="font-size: 1.2rem; color: #ffeb3b;"></i> <span>${messageText}</span>`;
    
    document.body.appendChild(toast);
    
    // Triggers slide-up fade-in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);
    
    // Slide-down fade-out and delete
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 6000);
  }

  // --- Mobile Navigation Drawer (Toggling nav menu) ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      
      if (isVisible) {
        navLinks.style.display = 'none';
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--card-bg)';
        navLinks.style.padding = '2rem';
        navLinks.style.boxShadow = 'var(--shadow-hover)';
        navLinks.style.borderBottom = '1px solid var(--card-border)';
        navLinks.style.gap = '1.5rem';
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      }
    });

    // Close mobile nav after clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(l => {
      l.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
          mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
        }
      });
    });
  }

});
