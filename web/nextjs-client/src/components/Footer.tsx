import Link from 'next/link'
import Image from 'next/image'
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { GiCookingPot } from 'react-icons/gi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">

              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center relative">
                <Image src="/BCF_logo.png" alt="BlueCrateFoods logo" fill className="object-contain" />
              </div>

              <div>
                <div className="text-2xl font-display font-bold text-white">BlueCrateFoods</div>
                <div className="text-xs text-gray-400 -mt-1">Ready-to-Cook. Ready-to-Love.</div>
              </div>
            </div>
            <p className="text-sm mb-4">
              Fresh ingredients and guided recipes delivered to your door. Cook restaurant-quality meals at home.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1AR6h9ynfS/" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition">
                <FiTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/blue.crate.foods?igsh=d3U2MHVlOGprNDcz" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/recipes" className="hover:text-primary-400 transition">Browse Recipes</Link></li>
              <li><Link href="/recipes?time=10min" className="hover:text-primary-400 transition">Quick Meals</Link></li>
              {/* <li><Link href="/how-it-works" className="hover:text-primary-400 transition">How It Works</Link></li> */}
              <li><Link href="/#about-us" className="hover:text-primary-400 transition">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-primary-400 transition">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400 transition">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary-400 transition">Privacy Policy</Link></li>
              <li><Link href="/faq" className="hover:text-primary-400 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span>181, Becharam Chatterjee Road,<br />Behala, Kolkata-700061</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="flex-shrink-0" />
                <span>+91 9591890828</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="flex-shrink-0" />
                <span>connect@bluecratefoods.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center md:flex md:justify-between md:items-center">
          <p>&copy; {new Date().getFullYear()} BlueCrateFoods. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-primary-400 transition">Terms</Link>
            <Link href="/cookies" className="hover:text-primary-400 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
