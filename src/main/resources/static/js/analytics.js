/**
 * Analytics and Statistics
 */
const analytics = {
  async loadAnalytics() {
    try {
      const [topSpenders, topBuyers, storeStats] = await Promise.all([
        api.getTopSpenders(5),
        api.getTopBuyers(5),
        api.getStoreStats()
      ]);
      
      this.updateAnalyticsUI(topSpenders, topBuyers, storeStats);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      ui.showStatus('Failed to load analytics data', 'error');
    }
  },
  
  updateAnalyticsUI(topSpenders, topBuyers, storeStats) {
    utils.$('#totalRevenue').textContent = utils.formatCurrency(storeStats.totalRevenue || 0);
    utils.$('#totalUsers').textContent = storeStats.totalUsers || 0;
    utils.$('#totalGames').textContent = storeStats.totalGames || 0;
    utils.$('#activeSubscriptions').textContent = storeStats.totalActiveSubscriptions || 0;
    
    utils.$('#topSpenders').innerHTML = topSpenders.map((spender, index) => `
      <li role="listitem">
        <span class="rank">${index + 1}</span>
        <span class="username">${utils.escapeHtml(spender.username)}</span>
        <span class="amount">${utils.formatCurrency(spender.totalSpent)}</span>
      </li>
    `).join('');
    
    utils.$('#topBuyers').innerHTML = topBuyers.map((buyer, index) => `
      <li role="listitem">
        <span class="rank">${index + 1}</span>
        <span class="username">${utils.escapeHtml(buyer.username)}</span>
        <span class="count">${buyer.purchaseCount} games</span>
      </li>
    `).join('');
  }
};
