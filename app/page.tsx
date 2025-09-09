import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import TechStack from '@/components/TechStack'
import Pricing from '@/components/Pricing'
import WaitlistForm from '@/components/WaitlistForm'
import Footer from '@/components/Footer'

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CVPerfect",
    "description": "AI-powered job hunting assistant that helps optimize resumes, track applications, and auto-apply to jobs",
    "url": "https://waitlist.cvperfect.pro",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free plan available with AI resume analysis"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "author": {
      "@type": "Organization",
      "name": "CVPerfect"
    },
    "softwareVersion": "1.0.0"
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <Hero />
      <Features />
      <TechStack />
      <Pricing />
      <WaitlistForm />
      <Footer />
    </main>
  )
} 