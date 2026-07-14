import { useState } from 'react'

type Tab = {
  label: string
  title: string
  text: string
  phone: string
  phoneAlt: string
}

const TABS: Tab[] = [
  {
    label: 'Measurement',
    title: 'Monitor What Matters',
    text: 'Keep track of your health with easy-to-understand measurements, trends, and insights.',
    phone: '/assets/monitor-phone.png',
    phoneAlt: 'MyNia measurement screen',
  },
  {
    label: 'My Focus & task',
    title: 'Stay Focused on Your Goals',
    text: 'Turn healthy intentions into daily routines through personalized health tasks and reminders.',
    phone: '/assets/focus-phone.png',
    phoneAlt: 'MyNia focus and tasks screen',
  },
  {
    label: 'Medical records',
    title: 'See Your Progress Over Time',
    text: 'Understand patterns, celebrate milestones, and build lasting habits.',
    phone: '/assets/records-phone.png',
    phoneAlt: 'MyNia medical records screen',
  },
  {
    label: 'Life stage questionnaire',
    title: 'Support Every Stage of Life',
    text: 'From everyday wellness to pregnancy and child growth monitoring, MyNia grows with you.',
    phone: '/assets/lsq-phone.png',
    phoneAlt: 'MyNia life stage questionnaire screen',
  },
]

export default function HealthStory() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTab = TABS[activeIndex]

  return (
    <>
      <section className="health-story">
        <h2 className="health-story__title" data-aos="fade-up">Your Health Story, All in One Place</h2>
        <div className="health-story__tabs" role="tablist" aria-label="MyNia features" data-aos="fade-up" data-aos-delay="100">
          {TABS.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              id={`health-story-tab-${index}`}
              aria-selected={index === activeIndex}
              aria-controls="health-story-panel"
              className={`tab-pill${index === activeIndex ? ' tab-pill--active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section
        className="monitor"
        id="health-story-panel"
        role="tabpanel"
        aria-labelledby={`health-story-tab-${activeIndex}`}
      >
        <div className="monitor__inner" key={activeTab.label}>
          <div className="monitor__visual" data-aos="fade-right">
            <span className="monitor__halo" aria-hidden="true" />
            <img className="monitor__phone" src={activeTab.phone} alt={activeTab.phoneAlt} />
          </div>
          <div className="monitor__content" data-aos="fade-left">
            <h2 className="monitor__title">{activeTab.title}</h2>
            <p className="monitor__text">{activeTab.text}</p>
          </div>
        </div>
      </section>
    </>
  )
}
