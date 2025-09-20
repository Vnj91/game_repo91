/**
 * Configuration and Constants
 */
const CONFIG = {
  API_BASE: '/api/store',
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 24,
  MAX_WALLET_AMOUNT: 1000,
  MIN_WALLET_AMOUNT: 0.01
};

/**
 * Application State
 */
const state = {
  currentUser: null,
  games: [],
  userProfile: null,
  userSubscription: null,
  userPurchases: [],
  currentSection: 'store'
};
