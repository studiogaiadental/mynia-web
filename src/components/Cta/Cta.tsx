import ArrowButton from '../ui/ArrowButton'
import { APK_DOWNLOAD_URL } from '../../lib/api'
import './Cta.css'

const phones = '/assets/cta/cta-phones.jpg'
// 1×1 transparent GIF: desktop draws the phones in the section background, so it never needs the crop.
const blankPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export default function Cta() {
  return (
    <section className="cta">
      <div className="cta__inner">
        <div className="cta__content" data-aos="fade-up">
          <div className="cta__text">
            <h2 className="cta__title">Discover Your Health Journey with MyNia!</h2>
            <p className="cta__description">
              Join MyNia for a health journey! Discover personalized plans, expert guidance, and a
              supportive community to help you thrive. Let's step towards a healthier you!
            </p>
          </div>
          <ArrowButton href={APK_DOWNLOAD_URL}>Download Now</ArrowButton>
        </div>
        {/* Desktop shows the phones as part of the background image; smaller screens stack this crop under the text */}
        <picture className="cta__phones">
          <source media="(min-width: 1280px)" srcSet={blankPixel} />
          <img
            src={phones}
            alt="MyNia community group screens on two phones"
            width={1400}
            height={1068}
            decoding="async"
            fetchPriority="low"
          />
        </picture>
      </div>
    </section>
  )
}
