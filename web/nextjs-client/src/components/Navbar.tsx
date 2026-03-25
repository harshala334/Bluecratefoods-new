import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { GiCookingPot } from 'react-icons/gi'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'next/router'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const [activeSection, setActiveSection] = useState('')
  const router = useRouter()

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userJson = localStorage.getItem('user')
    if (userJson && userJson !== 'undefined' && userJson !== 'null') {
      try {
        const userData = JSON.parse(userJson)
        if (userData) {
          setUser(userData)
          if (userData.email === 'admin@gmail.com' || userData.userType === 'admin') {
            setIsAdmin(true)
          }
        }
      } catch (e) {
        console.error('Error parsing user data', e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    setUser(null)
    setIsAdmin(false)
    router.push('/login')
  }

  const productNavItems = [
    { href: '/b2b', label: 'B2B Solutions', color: 'yellow' },
    { href: '/d2c', label: 'D2C Store', color: 'red' },
  ]

  const adminNavItem = (mounted && isAdmin) ? [{ href: '/admin/dashboard', label: 'Admin', color: 'default' }] : []

  const infoNavItems = [
    { href: '/#about-us', label: 'About Us', color: 'default' },
    { href: '/#contacts', label: 'Contact', color: 'default' },
  ]

  const navItems = mounted ? [...productNavItems, ...adminNavItem, ...infoNavItems] : [...productNavItems, ...infoNavItems]

  const isActive = (href: string) => {
    // Check if it's a page route
    if (href.startsWith('/') && !href.includes('#')) {
      return router.pathname === href
    }
    // Check if it's a section anchor
    if (href.includes('#')) {
      const sectionId = href.split('#')[1]
      return activeSection === `#${sectionId}`
    }
    return false
  }

  const getNavItemClasses = (color: string, href: string) => {
    const active = isActive(href)

    if (color === 'yellow') {
      return active
        ? 'group relative w-[140px] inline-flex justify-center items-center px-3 lg:px-4 py-2 font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-lg transition-all duration-200 border-2 border-amber-400 shadow-md text-xs lg:text-sm whitespace-nowrap'
        : 'group relative w-[140px] inline-flex justify-center items-center px-3 lg:px-4 py-2 font-semibold bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-700 hover:text-amber-800 rounded-lg transition-all duration-200 border border-amber-200 hover:border-amber-300 text-xs lg:text-sm whitespace-nowrap'
    }
    if (color === 'red') {
      return active
        ? 'group relative w-[140px] inline-flex justify-center items-center px-3 lg:px-4 py-2 font-semibold bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 rounded-lg transition-all duration-200 border-2 border-rose-400 shadow-md text-xs lg:text-sm whitespace-nowrap'
        : 'group relative w-[140px] inline-flex justify-center items-center px-3 lg:px-4 py-2 font-semibold bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 text-rose-700 hover:text-rose-800 rounded-lg transition-all duration-200 border border-rose-200 hover:border-rose-300 text-xs lg:text-sm whitespace-nowrap'
    }
    return active
      ? 'group relative px-3 lg:px-4 py-2 text-primary-600 font-bold transition-all duration-200 bg-primary-50 rounded-lg text-xs lg:text-sm whitespace-nowrap'
      : 'group relative px-3 lg:px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-all duration-200 text-xs lg:text-sm whitespace-nowrap'
  }

  const getMobileNavItemClasses = (color: string, href: string) => {
    const active = isActive(href)

    if (color === 'yellow') {
      return active
        ? 'px-4 py-3 font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-lg transition-all border-2 border-amber-400 shadow-md'
        : 'px-4 py-3 font-semibold bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-700 hover:text-amber-800 rounded-lg transition-all border border-amber-200 hover:translate-x-1'
    }
    if (color === 'red') {
      return active
        ? 'px-4 py-3 font-semibold bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 rounded-lg transition-all border-2 border-rose-400 shadow-md'
        : 'px-4 py-3 font-semibold bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 text-rose-700 hover:text-rose-800 rounded-lg transition-all border border-rose-200 hover:translate-x-1'
    }
    return active
      ? 'px-4 py-3 text-primary-600 font-bold bg-primary-50 rounded-lg transition-all border-l-4 border-primary-600'
      : 'px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all hover:translate-x-1 font-medium'
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-100 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
            {/* Update this section when you add your logo */}
            <div className="relative h-16 aspect-square group-hover:scale-105 transition-transform">
              <Image src="/BCF_logo.png" alt="BlueCrate Foods" fill className="object-contain" />

              {/* Temporary placeholder - remove when using actual logo */}
              {/* <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <GiCookingPot className="text-white text-2xl" />
              </div> */}
            </div>
            <div>
              <div className="text-lg md:text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                BlueCrateFoods
              </div>
              <div className="text-[9px] md:text-xs text-gray-500 -mt-1 block">Ready-to-Cook. Ready-to-Love.</div>
            </div>
          </Link>

          {/* Desktop Navigation - Products (Left) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-8">
            {productNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavItemClasses(item.color, item.href)}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Desktop Navigation - Info (Right) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 mr-4">
            {infoNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavItemClasses(item.color, item.href)}
              >
                <span>{item.label}</span>
                {/* Animated underline - only for default items when not active */}
                {item.color === 'default' && !isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <Link href="/cart" className="relative p-2 md:p-3 hover:bg-primary-50 rounded-xl transition-all group">
              <FiShoppingCart size={24} className="text-gray-700 group-hover:text-primary-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>
            {mounted && user ? (
              <div className="flex items-center space-x-2">
                <Link href={isAdmin ? "/admin/dashboard" : "/profile"} className="hidden md:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105">
                  <FiUser />
                  <span>{isAdmin ? 'Admin' : 'Profile'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="hidden md:flex items-center px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105">
                <FiUser />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t bg-gradient-to-b from-white to-gray-50">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getMobileNavItemClasses(item.color, item.href)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
              {user ? (
                <Link href={isAdmin ? "/admin/dashboard" : "/profile"} className="flex items-center justify-center space-x-2 mx-4 mt-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-center font-semibold shadow-lg hover:shadow-xl transition-all" onClick={() => setIsMenuOpen(false)}>
                  <FiUser />
                  <span>{isAdmin ? 'Admin Dashboard' : 'My Profile'}</span>
                </Link>
              ) : (
                <Link href="/login" className="flex items-center justify-center space-x-2 mx-4 mt-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-center font-semibold shadow-lg hover:shadow-xl transition-all" onClick={() => setIsMenuOpen(false)}>
                  <FiUser />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
