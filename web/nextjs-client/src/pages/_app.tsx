import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Script from 'next/script'
import { Toaster } from 'react-hot-toast'
import * as fpixel from '@/utils/fpixel'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    // fpixel.pageview() - Removed because Script tag handles initial load now

    const handleRouteChange = () => {
      fpixel.pageview()
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <main className="font-sans w-full overflow-x-hidden">
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </main>
  )
}
