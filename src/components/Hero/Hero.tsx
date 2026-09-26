import ArrowButton from '../ui/ArrowButton'
import './Hero.css'

const bgPhoto = '/assets/hero/hero-bg-photo.jpg'
const circles = '/assets/hero/hero-circles.svg'
const phones = '/assets/hero/hero-phones.png'
const eyebrowDot = '/assets/hero/eyebrow-dot.svg'

export default function Hero() {
  return (
    <section className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${bgPhoto})` }}
        aria-hidden="true"
      />
      <div className="hero__inner">
        <div className="hero__content" data-aos="fade-right">
          <div className="hero__text">
            <p className="hero__eyebrow">
              <img src={eyebrowDot} alt="" aria-hidden="true" />
              <span>Our Ecosystem</span>
            </p>
            <h1 className="hero__title">Let&rsquo;s Meet MyNia Health App</h1>
            <p className="hero__description">
              A patient-centric digital ecosystem designed to integrate medical devices, AI
              diagnostics, telehealth, treatment planning, and health management tools into one{' '}
              <br className="hero__break" />
              seamless experience.
            </p>
          </div>
          <ArrowButton>Download Now</ArrowButton>
        </div>
        <div className="hero__visual" data-aos="fade-left" data-aos-delay="200">
          <img className="hero__circles" src={circles} alt="" aria-hidden="true" />
          <div className="hero__phones">
            <img src={phones} alt="MyNia Health App home and measurement screens" />
          </div>
        </div>
      </div>
    </section>
  )
}
