'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Loader2 } from 'lucide-react'
import { getBackend } from '@/lib/ic/actors'
import { stripeAdapter } from '@/lib/adapters/stripe'
import { paypalAdapter } from '@/lib/adapters/paypal'
import { ckbtcAdapter } from '@/lib/adapters/ckbtc'

const adapters = {
  stripe: stripeAdapter,
  paypal: paypalAdapter,
  ckbtc: ckbtcAdapter,
}

export default function DemoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '10.00',
    currency: 'USD',
    description: 'Demo Payment',
    provider: 'stripe' as keyof typeof adapters,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create intent on backend
      const backend = await getBackend()
      const amountMinor = BigInt(Math.round(parseFloat(formData.amount) * 100))
      
      // Map provider string to backend enum
      let providerEnum
      switch (formData.provider) {
        case 'stripe':
          providerEnum = { Stripe: null }
          break
        case 'paypal':
          providerEnum = { PayPal: null }
          break
        case 'ckbtc':
          providerEnum = { CkBTC: null }
          break
        default:
          providerEnum = { Stripe: null }
      }

      const intent = await backend.create_intent(
        amountMinor,
        formData.currency,
        formData.description ? [formData.description] : [],
        providerEnum
      )

      // Process payment with adapter
      const adapter = adapters[formData.provider]
      const result = await adapter.pay({
        id: intent.id,
        amountMinor: Number(amountMinor),
        currency: formData.currency,
        description: formData.description,
      })

      if (result.ok) {
        // Mark as paid on backend
        await backend.mark_paid(intent.id, result.receiptHash ? [result.receiptHash] : [])
        
        // Redirect to receipt
        router.push(`/receipt/${intent.id}/`)
      } else {
        alert('Payment was cancelled or failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-6">Payment Demo</h1>
        <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
          Experience seamless payment processing with multiple providers on Internet Computer Protocol. 
          This is a safe demo environment - no real payments will be processed.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-white mb-4">
              💰 Payment Amount
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white text-lg placeholder-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 focus:outline-none transition-all duration-200 hover:border-white/30"
                placeholder="10.00"
                required
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-gray-400 text-lg">{formData.currency}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-white mb-4">
              🌍 Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white text-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 focus:outline-none transition-all duration-200 hover:border-white/30 appearance-none cursor-pointer"
            >
              <option value="USD" className="bg-gray-800 text-white">🇺🇸 USD - US Dollar</option>
              <option value="EUR" className="bg-gray-800 text-white">🇪🇺 EUR - Euro</option>
              <option value="GBP" className="bg-gray-800 text-white">🇬🇧 GBP - British Pound</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-white mb-4">
              📝 Payment Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white text-lg placeholder-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 focus:outline-none transition-all duration-200 hover:border-white/30"
              placeholder="What is this payment for? (e.g., Demo Purchase)"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-white mb-4">
              💳 Choose Payment Provider
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(adapters).map(([key, adapter]) => (
                <label key={key} className="relative group">
                  <input
                    type="radio"
                    name="provider"
                    value={key}
                    checked={formData.provider === key}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value as keyof typeof adapters })}
                    className="sr-only"
                  />
                  <div className={`p-6 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 ${
                    formData.provider === key 
                      ? 'border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/25' 
                      : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}>
                    <CreditCard className={`w-8 h-8 mx-auto mb-3 ${
                      formData.provider === key ? 'text-indigo-400' : 'text-gray-300'
                    }`} />
                    <div className="text-white font-medium text-lg">{adapter.label}</div>
                    <div className="text-gray-400 text-sm mt-1">
                      {key === 'stripe' && '💳 Credit Cards'}
                      {key === 'paypal' && '🌐 Digital Wallet'}
                      {key === 'ckbtc' && '₿ Bitcoin on IC'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xl py-5 px-8 rounded-xl hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  🚀 Process Payment
                </>
              )}
            </button>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-6 bg-blue-500/10 border border-blue-400/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-sm">🛡️</span>
              </div>
              <div>
                <h3 className="text-blue-200 font-semibold">Demo Environment</h3>
                <p className="text-blue-300 text-sm">No real payments will be processed. This is for demonstration purposes only.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
