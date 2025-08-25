import { Adapter, IntentDTO } from './Adapter';

export const paypalAdapter: Adapter = {
  id: 'paypal',
  label: 'PayPal',
  
  async pay(intent: IntentDTO): Promise<{ ok: boolean; receiptHash?: string }> {
    // Mock PayPal payment modal simulation
    const confirmed = window.confirm(
      `PayPal Payment Simulation\n\n` +
      `Amount: ${(intent.amountMinor / 100).toFixed(2)} ${intent.currency.toUpperCase()}\n` +
      `Description: ${intent.description || 'Payment'}\n\n` +
      `Click OK to simulate successful PayPal payment`
    );
    
    if (confirmed) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { ok: true };
    }
    
    return { ok: false };
  }
};
