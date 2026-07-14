import React from 'react'

const logo = '/assets/logo.png'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-top">
          <div className="footer-brand" data-aos="fade-up">
            <a href="#">
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
            <a href="#" className="footer-social-link" aria-label="Facebook">Fb</a>
            <a href="#" className="footer-social-link" aria-label="Twitter">Tw</a>
            <a href="#" className="footer-social-link" aria-label="Instagram">Ig</a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn">In</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
