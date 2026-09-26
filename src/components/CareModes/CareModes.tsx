import ArrowButton from '../ui/ArrowButton'
import './CareModes.css'

const labelDot = '/assets/care-modes/label-dot.svg'

type CareMode = {
  key: string
  label: string
  title: string
  text?: string
  image: string
  icon: string
}

const CARE_MODES: CareMode[] = [
  {
    key: 'individual',
    label: 'Individual Mode',
    title: 'Your personal health Companion',
    text: "Whether you're building healthy habits or managing a health condition, MyNia helps you understand your health, stay organized, and keep track of your progress every step of the way.",
    image: '/assets/care-modes/individual.jpg',
    icon: '/assets/care-modes/icon-user.svg',
  },
  {
    key: 'family',
    label: 'Family Mode',
    title: 'One App for the Whole Family',
    image: '/assets/care-modes/family.jpg',
    icon: '/assets/care-modes/icon-house-heart.svg',
  },
  {
    key: 'community',
    label: 'Community Mode',
    title: 'Built for Community Health Programs',
    image: '/assets/care-modes/community.jpg',
    icon: '/assets/care-modes/icon-user-group.svg',
  },
]

export default function CareModes() {
  return (
    <section className="care-modes">
      <div className="care-modes__inner">
        <header className="care-modes__header" data-aos="fade-up">
          <h2 className="care-modes__title">Built for Every Way You Care</h2>
          <p className="care-modes__subtitle">
            Designed for individuals, families, and community health programs.
          </p>
        </header>

        <div className="care-modes__body">
          <div className="care-modes__cards">
            {CARE_MODES.map((mode, index) => (
              <article
                key={mode.key}
                className={`mode-card mode-card--${mode.key}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img className="mode-card__image" src={mode.image} alt="" aria-hidden="true" />
                <span className="mode-card__shade" aria-hidden="true" />
                <div className="mode-card__content">
                  <span className="mode-card__icon">
                    <img src={mode.icon} alt="" aria-hidden="true" />
                  </span>
                  <div className="mode-card__body">
                    <p className="mode-card__label">
                      <img src={labelDot} alt="" aria-hidden="true" />
                      <span>{mode.label}</span>
                    </p>
                    <h3 className="mode-card__title">{mode.title}</h3>
                    {mode.text && <p className="mode-card__text">{mode.text}</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="care-modes__callout" data-aos="fade-up">
            <div className="care-modes__callout-text">
              <h3 className="care-modes__callout-title">Healthcare shouldn&rsquo;t feel complicated.</h3>
              <p className="care-modes__callout-body">
                Whether you&rsquo;re tracking your blood pressure, following a treatment plan,
                managing a chronic condition, or caring for your family,{' '}
                <strong>MyNia helps you stay connected to what matters most.</strong>
              </p>
            </div>
            <ArrowButton>Explore More</ArrowButton>
          </div>
        </div>
      </div>
    </section>
  )
}
