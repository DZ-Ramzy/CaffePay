import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Image 
              src="/images/caffpay-logo.png" 
              alt="CaffPay Logo" 
              width={120} 
              height={120}
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="gradient-text">Payments & Invoicing</span>
            <br />
            on Internet Computer
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Self-hosted, rails-agnostic payment processing template. Accept Stripe, PayPal, and ckBTC 
            payments with full custody and transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/demo/" className="glass-button px-8 py-3 text-white font-medium flex items-center justify-center gap-2">
              Try Demo <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/docs/" className="glass-button px-8 py-3 text-white font-medium">
              Documentation
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-6">
            <Shield className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Self-Hosted</h3>
            <p className="text-gray-300">
              Deploy your own payment infrastructure on ICP. No vendor lock-in, full control over your data.
            </p>
          </div>
          <div className="glass-card p-6">
            <Zap className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Multi-Provider</h3>
            <p className="text-gray-300">
              Support for Stripe, PayPal, and ckBTC out of the box. Easily extend with custom adapters.
            </p>
          </div>
          <div className="glass-card p-6">
            <Globe className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Rails-Agnostic</h3>
            <p className="text-gray-300">
              Works with any backend framework. Simple API integration with your existing infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">1</div>
              <div>
                <h3 className="text-white font-medium">Deploy to ICP</h3>
                <p className="text-gray-300 text-sm">Clone, configure, and deploy your canisters</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">2</div>
              <div>
                <h3 className="text-white font-medium">Configure Providers</h3>
                <p className="text-gray-300 text-sm">Set up your Stripe, PayPal, or ckBTC credentials</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-medium">3</div>
              <div>
                <h3 className="text-white font-medium">Start Accepting Payments</h3>
                <p className="text-gray-300 text-sm">Integrate with your app and start processing payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
