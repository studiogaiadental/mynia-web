import React from 'react'

const logo = '/assets/logo-transparent.png'

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.1-9.3L1 2h7.1l4.9 6.1L18.9 2Zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.5 8.65 22 11.2 22 14.4V21h-4v-6c0-1.43-.03-3.28-2-3.28-2 0-2.3 1.56-2.3 3.18V21h-4V9Z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-top">
          <div className="footer-brand" data-aos="fade-up">
            <a href="#" className="footer-logo-link">
              <img src={logo} alt="MyNia Health" className="footer-logo" />
            </a>
            <p className="footer-description">
              Empowering your health journey with smarter monitoring, personalized insights, and seamless care every step of the way.
            </p>
          </div>
          <div className="footer-links-group">
            <div className="footer-col" data-aos="fade-up" data-aos-delay="100">
              <h4 className="footer-heading">Company</h4>
              <a href="#" className="footer-link">About Us</a>
              <a href="#" className="footer-link">Careers</a>
              <a href="#" className="footer-link">Genia Day</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
            <div className="footer-col" data-aos="fade-up" data-aos-delay="200">
              <h4 className="footer-heading">Product</h4>
              <a href="#" className="footer-link">Features</a>
              <a href="#" className="footer-link">Devices</a>
              <a href="#" className="footer-link">Mobile App</a>
              <a href="#" className="footer-link">Pricing</a>
            </div>
            <div className="footer-col" data-aos="fade-up" data-aos-delay="300">
              <h4 className="footer-heading">Legal</h4>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Cookie Policy</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom" data-aos="fade-up" data-aos-offset="0">
          <p className="footer-copyright">&copy; {new Date().getFullYear()} MyNia Health. All rights reserved.</p>
          <div className="footer-socials">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.label} href={social.href} className="footer-social-link" aria-label={social.label}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
