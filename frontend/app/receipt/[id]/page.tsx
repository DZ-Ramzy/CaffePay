'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, XCircle, Clock, RotateCcw, ExternalLink } from 'lucide-react'
import { getBackend } from '@/lib/ic/actors'

interface Intent {
  id: string
  amount_minor: bigint
  currency: string
  description: string[]
  provider: any
  created_at: bigint
  status: any
  receipt_hash: string[]
}

export default function ReceiptPage() {
  const params = useParams()
  const id = params.id as string
  const [intent, setIntent] = useState<Intent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIntent = async () => {
      try {
        const backend = await getBackend()
        const result = await backend.get_intent(id)
        
        if (result.length > 0) {
          setIntent(result[0])
        } else {
          setError('Payment not found')
        }
      } catch (err) {
        console.error('Error fetching intent:', err)
        setError('Failed to load payment details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchIntent()
    }
  }, [id])

  const getStatusIcon = (status: any) => {
    if (status.Succeeded !== undefined) return <CheckCircle className="w-8 h-8 text-green-400" />
    if (status.Failed !== undefined) return <XCircle className="w-8 h-8 text-red-400" />
    if (status.Refunded !== undefined) return <RotateCcw className="w-8 h-8 text-yellow-400" />
    return <Clock className="w-8 h-8 text-blue-400" />
  }

  const getStatusText = (status: any) => {
    if (status.Succeeded !== undefined) return 'Payment Succeeded'
    if (status.Failed !== undefined) return 'Payment Failed'
    if (status.Refunded !== undefined) return 'Payment Refunded'
    return 'Payment Processing'
  }

  const getStatusColor = (status: any) => {
    if (status.Succeeded !== undefined) return 'text-green-400'
    if (status.Failed !== undefined) return 'text-red-400'
    if (status.Refunded !== undefined) return 'text-yellow-400'
    return 'text-blue-400'
  }

  const getProviderText = (provider: any) => {
    if (provider.Stripe !== undefined) return 'Stripe'
    if (provider.PayPal !== undefined) return 'PayPal'
    if (provider.CkBTC !== undefined) return 'ckBTC'
    return 'Unknown'
  }

  const formatAmount = (amountMinor: bigint, currency: string) => {
    const amount = Number(amountMinor) / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000) // Convert nanoseconds to milliseconds
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card p-8 text-center">
          <Clock className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-300">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error || !intent) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card p-8 text-center">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Payment Not Found</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <a href="/demo/" className="glass-button px-6 py-2 text-white">
            Try Another Payment
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          {getStatusIcon(intent.status)}
          <h1 className={`text-2xl font-bold mt-4 ${getStatusColor(intent.status)}`}>
            {getStatusText(intent.status)}
          </h1>
        </div>

        <div className="space-y-6">
          <div className="border-b border-white/[0.1] pb-6">
            <div className="text-3xl font-bold text-white text-center">
              {formatAmount(intent.amount_minor, intent.currency)}
            </div>
            <div className="text-gray-300 text-center mt-2">
              {intent.description.length > 0 ? intent.description[0] : 'No description'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Payment ID</span>
              <span className="text-white font-mono text-sm">{intent.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Provider</span>
              <span className="text-white">{getProviderText(intent.provider)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Created</span>
              <span className="text-white">{formatDate(intent.created_at)}</span>
            </div>
            {intent.receipt_hash.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Receipt Hash</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">{intent.receipt_hash[0]}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/[0.1]">
            <div className="flex gap-4">
              <a href="/demo/" className="flex-1 glass-button px-4 py-2 text-white text-center">
                New Payment
              </a>
              <a href="/admin/" className="flex-1 glass-button px-4 py-2 text-white text-center">
                View Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
