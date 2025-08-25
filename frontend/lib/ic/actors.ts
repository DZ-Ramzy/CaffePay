import { HttpAgent } from "@dfinity/agent";

export async function getBackend() {
  // after `dfx deploy`, dfx writes TypeScript declarations to `./declarations/caffpay_backend`
  const { createActor } = await import("../../../src/declarations/caffpay_backend");
  const agent = new HttpAgent({ host: process.env.NEXT_PUBLIC_IC_HOST || "http://127.0.0.1:4943" });
  
  // local dev
  // @ts-ignore
  if (process.env.NEXT_PUBLIC_IC_DEV !== "false") await agent.fetchRootKey();
  
  // Hardcode canister ID for demo (should be from env vars in production)
  const canisterId = "uxrrr-q7777-77774-qaaaq-cai";
  
  return createActor(canisterId, { agent });
}
