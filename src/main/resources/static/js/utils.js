/**
 * Utility Functions
 */
const utils = {
  // DOM Helpers
  $(selector) {
    return document.querySelector(selector);
  },
  
  $$(selector) {
    return document.querySelectorAll(selector);
  },
  
  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  // Debounce function calls
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
  
  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },
  
  // Format date
  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  },
  
  // Validate username
  validateUsername(username) {
    if (!username || username.length < CONFIG.MIN_USERNAME_LENGTH) {
      return `Username must be at least ${CONFIG.MIN_USERNAME_LENGTH} characters long`;
    }
    if (username.length > CONFIG.MAX_USERNAME_LENGTH) {
      return `Username must be no more than ${CONFIG.MAX_USERNAME_LENGTH} characters long`;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    return null;
  },
  
  // Validate wallet amount
  validateWalletAmount(amount) {
    const num = parseFloat(amount);
    if (isNaN(num) || num < CONFIG.MIN_WALLET_AMOUNT) {
      return 'Amount must be at least $0.01';
    }
    if (num > CONFIG.MAX_WALLET_AMOUNT) {
      return `Amount cannot exceed $${CONFIG.MAX_WALLET_AMOUNT}`;
    }
    return null;
  }
};
