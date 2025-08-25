import { Terminal, Code, Shield, Zap } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
        <p className="text-xl text-gray-300">
          Complete guide to setting up and customizing CaffePay for your needs.
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <Zap className="w-6 h-6 text-indigo-400" />
          90-Second Quickstart
        </h2>
        
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">1. Prerequisites</h3>
          <div className="space-y-2 text-gray-300">
            <p>• <a href="https://smartcontracts.org/docs/quickstart/local-quickstart.html" className="text-indigo-400 hover:underline">DFX SDK</a> installed</p>
            <p>• <a href="https://rustup.rs/" className="text-indigo-400 hover:underline">Rust</a> with wasm32-unknown-unknown target</p>
            <p>• <a href="https://nodejs.org/" className="text-indigo-400 hover:underline">Node.js</a> and pnpm</p>
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">2. Clone and Setup</h3>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
            <div className="text-green-400"># Clone the repository</div>
            <div>git clone https://github.com/your-org/caffepay.git</div>
            <div>cd caffepay</div>
            <br />
            <div className="text-green-400"># Install dependencies</div>
            <div>cd frontend && pnpm install && cd ..</div>
            <br />
            <div className="text-green-400"># Add Rust target</div>
            <div>rustup target add wasm32-unknown-unknown</div>
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">3. Deploy Locally</h3>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
            <div className="text-green-400"># Start local IC replica</div>
            <div>pnpm ic:start</div>
            <br />
            <div className="text-green-400"># Build and deploy</div>
            <div>pnpm ic:deploy:local</div>
            <br />
            <div className="text-green-400"># Frontend will be available at:</div>
            <div className="text-indigo-400">http://localhost:4943/?canisterId=&lt;frontend_canister_id&gt;</div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">4. Deploy to IC Mainnet</h3>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
            <div className="text-green-400"># Deploy to mainnet (requires cycles)</div>
            <div>pnpm ic:deploy:ic</div>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-400" />
          Security & Custody
        </h2>
        
        <div className="glass-card p-6 border-l-4 border-red-500">
          <div className="space-y-4 text-gray-300">
            <p className="font-semibold text-white">⚠️ Important Security Notes:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>No Custody:</strong> CaffePay does not hold funds. All payments go directly to your configured provider accounts.</li>
              <li><strong>Demo Keys:</strong> Provider configurations in this template store keys in plain text for demonstration only.</li>
              <li><strong>Production Setup:</strong> Implement proper key management, encryption, and access controls before production use.</li>
              <li><strong>Audit Required:</strong> Have your implementation security audited before handling real payments.</li>
            </ul>
            <p className="text-yellow-400">
              This template is for educational and development purposes. Production deployments require additional security measures.
            </p>
          </div>
        </div>
      </section>

      {/* Custom Adapters */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <Code className="w-6 h-6 text-purple-400" />
          Adding a New Payment Adapter
        </h2>
        
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">1. Create Adapter File</h3>
            <p className="text-gray-300 mb-4">Create a new file in <code className="bg-black/30 px-2 py-1 rounded">frontend/lib/adapters/</code>:</p>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
              <div className="text-green-400">// frontend/lib/adapters/mygateway.ts</div>
              <div>import {`{ Adapter, IntentDTO }`} from './Adapter';</div>
              <br />
              <div>export const myGatewayAdapter: Adapter = {`{`}</div>
              <div>  id: 'mygateway',</div>
              <div>  label: 'My Payment Gateway',</div>
              <br />
              <div>  async pay(intent: IntentDTO) {`{`}</div>
              <div>    {`// Implement your payment logic here`}</div>
              <div>    const result = await myGatewayAPI.createPayment(intent);</div>
              <div>    return {`{ ok: result.success, receiptHash: result.txId }`};</div>
              <div>  {`}`}</div>
              <div>{`}`};</div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">2. Add to Demo Page</h3>
            <p className="text-gray-300 mb-4">Import and register your adapter in the demo page:</p>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
              <div className="text-green-400">// frontend/app/demo/page.tsx</div>
              <div>import {`{ myGatewayAdapter }`} from '@/lib/adapters/mygateway';</div>
              <br />
              <div>const adapters = {`{`}</div>
              <div>  stripe: stripeAdapter,</div>
              <div>  paypal: paypalAdapter,</div>
              <div>  ckbtc: ckbtcAdapter,</div>
              <div className="text-yellow-400">  mygateway: myGatewayAdapter, // Add here</div>
              <div>{`}`};</div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">3. Update Backend (Optional)</h3>
            <p className="text-gray-300 mb-4">If you need a new provider type in the backend:</p>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
              <div className="text-green-400">// src/backend/src/lib.rs</div>
              <div>#[derive(CandidType, Deserialize, Serialize, Clone)]</div>
              <div>pub enum Provider {`{`}</div>
              <div>    Stripe,</div>
              <div>    PayPal,</div>
              <div>    CkBTC,</div>
              <div className="text-yellow-400">    MyGateway, // Add new provider</div>
              <div>    Custom(String)</div>
              <div>{`}`}</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <Terminal className="w-6 h-6 text-green-400" />
          Backend API Reference
        </h2>
        
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Intent Management</h3>
            <div className="space-y-3 text-gray-300">
              <div><code className="bg-black/30 px-2 py-1 rounded">create_intent(amount_minor, currency, description, provider)</code> - Create payment intent</div>
              <div><code className="bg-black/30 px-2 py-1 rounded">get_intent(id)</code> - Get intent by ID</div>
              <div><code className="bg-black/30 px-2 py-1 rounded">list_intents()</code> - List all intents</div>
              <div><code className="bg-black/30 px-2 py-1 rounded">mark_paid(id, receipt_hash)</code> - Mark intent as paid</div>
              <div><code className="bg-black/30 px-2 py-1 rounded">refund_intent(id)</code> - Mark intent as refunded</div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Invoice Management</h3>
            <div className="space-y-3 text-gray-300">
              <div><code className="bg-black/30 px-2 py-1 rounded">create_invoice(amount_minor, currency, email_enc, description)</code> - Create invoice</div>
              <div><code className="bg-black/30 px-2 py-1 rounded">list_invoices()</code> - List all invoices</div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
            <div className="space-y-3 text-gray-300">
              <div><code className="bg-black/30 px-2 py-1 rounded">set_provider_config(config)</code> - Set provider configuration</div>
              <div><code className="bg-black/30 px-2 py-1 rounded">get_provider_configs()</code> - Get all provider configs</div>
              <div><code className="bg-black/30 px-2 py-1 rounded">health()</code> - Check canister health</div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Next Steps</h2>
        <div className="glass-card p-6">
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
              <div>
                <strong className="text-white">Production Security:</strong> Implement proper key encryption, access controls, and audit logging.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <strong className="text-white">Custom Branding:</strong> Modify the UI components and styling to match your brand.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
              <div>
                <strong className="text-white">Advanced Features:</strong> Add subscription management, multi-currency support, and reporting dashboards.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <strong className="text-white">Integration:</strong> Connect with your existing application via the provided APIs.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
