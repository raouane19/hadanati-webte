import { useState } from "react";
import "./Navbar.css";

const Navbar = ({ activeSection, onNavClick }) => {
  const [lang, setLang] = useState("ar");

  const toggleLang = () => setLang((l) => (l === "ar" ? "en" : "ar"));

  const navItems = [
    { key: "daycares",  label: "Daycares" },
    { key: "parents",   label: "Parents" },
    { key: "requests",  label: "Requests" },
    { key: "reviews",   label: "Reviews" },
    { key: "messages",  label: "Messages" },
  ];

  return (
    <header className="navbar">
     <div className="navbar__logo">
  <img src="/logo.png" alt="HADANATI" style={{ height: '48px', objectFit: 'contain' }} />
</div>

      <nav className="navbar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`navbar__nav-btn${activeSection === item.key ? " navbar__nav-btn--active" : ""}`}
            onClick={() => onNavClick(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="navbar__right">
        <button className="navbar__lang-btn" onClick={toggleLang}>
          {lang === "ar" ? "العربية" : "English"}
        </button>
        <div className="navbar__user-info">
          <span className="navbar__user-name">Admin</span>
          <span className="navbar__user-role">Super Admin</span>
        </div>
        <div className="navbar__avatar">A</div>
      </div>
    </header>
  );
};

export default Navbar;