import Navbar from './Navbar'
import Footer from './Footer'
import AppPromoModal from './AppPromoModal'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full pt-20">
        {children}
      </main>

      {/* Floating App Button */}
      <a
        href="https://app.bluecratefoods.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-0 top-[20%] -translate-y-1/2 bg-red-600 text-white px-3 py-6 rounded-l-xl font-bold shadow-2xl hover:bg-red-700 transition-all hover:px-5 z-50 flex items-center group cursor-pointer border-y border-l border-red-400 animate-pulse hover:animate-none space-x-2"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-sm tracking-widest uppercase group-hover:scale-110 transition-transform">ORDER APP</span>
      </a>

      {/* Global App Promo Modal */}
      <AppPromoModal />

      <Footer />
    </div>
  )
}
