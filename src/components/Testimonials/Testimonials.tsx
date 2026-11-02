import { Fragment } from 'react'
import './Testimonials.css'

const star = '/assets/testimonials/star.svg'
const STARS = [1, 2, 3, 4, 5]

type Testimonial = {
  name: string
  role: string
  avatar: string
  /** Quote lines; every line after the first starts on a new line on desktop only. */
  quote: string[]
  /** The design tightens the avatar / stars / quote spacing on the longest quote (16px instead of 24px). */
  compact?: boolean
}

const MARIA: Testimonial = {
  name: 'Maria K.',
  role: 'Patient, Kei Islands',
  avatar: '/assets/testimonials/avatar-maria.png',
  quote: [
    '"The medical mission brought hope to our village. For the first time in years, my children received proper check-ups without us having to travel for days."',
  ],
  compact: true,
}

const AHMED: Testimonial = {
  name: 'Ahmed S.',
  role: 'Farmer, Sinai Peninsula',
  avatar: '/assets/testimonials/avatar-ahmed.png',
  quote: [
    '"Thanks to the medical team, I finally got the treatment I needed. Their kindness and expertise changed my life."',
  ],
}

const LINA: Testimonial = {
  name: 'Lina M.',
  role: 'Patient, Kei Islands',
  avatar: '/assets/testimonials/avatar-lina.png',
  quote: [
    '"The outreach program taught us vital health practices, empowering our community to stay healthy and strong."',
  ],
}

const CARLOS: Testimonial = {
  name: 'Carlos V.',
  role: 'Teacher, Andes Mountains',
  avatar: '/assets/testimonials/avatar-carlos.png',
  quote: [
    '"The free dental check-ups relieved my chronic pain and restored my confidence to smile every day."',
  ],
}

/*
 * The two rows of the Figma frame. Each row is centred on the page and bleeds off both edges
 * under the white fades. Row 1 holds every testimonial once (it is the only row below 1280px);
 * row 2 only repeats them, so it is hidden from assistive technology.
 */
const ROWS: Testimonial[][] = [
  [
    {
      ...MARIA,
      quote: [
        '"The medical mission brought hope to our village. For the first time in years, my children received proper check-ups',
        'without us having to travel for days."',
      ],
    },
    AHMED,
    LINA,
    CARLOS,
  ],
  [CARLOS, CARLOS, MARIA, AHMED, LINA],
]

export default function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="testimonials__inner">
        <header className="testimonials__header" data-aos="fade-up">
          <h2 className="testimonials__title" id="testimonials-title">
            Every health journey starts with a single step.
          </h2>
          <p className="testimonials__subtitle">This is what they say</p>
        </header>

        <div className="testimonials__rows" data-aos="fade-up" data-aos-delay="100">
          {ROWS.map((row, rowIndex) => (
            <ul
              key={rowIndex}
              className={`testimonials__row testimonials__row--${rowIndex + 1}`}
              aria-hidden={rowIndex > 0 ? true : undefined}
            >
              {row.map((item, index) => (
                <li
                  key={`${item.name}-${index}`}
                  className={`testimonial-card${item.compact ? ' testimonial-card--compact' : ''}`}
                >
                  <div className="testimonial-card__content">
                    <img
                      className="testimonial-card__avatar"
                      src={item.avatar}
                      alt=""
                      width={56}
                      height={56}
                    />
                    <span className="testimonial-card__stars" role="img" aria-label="Rated 5 out of 5">
                      {STARS.map((n) => (
                        <img key={n} src={star} alt="" width={18} height={18} />
                      ))}
                    </span>
                    <p className="testimonial-card__quote">
                      {item.quote.map((line, lineIndex) => (
                        <Fragment key={lineIndex}>
                          {lineIndex > 0 && (
                            <>
                              {' '}
                              <br className="testimonial-card__break" />
                            </>
                          )}
                          {line}
                        </Fragment>
                      ))}
                    </p>
                  </div>
                  <div className="testimonial-card__author">
                    <p className="testimonial-card__name">{item.name}</p>
                    <p className="testimonial-card__role">{item.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          ))}
          <span className="testimonials__fade testimonials__fade--left" aria-hidden="true" />
          <span className="testimonials__fade testimonials__fade--right" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
