import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import './HealthStory.css'

const bgEllipse = '/assets/health-story/bg-ellipse.svg'

type Tab = {
  label: string
  title: string
  text: string
  tags: string[]
  phone: string
  phoneAlt: string
}

const TABS: Tab[] = [
  {
    label: 'Health Assessments',
    title: 'Prevention First',
    text: 'Identify potential health risks early through evidence-based health assessments, lifestyle tracking, and AI-assisted screening.',
    tags: ['Cardiovascular', 'Diabetes', 'Skin', 'Cancer', 'Lifestyle'],
    phone: '/assets/health-story/phone-assessments.png',
    phoneAlt: 'MyNia life stage questionnaire with baseline health score',
  },
  {
    label: 'Measurement',
    title: 'Monitor What Matters',
    text: 'Keep track of your health with your compatible health devices or manually record your health information to gain insights & trends',
    tags: [
      'Blood Pressure',
      'ECG',
      'Heart Rate',
      'Body Temperature',
      'Skin Photos',
      'Blood Oxygen (SpO₂)',
      'Blood Glucose',
      'Lung Sounds',
      'Laboratory Results',
    ],
    phone: '/assets/health-story/phone-measurement.png',
    phoneAlt: 'MyNia connected device measurement screen',
  },
  {
    label: 'My Focus and Task',
    title: 'Stay Focused on Your Goals',
    text: 'Turn healthy intentions into daily routines through personalized health tasks and reminders.',
    tags: [
      'Medication reminder',
      'Exercise',
      'Blood pressure',
      'Blood sugar',
      'Symptoms tracking',
      'Diet',
      'Mental wellbeing',
    ],
    phone: '/assets/health-story/phone-focus.png',
    phoneAlt: 'MyNia home screen with today’s tasks and focus areas',
  },
  {
    label: 'OCR KTP',
    title: 'Verified in One Scan',
    text: "Point your camera at your KTP and we'll pull your NIK, name, address, and date of birth automatically.",
    tags: ['NIK (National Identity Number)', 'Full Name', 'Date of Birth', 'Home Address'],
    phone: '/assets/health-story/phone-ocr-ktp.png',
    phoneAlt: 'MyNia KTP card scanning screen',
  },
  {
    label: 'Community Head',
    title: 'Built for Community Care',
    text: 'Register participants, coordinate field nurses, and track population health trends, one dashboard to manage care at scale.',
    tags: [
      'Program Registration',
      'Participant Enrollment',
      'Field Data Coordination',
      'Population Analytics',
    ],
    phone: '/assets/health-story/phone-community.png',
    phoneAlt: 'MyNia community groups screen',
  },
]

export default function HealthStory() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeTab = TABS[activeIndex]

  const focusTab = (index: number) => {
    const next = (index + TABS.length) % TABS.length
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keyMap: Record<string, number> = {
      ArrowDown: activeIndex + 1,
      ArrowRight: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: TABS.length - 1,
    }
    if (!(event.key in keyMap)) return
    event.preventDefault()
    focusTab(keyMap[event.key])
  }

  return (
    <section className="health-story">
      <div className="health-story__inner">
        <div className="health-story__intro">
          <header className="health-story__header" data-aos="fade-up">
            <h2 className="health-story__title">
              Your Health Story, All <br className="health-story__break" />
              in One Place
            </h2>
            <p className="health-story__subtitle">
              Designed for individuals, families, and community health programs.
            </p>
          </header>

          <div
            className="health-story__tabs"
            role="tablist"
            aria-label="MyNia features"
            aria-orientation="vertical"
            onKeyDown={handleKeyDown}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {TABS.map((tab, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={tab.label}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={`health-story-tab-${index}`}
                  aria-selected={isActive}
                  aria-controls="health-story-panel"
                  tabIndex={isActive ? 0 : -1}
                  className={`story-tab${isActive ? ' story-tab--active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="story-tab__number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="story-tab__divider" aria-hidden="true" />
                  <span className="story-tab__label">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div
          className="story-card"
          id="health-story-panel"
          role="tabpanel"
          aria-labelledby={`health-story-tab-${activeIndex}`}
          data-aos="fade-left"
        >
          <div className="story-card__media">
            <img className="story-card__glow story-card__glow--top" src={bgEllipse} alt="" aria-hidden="true" />
            <img className="story-card__glow story-card__glow--top" src={bgEllipse} alt="" aria-hidden="true" />
            <img className="story-card__glow story-card__glow--left" src={bgEllipse} alt="" aria-hidden="true" />
            <img className="story-card__glow story-card__glow--left-2" src={bgEllipse} alt="" aria-hidden="true" />
            <img
              key={activeTab.phone}
              className="story-card__phone"
              src={activeTab.phone}
              alt={activeTab.phoneAlt}
            />
          </div>
          <div className="story-card__body" key={activeTab.label}>
            <h3 className="story-card__title">{activeTab.title}</h3>
            <div className="story-card__details">
              <p className="story-card__text">{activeTab.text}</p>
              <ul className="story-card__tags">
                {activeTab.tags.map((tag) => (
                  <li className="story-card__tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preload the other phone screens so switching tabs never flashes */}
      <div className="health-story__preload" aria-hidden="true">
        {TABS.map((tab) => (
          <img key={tab.phone} src={tab.phone} alt="" loading="lazy" />
        ))}
      </div>
    </section>
  )
}
