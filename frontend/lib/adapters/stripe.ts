import { Adapter, IntentDTO } from './Adapter';

export const stripeAdapter: Adapter = {
  id: 'stripe',
  label: 'Stripe',
  
  async pay(intent: IntentDTO): Promise<{ ok: boolean; receiptHash?: string }> {
    // Mock payment modal simulation
    const confirmed = window.confirm(
      `Stripe Payment Simulation\n\n` +
      `Amount: ${(intent.amountMinor / 100).toFixed(2)} ${intent.currency.toUpperCase()}\n` +
      `Description: ${intent.description || 'Payment'}\n\n` +
      `Click OK to simulate successful payment`
    );
    
    if (confirmed) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ok: true };
    }
    
    return { ok: false };
  }
};
