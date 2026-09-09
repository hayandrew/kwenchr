import { Outfit } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GdprFooter from "@/components/GdprFooter";
import AgeGate from "@/components/AgeGate";
import ToastContainer from "@/components/Toast";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "kwenchr — Get Your Drink On",
  description:
    "Search and discover the best location-based drink specials, happy hours, and nightlife events nearby.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable}`} suppressHydrationWarning>
      <body>
        <Header />
        {children}
        <Footer />
        <AgeGate />
        <GdprFooter />
        <ToastContainer />

        {/* Google Maps API with Places Library for Location Search */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}&libraries=places&loading=async`}
          strategy="lazyOnload"
        />

        {/* Google Consent Mode v2 default setup - respects stored GDPR consent */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              id="google-consent-default"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  (function() {
                    try {
                      var stored = localStorage.getItem('kwenchr_gdpr_consent');
                      var consent = stored ? JSON.parse(stored) : null;
                      var granted = consent && consent.analytics === true;
                      gtag('consent', 'default', {
                        'analytics_storage': granted ? 'granted' : 'denied',
                        'ad_storage': granted ? 'granted' : 'denied',
                        'ad_user_data': granted ? 'granted' : 'denied',
                        'ad_personalization': granted ? 'granted' : 'denied'
                      });
                    } catch (e) {
                      gtag('consent', 'default', {
                        'analytics_storage': 'denied',
                        'ad_storage': 'denied',
                        'ad_user_data': 'denied',
                        'ad_personalization': 'denied'
                      });
                    }
                  })();
                `,
              }}
            />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          </>
        )}
      </body>
    </html>
  );
}
