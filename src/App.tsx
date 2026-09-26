import { useEffect } from 'react'
import SiteLayout from './components/SiteLayout/SiteLayout'
import Hero from './components/Hero/Hero'
import CareModes from './components/CareModes/CareModes'
import HealthStory from './components/HealthStory/HealthStory'
import OfflineCapability from './components/OfflineCapability/OfflineCapability'
import Features from './components/Features/Features'
// import Testimonials from './components/Testimonials/Testimonials'
import Cta from './components/Cta/Cta'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    })
  }, [])

  return (
    <SiteLayout>
      <Hero />
      <CareModes />
      <HealthStory />
      <OfflineCapability />
      <Features />
      {/* <Testimonials /> */}
      <Cta />
    </SiteLayout>
  )
}
