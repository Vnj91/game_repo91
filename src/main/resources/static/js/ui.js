/**
 * UI Components and Interactions
 */
const ui = {
  showStatus(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
    const status = utils.$('#system-status');
    const text = utils.$('.status-text');
    
    status.className = 'system-status';
    if (type !== 'info') status.classList.add(type);
    
    text.textContent = message;
    status.style.display = 'flex';
    
    if (duration > 0) {
      setTimeout(() => this.hideStatus(), duration);
    }
    
    this.announceToScreenReader(message);
  },
  
  hideStatus() {
    utils.$('#system-status').style.display = 'none';
  },
  
  showLoading(element, message = 'Loading...') {
    if (element) {
      element.classList.add('loading');
      const loadingText = element.querySelector('.btn-loading');
      if (loadingText) loadingText.textContent = message;
    }
  },
  
  hideLoading(element) {
    if (element) element.classList.remove('loading');
  },
  
  toggleLoadingScreen(show) {
    const screen = utils.$('#loading-screen');
    if (show) {
      screen.classList.remove('hidden');
    } else {
      screen.classList.add('hidden');
    }
  },
  
  switchSection(sectionName) {
    // Update navigation
    utils.$$('.nav-link').forEach(link => {
      link.classList.remove('active');
      link.setAttribute('aria-current', 'false');
      if (link.dataset.section === sectionName) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
    
    // Update content sections
    utils.$$('.content-section').forEach(section => {
      section.classList.remove('active');
      if (section.id === `${sectionName}-section`) {
        section.classList.add('active');
      }
    });
    
    state.currentSection = sectionName;
    document.title = `${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} - GameStore`;
    this.announceToScreenReader(`Switched to ${sectionName} section`);
  },
  
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  },
  
  createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
};
