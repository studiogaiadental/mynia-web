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
        <div className="hero__content">
          <h1 className="hero__title">Meet MyNia Health App</h1>
          <p className="hero__subtitle">Available on Android</p>
          <a className="hero__store" href="#" aria-label="Get it on Google Play">
            <img src={googlePlay} alt="Get it on Google Play" />
          </a>
        </div>

        <div className="hero__visual">
          <img className="hero__phones" src={heroPhones} alt="MyNia Health App on smartphones" />
          <img className="hero__float hero__float--plus" src={floatPlus} alt="" aria-hidden="true" />
          <img className="hero__float hero__float--heart" src={floatHeart} alt="" aria-hidden="true" />
          <img className="hero__float hero__float--shield" src={floatShield} alt="" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
