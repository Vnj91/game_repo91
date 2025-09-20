/**
 * Event Handlers
 */
const eventHandlers = {
  init() {
    // Navigation
    utils.$$('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        ui.switchSection(link.dataset.section);
      });
    });
    
    // Authentication
    utils.$('#createProfileBtn').addEventListener('click', (e) => {
      e.preventDefault();
      userProfile.createUserProfile();
    });
    
    utils.$('#logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      userProfile.logout();
    });
    
    // Store
    utils.$('#categoryFilter').addEventListener('change', () => {
      gameStore.filterGames();
    });
    
    utils.$('#searchBtn').addEventListener('click', (e) => {
      e.preventDefault();
      gameStore.searchGames();
    });
    
    utils.$('#searchInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        gameStore.searchGames();
      }
    });
    
    utils.$('#searchInput').addEventListener('input', utils.debounce(() => {
      gameStore.searchGames();
    }, CONFIG.DEBOUNCE_DELAY));
    
    // Profile
    utils.$('#addWalletBtn').addEventListener('click', (e) => {
      e.preventDefault();
      userProfile.addToWallet();
    });
    
    // Subscriptions
    utils.$$('.subscribe-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        userSubscription.subscribeToPlan(btn.dataset.plan);
      });
    });
    
    utils.$('#cancelSubscriptionBtn').addEventListener('click', (e) => {
      e.preventDefault();
      userSubscription.cancelSubscription();
    });
    
    // System status
    utils.$('.status-close').addEventListener('click', () => {
      ui.hideStatus();
    });
    
    // Game purchases
    utils.$('#games-grid').addEventListener('click', (e) => {
      if (e.target.classList.contains('purchase-btn')) {
        e.preventDefault();
        e.stopPropagation();
        gameStore.purchaseGame(e.target.dataset.gameId);
      }
    });
    
    // Ripple effects
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        ui.createRipple(e);
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        ui.hideStatus();
      }
    });
    
    // Form validation
    utils.$('#playerName').addEventListener('input', (e) => {
      const error = utils.validateUsername(e.target.value);
      e.target.setCustomValidity(error || '');
    });
    
    utils.$('#walletAmount').addEventListener('input', (e) => {
      const error = utils.validateWalletAmount(e.target.value);
      e.target.setCustomValidity(error || '');
    });
  }
};
