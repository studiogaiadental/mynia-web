import './Features.css'

const FEATURES = [
  {
    icon: 'dashboard',
    title: 'Task Dashboard',
    text: 'Track all doctor tasks, medication schedules, and reminders in one place.',
  },
  {
    icon: 'task',
    title: 'Health Assessment',
    text: 'Questionnaires that create a personal risk score for heart health and diabetes.',
  },
  {
    icon: 'audit',
    title: 'Analysis & Monitor',
    text: 'AI-reviewed insights and trend graphs from your vitals, ECG, and lab biomarkers.',
  },
  {
    icon: 'laptop-phone-sync',
    title: 'Medical Tools Link',
    text: 'Link your ECG, monitor, stethoscope, and otoscope to your profile.',
  },
  {
    icon: 'medicine-bottle',
    title: 'E-Pharmacy',
    text: 'Order medications online with delivery, pickup, and reminders.',
  },
  {
    icon: 'news',
    title: 'Health Articles',
    text: 'A curated library of medically reviewed articles, personalized to your health conditions.',
  },
  {
    icon: 'video',
    title: 'Telehealth',
    text: 'Book video, audio, or chat consultations with doctors and specialists, on demand.',
  },
  {
    icon: 'calendar',
    title: 'Treatment Plans',
    text: 'Personalized care protocols and digital prescriptions from your doctor.',
  },
  {
    icon: 'clinic',
    title: 'Medical Records',
    text: 'Lab results, imaging, and doctor reports, stored securely in one shareable timeline.',
  },
  {
    icon: 'gamepad',
    title: 'Health Games',
    text: 'Health challenges, badges, and a leaderboard gamify healthy habits.',
  },
]

export default function Features() {
  return (
    <section className="features">
      <div className="features__inner">
        <h2 className="features__title" data-aos="fade-up">Our Features</h2>
        <ul className="features__grid" data-aos="fade-up" data-aos-delay="100">
          {FEATURES.map((feature) => (
            <li className="feature-item" key={feature.title}>
              <span className="feature-item__icon">
                <img src={`/assets/features/icon-${feature.icon}.png`} alt="" aria-hidden="true" />
              </span>
              <div className="feature-item__body">
                <h3 className="feature-item__title">{feature.title}</h3>
                <p className="feature-item__text">{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
