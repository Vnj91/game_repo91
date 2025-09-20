/**
 * Main Application Entry Point
 */
const app = {
  async init() {
    try {
      ui.toggleLoadingScreen(true);
      
      animations.init();
      eventHandlers.init();
      
      await Promise.all([
        gameStore.loadGames(),
        analytics.loadAnalytics()
      ]);
      
      setTimeout(() => {
        ui.toggleLoadingScreen(false);
        ui.showStatus('Welcome to GameStore! Create a profile to get started.', 'info');
      }, 1000);
      
    } catch (error) {
      console.error('Failed to initialize application:', error);
      ui.toggleLoadingScreen(false);
      ui.showStatus('Failed to load application. Please refresh the page.', 'error');
    }
  }
};

// Global Functions
window.switchSection = (sectionName) => {
  ui.switchSection(sectionName);
};

// Start Application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', app.init);
} else {
  app.init();
}
