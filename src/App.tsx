import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import IntroBand from './components/IntroBand'
import HealthStory from './components/HealthStory'
import FocusAreas from './components/FocusAreas'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './App.css'

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    })
  }, [])

  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <IntroBand />
        <HealthStory />
        <FocusAreas />
        <Testimonials />
        <Footer />
      </main>
    </div>
  )
}
