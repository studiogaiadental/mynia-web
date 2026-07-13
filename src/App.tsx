import Header from './components/Header'
import Hero from './components/Hero'
import IntroBand from './components/IntroBand'
import HealthStory from './components/HealthStory'
import FocusAreas from './components/FocusAreas'
import Testimonials from './components/Testimonials'
import './App.css'

export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <IntroBand />
        <HealthStory />
        <FocusAreas />
        <Testimonials />
      </main>
    </div>
  )
}
