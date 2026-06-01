import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import "./logo.css";
import "./button.css";
import "./gird of the top.css";
import "./background.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="parent">
      <div className="logo-div">
        <img className="logo" src="/logo.png" alt="HADANATI Logo" />
      </div>

      <div className="buttons-div">
        <button className="home" onClick={() => navigate('/')}>
          {t('navbar.home')}
        </button>
        <button className="about" onClick={() => navigate('/about')}>
          {t('navbar.about')}
        </button>
        <button className="help" onClick={() => navigate('/help')}>
          {t('navbar.help')}
        </button>
      </div>

      <div className="right-buttons">
        <button className="lang" onClick={toggleLanguage}>
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