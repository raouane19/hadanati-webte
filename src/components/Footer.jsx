import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-left">
          <img src="/logo.png" alt="HADANATI Logo" className="footer-logo" />
          <p className="footer-description">
            {t('footer.description')}
          </p>
          <img src="/left-social-icons.png" alt="Social" className="left-social-img" />
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">{t('footer.about.title')}</h4>
          <ul className="footer-links">
            <li><a href="#!">{t('footer.about.mission')}</a></li>
            <li><a href="#!">{t('footer.about.team')}</a></li>
            <li><a href="#!">{t('footer.about.careers')}</a></li>
            <li><a href="#!">{t('footer.about.contact')}</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">{t('footer.help.title')}</h4>
          <ul className="footer-links">
            <li><a href="#!">{t('footer.help.support')}</a></li>
            <li><a href="#!">{t('footer.help.faq')}</a></li>
            <li><a href="#!">{t('footer.help.center')}</a></li>
            <li><a href="#!">{t('footer.help.guides')}</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">{t('footer.stayUpdated')}</h4>
          <img src="/social-icons.png" alt="Social Media" className="social-icons-img" />
        </div>

      </div>

      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;