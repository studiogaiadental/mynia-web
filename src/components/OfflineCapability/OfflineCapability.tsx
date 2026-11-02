import './OfflineCapability.css'

const phoneHand = '/assets/offline/phone-hand.png'
const ellipse = '/assets/offline/ellipse.svg'

const POINTS = [
  { icon: '/assets/offline/icon-archive.svg', text: 'Manage health records anytime, anywhere' },
  { icon: '/assets/offline/icon-gauge.svg', text: 'Log measurements without interruption' },
  { icon: '/assets/offline/icon-offline.svg', text: 'Uninterrupted offline & online availability' },
]

export default function OfflineCapability() {
  return (
    <section className="offline">
      <div className="offline__inner">
        <header className="offline__header" data-aos="fade-up">
          <h2 className="offline__title">Offline Capability</h2>
          <p className="offline__subtitle">
            MyNia is designed to support everyone, including communities in rural, remote, and
            underserved areas where internet access may be limited
          </p>
        </header>

        <div className="offline__stage">
          {/* Figma "Ellipse 1": the arc behind the phone that the three points follow */}
          <img className="offline__ellipse" src={ellipse} alt="" aria-hidden="true" width={902} height={902} />
          <img
            className="offline__phone"
            src={phoneHand}
            alt="Hand holding a phone running the MyNia app"
            data-aos="fade-right"
          />
          <ul className="offline__points">
            {POINTS.map((point, index) => (
              <li
                key={point.text}
                className={`offline-point offline-point--${index + 1}`}
                data-aos="fade-left"
                data-aos-delay={index * 100}
              >
                <span className="offline-point__icon">
                  <img src={point.icon} alt="" aria-hidden="true" />
                </span>
                <span className="offline-point__text">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
