'use client'

import { useState, useEffect } from 'react'
import { Settings, FileText, BarChart3, Plus, Save } from 'lucide-react'
import { getBackend } from '@/lib/ic/actors'

interface ProviderConfig {
  provider: any
  kv: [string, string][]
}

interface Invoice {
  id: string
  amount_minor: bigint
  currency: string
  issued_at: bigint
  email_enc: string[]
  description: string[]
  paid: boolean
}

interface Intent {
  id: string
  amount_minor: bigint
  currency: string
  status: any
  provider: any
  created_at: bigint
}

type Tab = 'providers' | 'invoices' | 'reports'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('providers')
  const [configs, setConfigs] = useState<ProviderConfig[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [intents, setIntents] = useState<Intent[]>([])
  const [loading, setLoading] = useState(false)

  // Provider config form
  const [selectedProvider, setSelectedProvider] = useState('Stripe')
  const [configKV, setConfigKV] = useState<[string, string][]>([['api_key', ''], ['webhook_secret', '']])

  // Invoice form
  const [invoiceForm, setInvoiceForm] = useState({
    amount: '10.00',
    currency: 'USD',
    email: '',
    description: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const backend = await getBackend()
      const [configsData, invoicesData, intentsData] = await Promise.all([
        backend.get_provider_configs(),
        backend.list_invoices(),
        backend.list_intents()
      ])
      setConfigs(configsData)
      setInvoices(invoicesData)
      setIntents(intentsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProviderConfig = async () => {
    try {
      const backend = await getBackend()
      const providerEnum = selectedProvider === 'Stripe' ? { Stripe: null } :
                          selectedProvider === 'PayPal' ? { PayPal: null } :
                          { CkBTC: null }
      
      await backend.set_provider_config({
        provider: providerEnum,
        kv: configKV
      })
      await loadData()
      alert('Provider configuration saved!')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Failed to save configuration')
    }
  }

  const createInvoice = async () => {
    try {
      const backend = await getBackend()
      const amountMinor = BigInt(Math.round(parseFloat(invoiceForm.amount) * 100))
      
      await backend.create_invoice(
        amountMinor,
        invoiceForm.currency,
        invoiceForm.email ? [invoiceForm.email] : [],
        invoiceForm.description ? [invoiceForm.description] : []
      )
      
      setInvoiceForm({ amount: '10.00', currency: 'USD', email: '', description: '' })
      await loadData()
      alert('Invoice created!')
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('Failed to create invoice')
    }
  }

  const getStatusCounts = () => {
    const counts = { processing: 0, succeeded: 0, failed: 0, refunded: 0 }
    intents.forEach(intent => {
      if (intent.status.Processing !== undefined) counts.processing++
      else if (intent.status.Succeeded !== undefined) counts.succeeded++
      else if (intent.status.Failed !== undefined) counts.failed++
      else if (intent.status.Refunded !== undefined) counts.refunded++
    })
    return counts
  }

  const getTotalRevenue = () => {
    return intents
      .filter(intent => intent.status.Succeeded !== undefined)
      .reduce((total, intent) => total + Number(intent.amount_minor), 0) / 100
  }

  const formatAmount = (amountMinor: bigint, currency: string) => {
    const amount = Number(amountMinor) / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000)
    return date.toLocaleDateString()
  }

  const tabClasses = (tab: Tab) => 
    `px-4 py-2 rounded-lg transition-colors ${
      activeTab === tab 
        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
        : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
    }`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('providers')}
            className={tabClasses('providers')}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Provider Keys
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={tabClasses('invoices')}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={tabClasses('reports')}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Reports
          </button>
        </div>
      </div>

      {/* Provider Configuration Tab */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Configure Provider</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white"
                >
                  <option value="Stripe">Stripe</option>
                  <option value="PayPal">PayPal</option>
                  <option value="CkBTC">ckBTC</option>
                </select>
              </div>
              
              {configKV.map(([key, value], index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      const newKV = [...configKV]
                      newKV[index][0] = e.target.value
                      setConfigKV(newKV)
                    }}
                    placeholder="Key"
                    className="px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-gray-400"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const newKV = [...configKV]
                      newKV[index][1] = e.target.value
                      setConfigKV(newKV)
                    }}
                    placeholder="Value"
                    className="px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              ))}
              
              <div className="flex gap-2">
                <button
                  onClick={() => setConfigKV([...configKV, ['', '']])}
                  className="glass-button px-4 py-2 text-white"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Field
                </button>
                <button
                  onClick={saveProviderConfig}
                  className="glass-button bg-indigo-600/20 px-4 py-2 text-white"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Save Config
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Current Configurations</h3>
            {configs.length === 0 ? (
              <p className="text-gray-300">No provider configurations set up yet.</p>
            ) : (
              <div className="space-y-3">
                {configs.map((config, index) => (
                  <div key={index} className="p-3 bg-white/[0.05] rounded-lg">
                    <div className="font-medium text-white">
                      {config.provider.Stripe !== undefined ? 'Stripe' :
                       config.provider.PayPal !== undefined ? 'PayPal' : 'ckBTC'}
                    </div>
                    <div className="text-sm text-gray-300">
                      {config.kv.length} configuration fields
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Create Invoice</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <select
                  value={invoiceForm.currency}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={invoiceForm.email}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white"
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white"
                  placeholder="Invoice description"
                />
              </div>
            </div>
            <button
              onClick={createInvoice}
              className="mt-4 glass-button bg-indigo-600/20 px-4 py-2 text-white"
            >
              Create Invoice
            </button>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Invoices</h3>
            {invoices.length === 0 ? (
              <p className="text-gray-300">No invoices created yet.</p>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 bg-white/[0.05] rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white">{invoice.id}</div>
                        <div className="text-sm text-gray-300">
                          {invoice.description.length > 0 ? invoice.description[0] : 'No description'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          {formatAmount(invoice.amount_minor, invoice.currency)}
                        </div>
                        <div className={`text-sm ${invoice.paid ? 'text-green-400' : 'text-yellow-400'}`}>
                          {invoice.paid ? 'Paid' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-white">{getStatusCounts().succeeded}</div>
              <div className="text-sm text-green-400">Successful</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-white">{getStatusCounts().processing}</div>
              <div className="text-sm text-blue-400">Processing</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-white">{getStatusCounts().failed}</div>
              <div className="text-sm text-red-400">Failed</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-2xl font-bold text-white">${getTotalRevenue().toFixed(2)}</div>
              <div className="text-sm text-purple-400">Revenue</div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Payments</h3>
            {intents.length === 0 ? (
              <p className="text-gray-300">No payments yet.</p>
            ) : (
              <div className="space-y-3">
                {intents.slice(0, 10).map((intent) => (
                  <div key={intent.id} className="p-4 bg-white/[0.05] rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">{intent.id}</div>
                        <div className="text-sm text-gray-300">{formatDate(intent.created_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          {formatAmount(intent.amount_minor, intent.currency)}
                        </div>
                        <div className={`text-sm ${
                          intent.status.Succeeded !== undefined ? 'text-green-400' :
                          intent.status.Failed !== undefined ? 'text-red-400' :
                          intent.status.Refunded !== undefined ? 'text-yellow-400' :
                          'text-blue-400'
                        }`}>
                          {intent.status.Succeeded !== undefined ? 'Succeeded' :
                           intent.status.Failed !== undefined ? 'Failed' :
                           intent.status.Refunded !== undefined ? 'Refunded' : 'Processing'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
