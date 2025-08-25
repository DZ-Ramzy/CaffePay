import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Navbar from '../components/Navbar'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CaffPay - Payments & Invoicing on ICP',
  description: 'Self-hosted payments and invoicing template built on Internet Computer Protocol',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
