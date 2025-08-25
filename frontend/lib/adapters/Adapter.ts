export type ProviderId = "stripe" | "paypal" | "ckbtc";

export type IntentDTO = { 
  id: string; 
  amountMinor: number; 
  currency: string; 
  description?: string; 
};

export interface Adapter { 
  id: ProviderId; 
  label: string; 
  pay(i: IntentDTO): Promise<{ ok: boolean; receiptHash?: string }>; 
}
