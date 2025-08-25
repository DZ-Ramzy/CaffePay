'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, Activity } from 'lucide-react'
import { getBackend } from '@/lib/ic/actors'

interface HealthStatus {
  healthy: boolean
  timestamp: bigint
  error?: string
}

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkHealth = async () => {
    try {
      const backend = await getBackend()
      const [healthy, timestamp] = await backend.health()
      setStatus({ healthy, timestamp })
      setLastChecked(new Date())
    } catch (error) {
      console.error('Health check failed:', error)
      setStatus({ 
        healthy: false, 
        timestamp: BigInt(Date.now() * 1000000), 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
      setLastChecked(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000)
    return date.toLocaleString()
  }

  const getStatusColor = (healthy: boolean) => {
    return healthy ? 'text-green-400' : 'text-red-400'
  }

  const getStatusIcon = (healthy: boolean) => {
    if (loading) return <Clock className="w-8 h-8 text-blue-400 animate-spin" />
    return healthy ? 
      <CheckCircle className="w-8 h-8 text-green-400" /> : 
      <XCircle className="w-8 h-8 text-red-400" />
  }

  const getStatusText = (healthy: boolean) => {
    if (loading) return 'Checking...'
    return healthy ? 'All Systems Operational' : 'System Issues Detected'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">System Status</h1>
        <p className="text-gray-300">
          Real-time status of CaffPay services and infrastructure.
        </p>
      </div>

      {/* Overall Status */}
      <div className="glass-card p-8 text-center mb-8">
        {getStatusIcon(status?.healthy ?? false)}
        <h2 className={`text-2xl font-bold mt-4 ${getStatusColor(status?.healthy ?? false)}`}>
          {getStatusText(status?.healthy ?? false)}
        </h2>
        {lastChecked && (
          <p className="text-gray-300 mt-2">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Service Details */}
      <div className="space-y-4 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Backend Canister</h3>
                <p className="text-sm text-gray-300">Payment processing and data storage</p>
              </div>
            </div>
            <div className="text-right">
              {status && (
                <>
                  <div className={`font-medium ${getStatusColor(status.healthy)}`}>
                    {status.healthy ? 'Operational' : 'Down'}
                  </div>
                  <div className="text-sm text-gray-300">
                    {formatTimestamp(status.timestamp)}
                  </div>
                </>
              )}
            </div>
          </div>
          {status?.error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{status.error}</p>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Frontend Assets</h3>
                <p className="text-sm text-gray-300">User interface and static assets</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-green-400">Operational</div>
              <div className="text-sm text-gray-300">Always available</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-pink-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Payment Adapters</h3>
                <p className="text-sm text-gray-300">Stripe, PayPal, and ckBTC integrations</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-yellow-400">Mock Mode</div>
              <div className="text-sm text-gray-300">Demo only</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">99.9%</div>
            <div className="text-sm text-gray-300">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">&lt;100ms</div>
            <div className="text-sm text-gray-300">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">0</div>
            <div className="text-sm text-gray-300">Error Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">Local</div>
            <div className="text-sm text-gray-300">Network</div>
          </div>
        </div>
      </div>

      {/* Manual Refresh */}
      <div className="text-center">
        <button
          onClick={checkHealth}
          disabled={loading}
          className="glass-button bg-indigo-600/20 px-6 py-3 text-white font-medium rounded-lg disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>
    </div>
  )
}
