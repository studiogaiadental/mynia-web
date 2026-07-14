const heroPhones = '/assets/hero-phones.png'
const swoosh = '/assets/swoosh.png'
const googlePlay = '/assets/google-play.png'
const floatHeart = '/assets/float-heart.svg'
const floatPlus = '/assets/float-plus.svg'
const floatShield = '/assets/float-shield.svg'

export default function Hero() {
  return (
    <section className="hero">
      <img className="hero__swoosh" src={swoosh} alt="" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__visual" data-aos="fade-left" data-aos-delay="200">
          <div className="hero__circle" aria-hidden="true" />
          <img className="hero__phones" src={heroPhones} alt="MyNia Health App on smartphones" />
          <img className="hero__float hero__float--plus" src={floatPlus} alt="" aria-hidden="true" />
          <img className="hero__float hero__float--heart" src={floatHeart} alt="" aria-hidden="true" />
          <img className="hero__float hero__float--shield" src={floatShield} alt="" aria-hidden="true" />
        </div>

        <div className="hero__content" data-aos="fade-right">
          <h1 className="hero__title">Meet MyNia<br />Health App</h1>
          <p className="hero__description">
            A smarter way to understand, monitor, and manage your health every day.
          </p>
          <p className="hero__subtitle">Available on Android</p>
          <a className="hero__store" href="#" aria-label="Get it on Google Play">
            <img src={googlePlay} alt="Get it on Google Play" />
          </a>
        </div>
      </div>
    </section>
  )
}
