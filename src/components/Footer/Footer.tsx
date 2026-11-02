import './Footer.css'

const logo = '/assets/footer/logo-genia.png'

type SocialLink = { label: string; icon: string; href?: string }

// GMedCC's own profiles, the same as the gmedcc.com footer. An entry without an href is not
// rendered.
const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61573723025665&locale=id_ID',
    icon: '/assets/footer/social-facebook.svg',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/gmed.cc?igsh=MWFzdXlrMWc0d3Y0YQ==',
    icon: '/assets/footer/social-instagram.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/gmedcc/about/?viewAsMember=true',
    icon: '/assets/footer/social-linkedin.svg',
  },
  // Twitter/X: hidden until GMedCC supplies its profile URL (none is known; gmedcc.com has none).
  { label: 'Twitter', icon: '/assets/footer/social-twitter.svg' },
]

const LINK_COLUMNS = [
  {
    heading: 'GMEDCC',
    headingIsLink: true,
    links: [
      { label: 'About us', href: 'https://www.gmedcc.com/' },
      { label: 'Contact us', href: 'https://www.gmedcc.com/contact-us' },
      // FAQs: hidden until the page exists.
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms and Conditions', href: '/terms-and-conditions/' },
      { label: 'Privacy Policy', href: '/privacy-policy/' },
    ],
  },
  {
    heading: 'Contact',
    links: [{ label: 'service@gmedcc.com', href: 'mailto:service@gmedcc.com' }],
  },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <a className="site-footer__logo" href="/">
          <img src={logo} alt="genia ai" width={128} height={40} />
        </a>

        <div className="site-footer__main">
          <div className="site-footer__brand">
            <p className="site-footer__tagline">AI transforming health</p>
            <p className="site-footer__mission">
              Reshaping the future of healthcare,
              <br />
              starting where it&rsquo;s needed most
            </p>
            <div className="site-footer__socials">
              {SOCIAL_LINKS.filter((social) => social.href).map((social) => (
                <a
                  key={social.label}
                  className="site-footer__social"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <img src={social.icon} alt="" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav className="site-footer__columns" aria-label="Footer">
            {LINK_COLUMNS.map((column) => (
              <div className="site-footer__column" key={column.heading}>
                {column.headingIsLink ? (
                  <a
                    className="site-footer__heading site-footer__heading--link"
                    href="https://www.gmedcc.com/"
                  >
                    {column.heading}
                  </a>
                ) : (
                  <span className="site-footer__heading">{column.heading}</span>
                )}
                {column.links.map((link) => (
                  <a className="site-footer__link" href={link.href} key={link.label}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <p className="site-footer__copyright">&copy; 2026. All rights reserved</p>
      </div>
    </footer>
  )
}
