// Import styles - Vite will bundle this
import './style.css'

// ===== DOM Elements =====
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const tabBtns = document.querySelectorAll('.tab-btn');
const servicePanels = document.querySelectorAll('.service-panel');
const inquiryForm = document.getElementById('inquiryForm');

// ===== Initialize AOS =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 0,
      disable: false
    });
  }

  // Set initial active navigation
  setActiveNavLink();

  // Handle initial scroll state
  handleHeaderScroll();

  console.log('Sri Manjunatheswara Industries website initialized');
});

// Refresh AOS after all images load
window.addEventListener('load', () => {
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
});

// ===== Header Scroll Effect =====
let lastScrollY = window.scrollY;

function handleHeaderScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleHeaderScroll);

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
  const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
  icon.textContent = mobileMenu.classList.contains('active') ? 'close' : 'menu';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
  });
});

// ===== Active Navigation Link =====
function setActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', setActiveNavLink);

// ===== Service Tabs =====
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');

    // Update active button
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update active panel
    servicePanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === targetTab) {
        panel.classList.add('active');
      }
    });
  });
});

// ===== Form Handling =====
inquiryForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData);

  // Validate required fields
  if (!data.name || !data.email || !data.phone || !data.message) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }

  // Validate phone (basic Indian phone validation)
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = data.phone.replace(/[\s-+]/g, '').replace(/^91/, '');
  if (!phoneRegex.test(cleanPhone)) {
    showNotification('Please enter a valid phone number.', 'error');
    return;
  }

  // Show success message
  showNotification('Thank you! Your inquiry has been sent. We will contact you soon.', 'success');

  // Reset form
  this.reset();

  // Log form data (in production, this would be sent to a server)
  console.log('Inquiry submitted:', data);
});

// ===== Notification System =====
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span>
        <span>${message}</span>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.4s ease forwards;
    `;

  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease forwards';
    setTimeout(() => notification.remove(), 400);
  }, 5000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(notificationStyles);

// ===== Smooth Scroll for Internal Links =====
// ===== Smooth Scroll for Internal Links =====
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

// ===== Theme Manager =====
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const themeIcons = document.querySelectorAll('.theme-icon, .theme-icon-mobile');

// Check for saved theme or system preference
const savedTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
let currentTheme = savedTheme || 'dark'; // Default to dark if no preference

// Apply theme on load
applyTheme(currentTheme);

function applyTheme(theme) {
  // Update DOM
  document.documentElement.setAttribute('data-theme', theme);

  // Update Icons
  // If Dark Theme -> Show Sun (light_mode) to switch to light
  // If Light Theme -> Show Moon (dark_mode) to switch to dark
  const iconName = theme === 'dark' ? 'light_mode' : 'dark_mode';

  themeIcons.forEach(icon => {
    icon.textContent = iconName;
  });

  // Update text for mobile button
  const mobileText = document.querySelector('.theme-toggle-mobile span:last-child');
  if (mobileText) {
    mobileText.textContent = theme === 'dark' ? 'Switch to Light' : 'Switch to Dark';
  }

  // Save preference
  localStorage.setItem('theme', theme);
  currentTheme = theme;
}

// Event Listeners
function toggleTheme() {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

if (themeToggleMobile) {
  themeToggleMobile.addEventListener('click', () => {
    toggleTheme();
    // Don't close menu immediately so user can see the change
  });
}
