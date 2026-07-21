import './Testimonials.css'

const quote = '/assets/quote.svg'
const avatar = '/assets/avatar.jpg'

type Testimonial = {
  quote: string
  name: string
  role: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The medical mission brought hope to our village. For the first time in years, my children received proper check-ups without us having to travel for days.',
    name: 'Maria K.',
    role: 'Patient, Kei Islands',
  },
  {
    quote:
      'Thanks to the medical team, I finally got the treatment I needed. Their kindness and expertise changed my life.',
    name: 'Ahmed S.',
    role: 'Farmer, Sinai Peninsula',
  },
  {
    quote:
      'The outreach program taught us vital health practices, empowering our community to stay healthy and strong.',
    name: 'Lina M.',
    role: 'Patient, Kei Islands',
  },
  {
    quote:
      'The free dental check-ups relieved my chronic pain and restored my confidence to smile every day.',
    name: 'Carlos V.',
    role: 'Teacher, Andes Mountains',
  },
  {
    quote:
      'Having specialists come to our remote village made a huge difference. We felt seen and cared for.',
    name: 'Naomi T.',
    role: 'Midwife, Amazon Basin',
  },
  {
    quote:
      'The vaccination drive protected our children from diseases that once threatened our community.',
    name: 'James K.',
    role: 'Parent, Great Rift Valley',
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials__header" data-aos="fade-up">
        <p className="testimonials__eyebrow">Testimonials</p>
        <h2 className="testimonials__title">Every health journey starts with a single step.</h2>
        <p className="testimonials__subtitle">This is what they say</p>
      </div>

      <div className="testimonials__grid">
        {TESTIMONIALS.map((item, index) => (
          <article className="testimonial-card" key={item.name} data-aos="fade-up" data-aos-delay={index * 100}>
            <img className="testimonial-card__quote" src={quote} alt="" aria-hidden="true" />
            <p className="testimonial-card__text">&ldquo;{item.quote}&rdquo;</p>
            <footer className="testimonial-card__author">
              <span className="testimonial-card__avatar">
                <img src={avatar} alt={item.name} />
              </span>
              <span className="testimonial-card__meta">
                <span className="testimonial-card__name">{item.name}</span>
                <span className="testimonial-card__role">{item.role}</span>
              </span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
