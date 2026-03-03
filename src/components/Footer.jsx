import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Section - Logo & Description */}
        <div className="footer-left">
          <img src="/logo.png" alt="HADANATI Logo" className="footer-logo" />
          <p className="footer-description">
            {t('footer.description')}
          </p>
          <div className="social-icons">
            <a href="#!" className="social-icon">
              <img src="/wrl.png" alt="Social" width="35" height="35" />
            </a>
            <a href="#!" className="social-icon">
              <p className="email-icon">@</p>
            </a>
            <a href="#!" className="social-icon">
             <img src="/comment.png" alt="Sociale" width="20" height="20" />
            </a>
          </div>
        </div>

        {/* Middle Section - About */}
        <div className="footer-column">
          <h4 className="footer-heading">{t('footer.about.title')}</h4>
          <ul className="footer-links">
            <li><a href="#!">{t('footer.about.mission')}</a></li>
            <li><a href="#!">{t('footer.about.team')}</a></li>
            <li><a href="#!">{t('footer.about.careers')}</a></li>
            <li><a href="#!">{t('footer.about.contact')}</a></li>
          </ul>
        </div>

        {/* Middle Section - Get Help */}
        <div className="footer-column">
          <h4 className="footer-heading">{t('footer.help.title')}</h4>
          <ul className="footer-links">
            <li><a href="#!">{t('footer.help.support')}</a></li>
            <li><a href="#!">{t('footer.help.faq')}</a></li>
            <li><a href="#!">{t('footer.help.center')}</a></li>
            <li><a href="#!">{t('footer.help.guides')}</a></li>
          </ul>
        </div>

        {/* Right Section - Stay Updated */}
        <div className="footer-column">
          <h4 className="footer-heading">{t('footer.stayUpdated')}</h4>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;