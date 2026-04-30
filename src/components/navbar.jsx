import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import "./logo.css";
import "./button.css";
import "./gird of the top.css";
import "./background.css";

const Navbar = () => {
  const [activeBtn, setActiveBtn] = useState(null);
  const { t, i18n } = useTranslation();

  const handleClick = (btnName) => {
    if (activeBtn === btnName) {
      setActiveBtn(null);
    } else {
      setActiveBtn(btnName);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };
  const navigate = useNavigate();

  return (
    <div className="parent">
      <div className="logo-div">
        <img className="logo" src="/logo.png" alt="HADANATI Logo" />
      </div>

      <div className="buttons-div">
        <button onClick={() => handleClick('home')} className={`home-js ${activeBtn === 'home' ? 'nhome' : 'home'}`}>
          {activeBtn === 'home' ? t('navbar.home')  : t('navbar.home')}
        </button>
        <button onClick={() => handleClick('about')} className={`about ${activeBtn === 'about' ? 'active' : ''}`}>
          {t('navbar.about')}
        </button>
        <button onClick={() => handleClick('help')} className={`help ${activeBtn === 'help' ? 'active' : ''}`}>
          {t('navbar.help')}
        </button>
      </div>

      <div className="right-buttons">
        <button onClick={toggleLanguage} className={`lang ${activeBtn === 'lang' ? 'active' : ''}`}>
          {i18n.language === 'en' ? 'العربية' : 'English'}
        </button>
       <button className="login" onClick={() => navigate('/hadanati-login')}>
        {t('navbar.login')}
      </button>
      </div>
    </div>
  );
};

export default Navbar;