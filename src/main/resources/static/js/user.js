/**
 * User Profile and Authentication
 */
const userProfile = {
  async createUserProfile() {
    const username = utils.$('#playerName').value.trim();
    const validationError = utils.validateUsername(username);
    
    if (validationError) {
      ui.showStatus(validationError, 'error');
      utils.$('#playerName').focus();
      return;
    }
    
    try {
      ui.showLoading(utils.$('#createProfileBtn'));
      
      const profile = await api.createUser({
        username: username,
        email: `${username}@example.com`,
        fullName: username
      });
      
      state.currentUser = username;
      this.updateAuthUI();
      ui.showStatus(`Profile created for ${username}`, 'success');
      
      await this.loadUserProfile();
      await userSubscription.loadUserSubscription();
      await userLibrary.loadUserPurchases();
      
    } catch (error) {
      console.error('Failed to create profile:', error);
      ui.showStatus('Failed to create profile. Please try again.', 'error');
    } finally {
      ui.hideLoading(utils.$('#createProfileBtn'));
    }
  },
  
  async loadUserProfile() {
    if (!state.currentUser) return;
    
    try {
      state.userProfile = await api.getUser(state.currentUser);
      this.updateProfileUI();
    } catch (error) {
      console.error('Failed to load user profile:', error);
      ui.showStatus('Failed to load profile data', 'error');
    }
  },
  
  updateAuthUI() {
    if (state.currentUser) {
      utils.$('#auth-form').style.display = 'none';
      utils.$('#user-info').style.display = 'flex';
      utils.$('#current-user-name').textContent = state.currentUser;
    } else {
      utils.$('#auth-form').style.display = 'flex';
      utils.$('#user-info').style.display = 'none';
    }
  },
  
  updateProfileUI() {
    if (!state.userProfile) return;
    
    utils.$('#walletBalance').textContent = utils.formatCurrency(state.userProfile.walletBalance);
    utils.$('#gamesOwned').textContent = state.userProfile.purchaseHistory?.length || 0;
    utils.$('#totalSpent').textContent = utils.formatCurrency(state.userProfile.totalSpent || 0);
    utils.$('#premiumStatus').textContent = state.userProfile.premiumMember ? 'Yes' : 'No';
  },
  
  async addToWallet() {
    if (!state.currentUser) {
      ui.showStatus('Please create a profile first', 'error');
      return;
    }
    
    const amount = parseFloat(utils.$('#walletAmount').value);
    const validationError = utils.validateWalletAmount(amount);
    
    if (validationError) {
      ui.showStatus(validationError, 'error');
      utils.$('#walletAmount').focus();
      return;
    }
    
    try {
      ui.showLoading(utils.$('#addWalletBtn'));
      
      const result = await api.addToWallet(state.currentUser, amount);
      
      if (result.success) {
        ui.showStatus(`Added ${utils.formatCurrency(amount)} to wallet`, 'success');
        utils.$('#walletAmount').value = '';
        await this.loadUserProfile();
      } else {
        ui.showStatus(result.message || 'Failed to add funds', 'error');
      }
    } catch (error) {
      console.error('Failed to add funds:', error);
      ui.showStatus('Failed to add funds. Please try again.', 'error');
    } finally {
      ui.hideLoading(utils.$('#addWalletBtn'));
    }
  },
  
  logout() {
    state.currentUser = null;
    state.userProfile = null;
    state.userSubscription = null;
    state.userPurchases = [];
    
    this.updateAuthUI();
    ui.showStatus('Logged out successfully', 'info');
    utils.$('#playerName').value = '';
    ui.switchSection('store');
  }
};
