/**
 * User Library and Purchases
 */
const userLibrary = {
  async loadUserPurchases() {
    if (!state.currentUser) return;
    
    try {
      ui.showLoading(utils.$('#library-loading'));
      utils.$('#library-empty').style.display = 'none';
      
      state.userPurchases = await api.getUserPurchases(state.currentUser);
      this.renderPurchases(state.userPurchases);
      
      ui.hideLoading(utils.$('#library-loading'));
    } catch (error) {
      console.error('Failed to load purchases:', error);
      ui.showStatus('Failed to load your games', 'error');
      ui.hideLoading(utils.$('#library-loading'));
      this.showEmptyState();
    }
  },
  
  renderPurchases(purchases) {
    if (!purchases || purchases.length === 0) {
      this.showEmptyState();
      return;
    }
    
    utils.$('#purchases-list').innerHTML = purchases.map(purchase => this.createPurchaseItem(purchase)).join('');
  },
  
  createPurchaseItem(purchase) {
    const game = state.games.find(g => g.id === purchase.gameId);
    if (!game) return '';
    
    return `
      <div class="purchase-item" role="listitem">
        <img src="${game.imageUrl}" alt="${utils.escapeHtml(game.title)}" class="purchase-image" loading="lazy">
        <div class="purchase-content">
          <h4 class="purchase-title">${utils.escapeHtml(game.title)}</h4>
          <p class="purchase-date">Purchased on ${utils.formatDate(purchase.purchaseDate)}</p>
          <p class="purchase-price">${utils.formatCurrency(purchase.price)}</p>
          <span class="purchase-status status-${purchase.status.toLowerCase()}">${purchase.status}</span>
        </div>
      </div>
    `;
  },
  
  showEmptyState() {
    utils.$('#purchases-list').innerHTML = '';
    utils.$('#library-empty').style.display = 'block';
  }
};
