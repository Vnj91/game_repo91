/**
 * Subscription Management
 */
const userSubscription = {
  async loadUserSubscription() {
    if (!state.currentUser) return;
    
    try {
      const subscription = await api.getUserSubscription(state.currentUser);
      state.userSubscription = subscription;
      this.updateSubscriptionUI();
    } catch (error) {
      console.log('No subscription found or error:', error);
      state.userSubscription = null;
      this.updateSubscriptionUI();
    }
  },
  
  updateSubscriptionUI() {
    if (state.userSubscription && state.userSubscription.isActive) {
      utils.$('#current-subscription').style.display = 'block';
      utils.$('#subscription-info').innerHTML = `
        <div class="active-subscription">
          <h4>${state.userSubscription.subscriptionType} Plan</h4>
          <p><strong>Price:</strong> ${utils.formatCurrency(state.userSubscription.monthlyPrice)}/month</p>
          <p><strong>Status:</strong> ${state.userSubscription.status}</p>
          <p><strong>Next billing:</strong> ${utils.formatDate(state.userSubscription.nextBillingDate)}</p>
        </div>
      `;
      utils.$('#cancelSubscriptionBtn').style.display = 'block';
      utils.$$('.subscribe-btn').forEach(btn => btn.style.display = 'none');
    } else {
      utils.$('#current-subscription').style.display = 'none';
      utils.$('#cancelSubscriptionBtn').style.display = 'none';
      utils.$$('.subscribe-btn').forEach(btn => btn.style.display = 'block');
    }
  },
  
  async subscribeToPlan(planType) {
    if (!state.currentUser) {
      ui.showStatus('Please create a profile first', 'error');
      return;
    }
    
    const button = document.querySelector(`[data-plan="${planType}"] .subscribe-btn`);
    
    try {
      ui.showLoading(button);
      
      const result = await api.createSubscription({
        username: state.currentUser,
        subscriptionType: planType,
        paymentMethod: 'WALLET'
      });
      
      if (result.success) {
        ui.showStatus(`Successfully subscribed to ${planType} plan!`, 'success');
        animations.createConfetti();
        await userProfile.loadUserProfile();
        await this.loadUserSubscription();
      } else {
        ui.showStatus(result.message || 'Subscription failed', 'error');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      ui.showStatus('Subscription failed. Please try again.', 'error');
    } finally {
      ui.hideLoading(button);
    }
  },
  
  async cancelSubscription() {
    if (!state.currentUser) return;
    
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }
    
    try {
      ui.showLoading(utils.$('#cancelSubscriptionBtn'));
      
      const result = await api.cancelSubscription(state.currentUser);
      
      if (result.success) {
        ui.showStatus('Subscription cancelled successfully', 'success');
        await this.loadUserSubscription();
      } else {
        ui.showStatus(result.message || 'Failed to cancel subscription', 'error');
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      ui.showStatus('Failed to cancel subscription. Please try again.', 'error');
    } finally {
      ui.hideLoading(utils.$('#cancelSubscriptionBtn'));
    }
  }
};
