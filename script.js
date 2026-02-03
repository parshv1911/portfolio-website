// ============================================
// SMOOTH SCROLLING & ACTIVE NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Active navigation link highlighting
  const navLinks = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
  observer.observe(el);
});

// ============================================
// SKILL PROGRESS BAR ANIMATION
// ============================================

const skillObserverOptions = {
  threshold: 0.5
};

const skillObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBars = entry.target.querySelectorAll('.skill-progress');
      progressBars.forEach((bar, index) => {
        setTimeout(() => {
          bar.style.width = bar.style.width;
        }, index * 100);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, skillObserverOptions);

document.querySelectorAll('.skills').forEach(section => {
  skillObserver.observe(section);
});

// ============================================
// CONTACT FORM HANDLING WITH BACKEND API
// ============================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const nameInput = this.querySelector('input[type="text"]');
    const emailInput = this.querySelector('input[type="email"]');
    const messageInput = this.querySelector('textarea');
    const phoneInput = this.querySelector('input[type="tel"]');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const phone = phoneInput ? phoneInput.value.trim() : '';
    
    // Validation
    if (!name || !email || !message) {
      showFormMessage('Please fill in all required fields', 'error');
      return;
    }
    
    if (message.length < 10) {
      showFormMessage('Message must be at least 10 characters long', 'error');
      return;
    }
    
    // Disable submit button
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    try {
      // Send to backend API
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          subject: 'Portfolio Contact Form Submission'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showFormMessage('✅ ' + data.message, 'success');
        this.reset();
        
        // Clear message after 5 seconds
        setTimeout(() => {
          showFormMessage('', 'success');
        }, 5000);
      } else {
        showFormMessage('❌ ' + (data.message || 'Failed to send message'), 'error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showFormMessage('❌ Network error. Please try again later.', 'error');
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

// Show form message function
function showFormMessage(message, type) {
  let messageElement = document.getElementById('form-message');
  
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.id = 'form-message';
    messageElement.style.cssText = `
      padding: 12px 16px;
      margin: 15px 0;
      border-radius: 6px;
      text-align: center;
      font-weight: 500;
      transition: all 0.3s ease;
    `;
    
    if (contactForm) {
      contactForm.insertAdjacentElement('afterbegin', messageElement);
    }
  }
  
  if (message) {
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    if (type === 'success') {
      messageElement.style.backgroundColor = '#d4edda';
      messageElement.style.color = '#155724';
      messageElement.style.borderLeft = '4px solid #28a745';
    } else if (type === 'error') {
      messageElement.style.backgroundColor = '#f8d7da';
      messageElement.style.color = '#721c24';
      messageElement.style.borderLeft = '4px solid #f5222d';
    }
  } else {
    messageElement.style.display = 'none';
  }
}

// ============================================
// PARALLAX EFFECT ON HERO SECTION
// ============================================

window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrollPosition = window.pageYOffset;
    const parallaxElements = hero.querySelectorAll('::before, ::after');
    
    if (scrollPosition < window.innerHeight) {
      hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
  }
});

// ============================================
// TYPEWRITER EFFECT FOR HERO TITLE (Optional)
// ============================================

function typeWriterEffect() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  let index = 0;
  
  function type() {
    if (index < text.length) {
      heroTitle.textContent += text.charAt(index);
      index++;
      setTimeout(type, 50);
    }
  }
  
  // Uncomment to enable typewriter effect
  // type();
}

// ============================================
// SCROLL-TO-TOP BUTTON
// ============================================

function createScrollToTopButton() {
  const button = document.createElement('button');
  button.innerHTML = '↑';
  button.classList.add('scroll-to-top');
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #00d4ff, #ff6b6b);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    display: none;
    z-index: 999;
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(button);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

createScrollToTopButton();

// ============================================
// ADD ANIMATION DELAY TO ELEMENTS
// ============================================

function addAnimationDelays() {
  const fadeInElements = document.querySelectorAll('.fade-in');
  fadeInElements.forEach((el, index) => {
    if (!el.style.animationDelay) {
      el.style.animationDelay = `${index * 0.1}s`;
    }
  });
}

addAnimationDelays();

// ============================================
// SMOOTH SCROLL BEHAVIOR FOR ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
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

// ============================================
// DARK MODE / LIGHT MODE TOGGLE (Optional)
// ============================================

function initThemeToggle() {
  const isDarkMode = localStorage.getItem('darkMode') !== 'false';
  
  function setTheme(isDark) {
    if (isDark) {
      document.documentElement.style.setProperty('--bg-dark', '#0a0e27');
      document.documentElement.style.setProperty('--text-primary', '#f0f0f0');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.style.setProperty('--bg-dark', '#f0f0f0');
      document.documentElement.style.setProperty('--text-primary', '#1a1a1a');
      localStorage.setItem('darkMode', 'false');
    }
  }
  
  setTheme(isDarkMode);
}

// Uncomment to enable theme toggle
// initThemeToggle();

// ============================================
// MOUSE FOLLOW EFFECT (Optional)
// ============================================

function initMouseFollowEffect() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    const heroBefore = hero.querySelector('::before');
    if (heroBefore) {
      hero.style.setProperty('--mouse-x', `${x * 100}%`);
      hero.style.setProperty('--mouse-y', `${y * 100}%`);
    }
  });
}

// Uncomment to enable mouse follow effect
// initMouseFollowEffect();

// ============================================
// LAZY LOADING IMAGES
// ============================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// ANIMATE NUMBERS ON SCROLL
// ============================================

function animateNumbers() {
  const stats = document.querySelectorAll('.stat-item h3');
  
  stats.forEach(stat => {
    const target = parseInt(stat.textContent);
    if (isNaN(target)) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let current = 0;
        const increment = target / 30;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            stat.textContent = target + '+';
            clearInterval(counter);
          } else {
            stat.textContent = Math.floor(current) + '+';
          }
        }, 30);
        
        observer.unobserve(stat);
      }
    });
    
    observer.observe(stat);
  });
}

animateNumbers();

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c Welcome to my Portfolio! ', 'background: linear-gradient(135deg, #00d4ff, #ff6b6b); color: white; font-size: 16px; padding: 10px;');
console.log('%c Feel free to reach out! ', 'background: #1a1f3a; color: #00d4ff; font-size: 14px; padding: 5px;');
