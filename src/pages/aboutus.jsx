import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MdOutlineFamilyRestroom } from 'react-icons/md';
import { IoMdBusiness } from 'react-icons/io';
import { IoShieldOutline } from 'react-icons/io5';
import { BiLockAlt } from 'react-icons/bi';
import './aboutus.css';
 
const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
 
  return (
    <div className="about-page">
 
      {/* ── HERO ── */}
      <section className="about-hero">
        <h1 className="about-hero__title">
          {t('about.hero.title')}<br />
          <span className="about-hero__brand">{t('about.hero.brand')}</span>
        </h1>
        <p className="about-hero__desc">
          {t('about.hero.desc')}
        </p>
      </section>
 
      {/* ── THREE CARDS ── */}
      <section className="about-cards">
 
        {/* Card 1 – For Parents */}
        <div className="about-card about-card--light">
          <div className="about-card__icon">
            <MdOutlineFamilyRestroom size={36} />
          </div>
          <h3 className="about-card__heading">{t('about.parents.heading')}</h3>
          <ul className="about-card__list">
            <li>{t('about.parents.item1')}</li>
            <li>{t('about.parents.item2')}</li>
            <li>{t('about.parents.item3')}</li>
            <li>{t('about.parents.item4')}</li>
            <li>{t('about.parents.item5')}</li>
          </ul>
          <button className="about-card__cta" onClick={() => navigate('/search')}>
            {t('about.parents.cta')} <span className="about-card__arrow">→</span>
          </button>
        </div>
 
        {/* Card 2 – For Daycares */}
        <div className="about-card about-card--light">
          <div className="about-card__icon">
            <IoMdBusiness size={36} />
          </div>
          <h3 className="about-card__heading">{t('about.daycares.heading')}</h3>
          <ul className="about-card__list">
            <li>{t('about.daycares.item1')}</li>
            <li>{t('about.daycares.item2')}</li>
            <li>{t('about.daycares.item3')}</li>
            <li>{t('about.daycares.item4')}</li>
          </ul>
        </div>
 
        {/* Card 3 – Secure Communication */}
        <div className="about-card about-card--dark">
 
          {/* Stacked shield + lock icon */}
          <div className="about-card__icon about-card__icon--white">
            <div className="secure-icon-stack">
              <IoShieldOutline className="secure-icon-shield" />
              <BiLockAlt className="secure-icon-lock" />
            </div>
          </div>
 
          {/* Decorative bubble top-right */}
          <div className="about-card__bubble" aria-hidden="true">
            <svg width="90" height="80" viewBox="0 0 80 70" fill="none">
              <rect x="5" y="5" width="70" height="50" rx="12" fill="white" opacity=".12"/>
              <rect x="5" y="5" width="70" height="50" rx="12" stroke="white" strokeWidth="1.5" opacity=".25"/>
              <polygon points="20,55 30,55 20,68" fill="white" opacity=".12"/>
            </svg>
          </div>
 
          <h3 className="about-card__heading about-card__heading--white">{t('about.secure.heading')}</h3>
          <p className="about-card__text--white">
            {t('about.secure.desc')}
          </p>
        </div>
 
      </section>
 
      {/* ── COMMITMENT ── */}
      <section className="about-commit">
        <div className="about-commit__left">
          <h2 className="about-commit__title">
            {t('about.commit.title')}<br />
            <span className="about-commit__title--muted">{t('about.commit.subtitle')}</span>
          </h2>
          <blockquote className="about-commit__quote">
            {t('about.commit.quote')}
          </blockquote>
        </div>
 
        <div className="about-commit__right">
          <div className="about-commit__circle">
            <span className="about-commit__values-label">
              {t('about.commit.valuesLabel')}
            </span>
            <p className="about-commit__value">{t('about.commit.value1')}</p>
            <p className="about-commit__value">{t('about.commit.value2')}</p>
            <p className="about-commit__value">{t('about.commit.value3')}</p>
            <span className="about-commit__badge">{t('about.commit.badge')}</span>
          </div>
        </div>
      </section>
 
    </div>
  );
};
 
export default About;