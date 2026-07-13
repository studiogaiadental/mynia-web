const iconHeart = '/assets/icon-heart.svg'
const iconDiabetes = '/assets/icon-diabetes.svg'
const iconMaternal = '/assets/icon-maternal.svg'
const iconChild = '/assets/icon-child.svg'
const iconMedication = '/assets/icon-medication.svg'
const iconHabits = '/assets/icon-habits.svg'
const iconRecords = '/assets/icon-records.svg'
const iconProgress = '/assets/icon-progress.svg'

const FOCUS_AREAS = [
  { icon: iconHeart, label: 'Heart Health' },
  { icon: iconDiabetes, label: 'Diabetes Care' },
  { icon: iconMaternal, label: 'Maternal Health' },
  { icon: iconChild, label: 'Child Growth' },
  { icon: iconMedication, label: 'Medication Management' },
  { icon: iconHabits, label: 'Healthy Habits' },
  { icon: iconRecords, label: 'Medical Records' },
  { icon: iconProgress, label: 'Long-Term Progress' },
]

export default function FocusAreas() {
  return (
    <section className="focus-areas">
      <p className="focus-areas__eyebrow">Our Focus Areas</p>
      <div className="focus-areas__grid">
        {FOCUS_AREAS.map((area) => (
          <div className="focus-item" key={area.label}>
            <span className="focus-item__icon">
              <img src={area.icon} alt="" aria-hidden="true" />
            </span>
            <span className="focus-item__label">{area.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
