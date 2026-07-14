const iconHeart = '/assets/icon-heart.svg'
const iconDiabetes = '/assets/icon-diabetes.svg'
const iconMaternal = '/assets/icon-maternal.svg'
const iconChild = '/assets/icon-child.svg'
const iconMedication = '/assets/icon-medication.svg'
const iconHabits = '/assets/icon-habits.svg'
const iconRecords = '/assets/icon-records.svg'
const iconProgress = '/assets/icon-progress.svg'

const FOCUS_AREAS = [
  {
    icon: iconHeart,
    label: 'Heart Health',
    text: 'Track blood pressure and cardiovascular wellness over time.',
  },
  {
    icon: iconDiabetes,
    label: 'Diabetes Care',
    text: 'Monitor glucose levels and stay on top of your care plan.',
  },
  {
    icon: iconMaternal,
    label: 'Maternal Health',
    text: 'Get support through every stage of your pregnancy.',
  },
  {
    icon: iconChild,
    label: 'Child Growth',
    text: 'Track developmental milestones with confidence.',
  },
  {
    icon: iconMedication,
    label: 'Medication Management',
    text: 'Stay on schedule with smart reminders and refill alerts.',
  },
  {
    icon: iconHabits,
    label: 'Healthy Habits',
    text: 'Build routines that stick, one day at a time.',
  },
  {
    icon: iconRecords,
    label: 'Medical Records',
    text: 'Keep your health history secure and in one place.',
  },
  {
    icon: iconProgress,
    label: 'Long-Term Progress',
    text: 'See trends and celebrate milestones as they happen.',
  },
]

export default function FocusAreas() {
  return (
    <section className="focus-areas">
      <div className="focus-areas__inner">
        <p className="focus-areas__eyebrow" data-aos="fade-up">Our Focus Areas</p>
        <h2 className="focus-areas__title" data-aos="fade-up">
          A Complete Toolkit for Your Health Journey
        </h2>
        <p className="focus-areas__subtitle" data-aos="fade-up">
          From heart health to long-term progress, MyNia keeps every part of your care connected.
        </p>
        <div className="focus-areas__grid">
          {FOCUS_AREAS.map((area, index) => (
            <div className="focus-item" key={area.label} data-aos="fade-up" data-aos-delay={index * 50}>
              <span className="focus-item__icon">
                <img src={area.icon} alt="" aria-hidden="true" />
              </span>
              <div className="focus-item__body">
                <span className="focus-item__label">{area.label}</span>
                <p className="focus-item__text">{area.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
