import { Adapter, IntentDTO } from './Adapter';

export const ckbtcAdapter: Adapter = {
  id: 'ckbtc',
  label: 'ckBTC',
  
  async pay(intent: IntentDTO): Promise<{ ok: boolean; receiptHash?: string }> {
    // Mock ckBTC payment simulation
    const confirmed = window.confirm(
      `ckBTC Payment Simulation\n\n` +
      `Amount: ${(intent.amountMinor / 100).toFixed(2)} ${intent.currency.toUpperCase()}\n` +
      `Description: ${intent.description || 'Payment'}\n\n` +
      `Click OK to simulate successful ckBTC payment with on-chain receipt`
    );
    
    if (confirmed) {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { 
        ok: true, 
        receiptHash: `ckbtc:demo:${intent.id}` 
      };
    }
    
    return { ok: false };
  }
};
