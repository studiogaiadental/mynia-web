import './OfflineCapability.css'

const phoneHand = '/assets/offline/phone-hand.png'

const POINTS = [
  { icon: '/assets/offline/icon-archive.png', text: 'Manage health records anytime, anywhere' },
  { icon: '/assets/offline/icon-gauge.png', text: 'Log measurements without interruption' },
  { icon: '/assets/offline/icon-offline.png', text: 'Uninterrupted offline & online availability' },
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
          {/* Figma "Ellipse 1": 4px stroke in brand-secondary, fading out towards the left */}
          <svg className="offline__ellipse" viewBox="0 0 902 902" aria-hidden="true">
            <defs>
              <linearGradient id="offline-arc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0.83" stopColor="#afdadb" stopOpacity="0" />
                <stop offset="1" stopColor="#afdadb" stopOpacity="0.39" />
              </linearGradient>
            </defs>
            <circle cx="451" cy="451" r="449" fill="none" stroke="url(#offline-arc)" strokeWidth="4" />
          </svg>
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
