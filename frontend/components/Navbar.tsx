'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Demo', href: '/demo', icon: <Zap className="w-4 h-4" /> },
  { label: 'Admin', href: '/admin' },
  { label: 'Docs', href: '/docs' },
  { label: 'Status', href: '/status' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] backdrop-blur-xl bg-black/30 supports-[backdrop-filter]:bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image 
                  src="/images/caffpay-logo.png" 
                  alt="CaffPay Logo" 
                  width={40} 
                  height={40}
                  className="object-contain transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300">
                CaffPay
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-white bg-white/10 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </div>
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full" />
                )}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-200" />
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex md:items-center">
            <Link
              href="/demo"
              className="relative px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 transform hover:-translate-y-0.5"
            >
              Try Demo
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 to-white/0 hover:from-white/10 hover:to-white/10 transition-all duration-200" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="py-4 space-y-2 border-t border-white/[0.08] mt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-l-2 border-indigo-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 hover:border-l-2 hover:border-gray-400'
                }`}
              >
                {item.icon}
                {item.label}
                {isActive(item.href) && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full" />
                )}
              </Link>
            ))}
            
            {/* Mobile CTA */}
            <div className="pt-4 mt-4 border-t border-white/[0.08]">
              <Link
                href="/demo"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
