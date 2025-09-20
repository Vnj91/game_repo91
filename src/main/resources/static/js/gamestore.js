/**
 * Game Store Functionality
 */
const gameStore = {
  async loadGames() {
    try {
      ui.showLoading(utils.$('#games-loading'));
      utils.$('#games-empty').style.display = 'none';
      
      state.games = await api.getGames();
      this.renderGames(state.games);
      
      ui.hideLoading(utils.$('#games-loading'));
    } catch (error) {
      console.error('Failed to load games:', error);
      ui.showStatus('Failed to load games. Please try again.', 'error');
      ui.hideLoading(utils.$('#games-loading'));
      this.showEmptyState('Failed to load games', 'Please refresh the page and try again.');
    }
  },
  
  renderGames(games) {
    if (!games || games.length === 0) {
      this.showEmptyState();
      return;
    }
    
    utils.$('#games-grid').innerHTML = games.map(game => this.createGameCard(game)).join('');
    
    // Add event listeners
    utils.$('#games-grid').querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn')) {
          this.showGameDetails(card.dataset.gameId);
        }
      });
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.showGameDetails(card.dataset.gameId);
        }
      });
    });
  },
  
  createGameCard(game) {
    const isOwned = state.userPurchases.some(purchase => purchase.gameId === game.id);
    const canAfford = state.userProfile && state.userProfile.walletBalance >= game.price;
    
    return `
      <div class="game-card" data-game-id="${game.id}" tabindex="0" role="button" aria-label="View details for ${utils.escapeHtml(game.title)}">
        <img src="${game.imageUrl}" alt="${utils.escapeHtml(game.title)}" class="game-image" loading="lazy">
        <div class="game-content">
          <h3 class="game-title">${utils.escapeHtml(game.title)}</h3>
          <p class="game-description">${utils.escapeHtml(game.description)}</p>
          <div class="game-meta">
            <div class="game-price">${utils.formatCurrency(game.price)}</div>
            <div class="game-rating" aria-label="Rating: ${game.rating} out of 5">
              <span aria-hidden="true">⭐</span>
              <span>${game.rating}</span>
            </div>
          </div>
          <div class="game-actions">
            ${isOwned ? 
              '<span class="btn btn-secondary" disabled>Owned</span>' :
              `<button class="btn btn-primary purchase-btn magnetic-btn" data-game-id="${game.id}" ${!canAfford ? 'disabled' : ''}>
                <span class="btn-text">Purchase</span>
                <span class="btn-loading" aria-hidden="true">Purchasing...</span>
              </button>`
            }
          </div>
        </div>
      </div>
    `;
  },
  
  showGameDetails(gameId) {
    const game = state.games.find(g => g.id === gameId);
    if (game) {
      ui.showStatus(`Viewing details for ${game.title}`, 'info', 2000);
    }
  },
  
  async purchaseGame(gameId) {
    if (!state.currentUser) {
      ui.showStatus('Please create a profile first', 'error');
      return;
    }
    
    const game = state.games.find(g => g.id === gameId);
    if (!game) {
      ui.showStatus('Game not found', 'error');
      return;
    }
    
    const button = utils.$('#games-grid').querySelector(`[data-game-id="${gameId}"] .purchase-btn`);
    
    try {
      ui.showLoading(button);
      
      const result = await api.purchaseGame({
        username: state.currentUser,
        gameId: gameId,
        paymentMethod: 'WALLET'
      });
      
      if (result.success) {
        ui.showStatus(`Successfully purchased ${game.title}!`, 'success');
        animations.createConfetti();
        
        await userProfile.loadUserProfile();
        await userLibrary.loadUserPurchases();
        this.renderGames(state.games);
      } else {
        ui.showStatus(result.message || 'Purchase failed', 'error');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      ui.showStatus('Purchase failed. Please try again.', 'error');
    } finally {
      ui.hideLoading(button);
    }
  },
  
  filterGames() {
    const category = utils.$('#categoryFilter').value;
    let filteredGames = state.games;
    
    if (category) {
      filteredGames = state.games.filter(game => game.category === category);
    }
    
    this.renderGames(filteredGames);
  },
  
  async searchGames() {
    const query = utils.$('#searchInput').value.trim();
    
    if (!query) {
      this.renderGames(state.games);
      return;
    }
    
    try {
      ui.showLoading(utils.$('#games-loading'));
      const searchResults = await api.searchGames(query);
      this.renderGames(searchResults);
      ui.hideLoading(utils.$('#games-loading'));
    } catch (error) {
      console.error('Search failed:', error);
      ui.showStatus('Search failed. Please try again.', 'error');
      ui.hideLoading(utils.$('#games-loading'));
    }
  },
  
  showEmptyState(title = 'No games found', message = 'Try adjusting your search or filter criteria') {
    utils.$('#games-grid').innerHTML = '';
    utils.$('#games-empty').style.display = 'block';
    utils.$('#games-empty').querySelector('h3').textContent = title;
    utils.$('#games-empty').querySelector('p').textContent = message;
  }
};
