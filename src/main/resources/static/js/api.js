/**
 * API Client
 */
const api = {
  async request(url, options = {}) {
    const defaultOptions = {
      headers: { 'Content-Type': 'application/json' }
    };
    const config = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  // Games
  getGames() { 
    return this.request(`${CONFIG.API_BASE}/games`); 
  },
  
  searchGames(query) { 
    return this.request(`${CONFIG.API_BASE}/games/search?q=${encodeURIComponent(query)}`); 
  },
  
  // Users
  createUser(data) { 
    return this.request(`${CONFIG.API_BASE}/users`, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }); 
  },
  
  getUser(username) { 
    return this.request(`${CONFIG.API_BASE}/users/${username}`); 
  },
  
  addToWallet(username, amount) { 
    return this.request(`${CONFIG.API_BASE}/users/${username}/wallet/add`, { 
      method: 'POST', 
      body: JSON.stringify({ amount }) 
    }); 
  },
  
  // Purchases
  purchaseGame(data) { 
    return this.request(`${CONFIG.API_BASE}/purchases`, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }); 
  },
  
  getUserPurchases(username) { 
    return this.request(`${CONFIG.API_BASE}/users/${username}/purchases`); 
  },
  
  // Subscriptions
  createSubscription(data) { 
    return this.request(`${CONFIG.API_BASE}/subscriptions`, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }); 
  },
  
  getUserSubscription(username) { 
    return this.request(`${CONFIG.API_BASE}/users/${username}/subscription`); 
  },
  
  cancelSubscription(username) { 
    return this.request(`${CONFIG.API_BASE}/users/${username}/subscription/cancel`, { 
      method: 'POST' 
    }); 
  },
  
  // Analytics
  getTopSpenders(limit = 10) { 
    return this.request(`${CONFIG.API_BASE}/analytics/top-spenders?limit=${limit}`); 
  },
  
  getTopBuyers(limit = 10) { 
    return this.request(`${CONFIG.API_BASE}/analytics/top-buyers?limit=${limit}`); 
  },
  
  getStoreStats() { 
    return this.request(`${CONFIG.API_BASE}/analytics/stats`); 
  }
};
