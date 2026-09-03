import { Outfit } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GdprFooter from '@/components/GdprFooter'
import AgeGate from '@/components/AgeGate'
import ToastContainer from '@/components/Toast'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata = {
  title: 'kwenchr — Get Your Drink On & Nightlife Feed',
  description: 'Search and discover the best location-based drink specials, happy hours, and nightlife events nearby.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable}`} suppressHydrationWarning>
      <body>
        <div className="wrapper">
          <Header />
          <section className="columns content-wrapper">
            {children}
          </section>
          <Footer />
        </div>
        <AgeGate />
        <GdprFooter />
        <ToastContainer />
        
        {/* Google Maps API with Places Library for Location Search */}
        <Script 
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places&loading=async`}
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  )
}
