# CaffePay - Payments & Invoicing on ICP

> Self-hosted, rails-agnostic payment processing template built on Internet Computer Protocol

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![DFX](https://img.shields.io/badge/DFX-0.15.0+-blue.svg)](https://smartcontracts.org/)
[![Rust](https://img.shields.io/badge/Rust-1.70+-red.svg)](https://rustup.rs/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black.svg)](https://nextjs.org/)

CaffePay is a complete payments and invoicing template that runs on the Internet Computer. It provides a self-hosted alternative to traditional payment processors with support for multiple providers including Stripe, PayPal, and ckBTC.

## ✨ Features

- 🏗️ **Self-Hosted**: Deploy your own payment infrastructure on ICP
- 🔌 **Multi-Provider**: Support for Stripe, PayPal, ckBTC out of the box
- 🔧 **Rails-Agnostic**: Works with any backend framework
- 🎨 **Modern UI**: Dark premium interface with glass morphism design
- 📊 **Admin Dashboard**: Manage configurations, invoices, and view reports
- 🔐 **No Custody**: Direct payments to your provider accounts
- 🚀 **Production Ready**: Stable storage, upgrade-safe canister design

## 🚀 Quick Start (90 seconds)

### Prerequisites

- [DFX SDK](https://smartcontracts.org/docs/quickstart/local-quickstart.html) (0.15.0+)
- [Rust](https://rustup.rs/) with `wasm32-unknown-unknown` target
- [Node.js](https://nodejs.org/) (18+) and [pnpm](https://pnpm.io/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/caffpay.git
cd caffpay

# Install frontend dependencies
cd frontend && pnpm install && cd ..

# Add Rust target
rustup target add wasm32-unknown-unknown
```

### Local Development

```bash
# Start local IC replica
pnpm ic:start

# Build and deploy locally
pnpm ic:deploy:local

# Open frontend
# The deploy command will output the frontend canister URL
```

### Deploy to IC Mainnet

```bash
# Deploy to mainnet (requires cycles)
pnpm ic:deploy:ic
```

## 🏗️ Architecture

```
caffpay/
├─ dfx.json                     # IC configuration
├─ package.json                 # Root scripts
├─ src/backend/                 # Rust canister
│  ├─ Cargo.toml
│  └─ src/lib.rs               # Payment logic & storage
└─ frontend/                    # Next.js app
   ├─ app/                     # App router pages
   │  ├─ layout.tsx            # Root layout
   │  ├─ page.tsx              # Home page
   │  ├─ demo/page.tsx         # Payment demo
   │  ├─ receipt/[id]/page.tsx # Receipt view
   │  ├─ admin/page.tsx        # Admin dashboard
   │  ├─ docs/page.tsx         # Documentation
   │  └─ status/page.tsx       # System status
   ├─ lib/adapters/            # Payment adapters
   │  ├─ Adapter.ts            # Base interface
   │  ├─ stripe.ts             # Stripe mock
   │  ├─ paypal.ts             # PayPal mock
   │  └─ ckbtc.ts              # ckBTC mock
   └─ lib/ic/actors.ts         # IC integration
```

## 🔐 Security & Custody

> ⚠️ **IMPORTANT SECURITY NOTICE**

### No Custody Model
CaffePay **does not hold or custody any funds**. All payments flow directly to your configured provider accounts (Stripe, PayPal, etc.). The canister only tracks payment intents and metadata.

### Demo vs Production
This template includes **demonstration-only** features:

- ✅ **Demo Mode**: Provider configurations stored in plain text
- ❌ **Production**: Requires proper encryption and key management

### Production Checklist
Before using in production:

- [ ] Implement proper key encryption for provider credentials
- [ ] Add authentication and role-based access controls
- [ ] Set up audit logging for all payment operations
- [ ] Configure proper backup and disaster recovery
- [ ] Security audit of the entire codebase
- [ ] Implement rate limiting and DDoS protection

### Recommended Security Measures
1. **Key Management**: Use IC's cryptography features for encrypting sensitive data
2. **Access Control**: Implement caller-based permissions
3. **Audit Trail**: Log all critical operations with timestamps
4. **Input Validation**: Validate all user inputs and amounts
5. **Error Handling**: Never expose sensitive information in error messages

## 🔌 Adding a New Payment Adapter

### 1. Create Adapter File

Create `frontend/lib/adapters/yourprovider.ts`:

```typescript
import { Adapter, IntentDTO } from './Adapter';

export const yourProviderAdapter: Adapter = {
  id: 'yourprovider',
  label: 'Your Provider',
  
  async pay(intent: IntentDTO): Promise<{ ok: boolean; receiptHash?: string }> {
    // Implement your payment logic
    try {
      const result = await yourProviderAPI.createPayment({
        amount: intent.amountMinor,
        currency: intent.currency,
        description: intent.description,
      });
      
      return { 
        ok: result.success, 
        receiptHash: result.transactionId 
      };
    } catch (error) {
      console.error('Payment failed:', error);
      return { ok: false };
    }
  }
};
```

### 2. Register in Demo Page

Add to `frontend/app/demo/page.tsx`:

```typescript
import { yourProviderAdapter } from '@/lib/adapters/yourprovider';

const adapters = {
  stripe: stripeAdapter,
  paypal: paypalAdapter,
  ckbtc: ckbtcAdapter,
  yourprovider: yourProviderAdapter, // Add here
};
```

### 3. Update Backend (Optional)

If you need a new provider type, update `src/backend/src/lib.rs`:

```rust
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub enum Provider {
    Stripe,
    PayPal,
    CkBTC,
    YourProvider, // Add new provider
    Custom(String)
}
```

## 📋 API Reference

### Backend Canister Methods

#### Intent Management
- `create_intent(amount_minor, currency, description, provider)` - Create payment intent
- `get_intent(id)` - Get intent by ID  
- `list_intents()` - List all intents
- `mark_paid(id, receipt_hash)` - Mark intent as paid
- `refund_intent(id)` - Mark intent as refunded

#### Invoice Management
- `create_invoice(amount_minor, currency, email_enc, description)` - Create invoice
- `list_invoices()` - List all invoices

#### Configuration
- `set_provider_config(config)` - Set provider configuration
- `get_provider_configs()` - Get all provider configs
- `health()` - Check canister health

### Frontend Integration

```typescript
import { getBackend } from '@/lib/ic/actors';

// Create a payment intent
const backend = await getBackend();
const intent = await backend.create_intent(
  1000, // $10.00 in cents
  'USD',
  ['Coffee purchase'],
  { Stripe: null }
);

// Process with adapter
const adapter = stripeAdapter;
const result = await adapter.pay({
  id: intent.id,
  amountMinor: 1000,
  currency: 'USD',
  description: 'Coffee purchase'
});

// Mark as paid
if (result.ok) {
  await backend.mark_paid(intent.id, result.receiptHash ? [result.receiptHash] : []);
}
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm ic:start          # Start local IC replica
pnpm ic:stop           # Stop local IC replica
pnpm dev:frontend      # Start frontend dev server

# Building
pnpm build:backend     # Build Rust canister
pnpm build:frontend    # Build Next.js app
pnpm build             # Build everything

# Deployment
pnpm ic:deploy:local   # Deploy to local replica
pnpm ic:deploy:ic      # Deploy to IC mainnet

# Utilities
pnpm generate          # Generate TypeScript declarations
pnpm clean             # Clean all build artifacts
pnpm test:backend      # Run Rust tests
```

### Local Development URLs

After deploying locally:
- Frontend: `http://localhost:4943/?canisterId=<frontend_canister_id>`
- Backend: Candid UI at `http://localhost:4943/_/candid?id=<backend_canister_id>`

## 🚦 Deployment Environments

### Local Development
- Network: Local replica
- Features: Full functionality with mock adapters
- Use case: Development and testing

### IC Testnet (Future)
- Network: IC testnet
- Features: Real IC environment, test cycles
- Use case: Pre-production testing

### IC Mainnet
- Network: IC mainnet  
- Features: Production environment
- Use case: Live applications (requires cycles)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a Pull Request

### Development Guidelines

- Follow Rust and TypeScript best practices
- Add tests for new functionality
- Update documentation for API changes
- Ensure security review for payment-related code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software is provided "as is" without warranty. It is intended for educational and development purposes. Before using in production:

- Conduct thorough security audits
- Implement proper access controls
- Test extensively with small amounts
- Comply with relevant financial regulations

The authors are not responsible for any financial losses or security breaches resulting from the use of this software.

## 🆘 Support

- 📚 [Documentation](http://localhost:4943/?canisterId=<frontend_canister_id>/docs/)
- 🐛 [Report Issues](https://github.com/your-org/caffpay/issues)
- 💬 [Discussions](https://github.com/your-org/caffpay/discussions)
- 🌐 [Internet Computer Docs](https://smartcontracts.org/)

---

Built with ❤️ on the [Internet Computer](https://internetcomputer.org/)
