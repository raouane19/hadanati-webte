import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './daycareprofile.css';

const DaycareProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const photoInputRef = useRef(null);

  const [form, setForm] = useState({
    fullAddress: '',
    city: '',
    monthlyFee: '',
    totalCapacity: '',
    ageRange: '',
    educationalApproach: '',
    opensAt: '',
    closesAt: '',
    transport: false,
    healthcare: false,
    lunch: false,
    snacks: false,
    description: '',
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleToggle = (name) => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleKeyDown = (e, nextFieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.querySelector(`[name="${nextFieldName}"]`);
      if (nextField) nextField.focus();
    }
  };

  const handlePhotos = (e) => {
    const newFiles = Array.from(e.target.files);
    setForm((prev) => {
      const combined = [...prev.photos, ...newFiles];
      return { ...prev, photos: combined };
    });
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setForm((prev) => {
      const combined = [...prev.photos, ...newFiles];
      return { ...prev, photos: combined };
    });
  };

  const handleSubmit = () => {
    console.log('Daycare profile data:', form);
    navigate('/dashboard');
  };

  return (
    <div className="daycare-container">
      <h1 className="daycare-title">{t('daycare.title')}</h1>

      <div className="daycare-form-wrapper">

        <div className="daycare-left">
          <a className="back-step" onClick={() => navigate(-1)}>
            ← {t('daycare.backStep')}
          </a>

          <div className="form-group">
            <label className="form-label">{t('daycare.fullAddress')}</label>
            <input
              className="form-input"
              type="text"
              name="fullAddress"
              placeholder={t('daycare.fullAddressPlaceholder')}
              value={form.fullAddress}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, 'city')}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('daycare.city')}</label>
             <select className="form-select" name="city" value={form.city} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'monthlyFee')}>
  <option value="">{t('daycare.selectCity')}</option>
  <option value="01">01 - Adrar</option>
  <option value="02">02 - Chlef</option>
  <option value="03">03 - Laghouat</option>
  <option value="04">04 - Oum El Bouaghi</option>
  <option value="05">05 - Batna</option>
  <option value="06">06 - Béjaïa</option>
  <option value="07">07 - Biskra</option>
  <option value="08">08 - Béchar</option>
  <option value="09">09 - Blida</option>
  <option value="10">10 - Bouira</option>
  <option value="11">11 - Tamanrasset</option>
  <option value="12">12 - Tébessa</option>
  <option value="13">13 - Tlemcen</option>
  <option value="14">14 - Tiaret</option>
  <option value="15">15 - Tizi Ouzou</option>
  <option value="16">16 - Alger</option>
  <option value="17">17 - Djelfa</option>
  <option value="18">18 - Jijel</option>
  <option value="19">19 - Sétif</option>
  <option value="20">20 - Saïda</option>
  <option value="21">21 - Skikda</option>
  <option value="22">22 - Sidi Bel Abbès</option>
  <option value="23">23 - Annaba</option>
  <option value="24">24 - Guelma</option>
  <option value="25">25 - Constantine</option>
  <option value="26">26 - Médéa</option>
  <option value="27">27 - Mostaganem</option>
  <option value="28">28 - M'Sila</option>
  <option value="29">29 - Mascara</option>
  <option value="30">30 - Ouargla</option>
  <option value="31">31 - Oran</option>
  <option value="32">32 - El Bayadh</option>
  <option value="33">33 - Illizi</option>
  <option value="34">34 - Bordj Bou Arreridj</option>
  <option value="35">35 - Boumerdès</option>
  <option value="36">36 - El Tarf</option>
  <option value="37">37 - Tindouf</option>
  <option value="38">38 - Tissemsilt</option>
  <option value="39">39 - El Oued</option>
  <option value="40">40 - Khenchela</option>
  <option value="41">41 - Souk Ahras</option>
  <option value="42">42 - Tipaza</option>
  <option value="43">43 - Mila</option>
  <option value="44">44 - Aïn Defla</option>
  <option value="45">45 - Naâma</option>
  <option value="46">46 - Aïn Témouchent</option>
  <option value="47">47 - Ghardaïa</option>
  <option value="48">48 - Relizane</option>
  <option value="49">49 - Timimoun</option>
  <option value="50">50 - Bordj Badji Mokhtar</option>
  <option value="51">51 - Ouled Djellal</option>
  <option value="52">52 - Béni Abbès</option>
  <option value="53">53 - In Salah</option>
  <option value="54">54 - In Guezzam</option>
  <option value="55">55 - Touggourt</option>
  <option value="56">56 - Djanet</option>
  <option value="57">57 - El M'Ghair</option>
  <option value="58">58 - El Meniaa</option>
  <option value="59">59 - Aflou</option>
  <option value="60">60 - Aïn Oussera</option>
  <option value="61">61 - Barika</option>
  <option value="62">62 - Bir el-Ater</option>
  <option value="63">63 - Bou Saâda</option>
  <option value="64">64 - El Abiodh Sidi Cheikh</option>
  <option value="65">65 - El Aricha</option>
  <option value="66">66 - El Kantara</option>
  <option value="67">67 - Ksar Chellala</option>
  <option value="68">68 - Ksar El Boukhari</option>
  <option value="69">69 - Messaad</option>
</select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('daycare.monthlyFee')}</label>
              <input className="form-input" type="number" name="monthlyFee" placeholder="0.00" value={form.monthlyFee} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'totalCapacity')} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('daycare.totalCapacity')}</label>
              <input className="form-input" type="text" name="totalCapacity" placeholder={t('daycare.capacityPlaceholder')} value={form.totalCapacity} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'ageRange')} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('daycare.ageRange')}</label>
              <input className="form-input" type="text" name="ageRange" placeholder={t('daycare.ageRangePlaceholder')} value={form.ageRange} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'educationalApproach')} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('daycare.educationalApproach')}</label>
              <select className="form-select" name="educationalApproach" value={form.educationalApproach} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'opensAt')}>
                <option value="">{t('daycare.selectApproach')}</option>
                <option value="montessori">Montessori</option>
                <option value="waldorf">Waldorf</option>
                <option value="reggio">Reggio Emilia</option>
                <option value="play-based">Play-Based</option>
                <option value="traditional">Traditional</option>
                 <option value="language-learning">Language Learning</option>
              </select>
            </div>
            <div className="form-group time-group">
              <div className="form-group">
                <label className="form-label">{t('daycare.opensAt')}</label>
                <input className="form-input" type="time" name="opensAt" value={form.opensAt} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'closesAt')} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('daycare.closesAt')}</label>
                <input className="form-input" type="time" name="closesAt" value={form.closesAt} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'description')} />
              </div>
            </div>
          </div>

          <div className="form-row services-row">
            <div className="form-group">
              <label className="form-label services-title">{t('daycare.services')}</label>
              <div className="toggle-row">
                <span className="toggle-label">{t('daycare.transport')}</span>
                <div className={`toggle ${form.transport ? 'active' : ''}`} onClick={() => handleToggle('transport')}>
                  <div className="toggle-thumb" />
                </div>
              </div>
              <div className="toggle-row">
                <span className="toggle-label">{t('daycare.healthcare')}</span>
                <div className={`toggle ${form.healthcare ? 'active' : ''}`} onClick={() => handleToggle('healthcare')}>
                  <div className="toggle-thumb" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label services-title">{t('daycare.foodServices')}</label>
              <div className="checkbox-row">
                <input type="checkbox" id="lunch" name="lunch" checked={form.lunch} onChange={handleChange} />
                <label htmlFor="lunch" className="checkbox-label">{t('daycare.lunch')}</label>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" id="snacks" name="snacks" checked={form.snacks} onChange={handleChange} />
                <label htmlFor="snacks" className="checkbox-label">{t('daycare.snacks')}</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('daycare.description')}</label>
            <textarea className="form-textarea" name="description" placeholder={t('daycare.descriptionPlaceholder')} value={form.description} onChange={handleChange} />
          </div>
        </div>

        <div className="daycare-right">
          <label className="form-label">{t('daycare.gallery')}</label>
          <div
            className="upload-area"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => photoInputRef.current.click()}
          >
            <div className="upload-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E8A0A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <p className="upload-title">{t('daycare.uploadTitle')}</p>
            <p className="upload-sub">{t('daycare.uploadSub')}</p>
            <p className="upload-limit">{t('daycare.uploadLimit')}</p>
            <input
              ref={photoInputRef}
              id="photo-input"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handlePhotos}
            />
          </div>

          {form.photos.length > 0 && (
            <div className="photo-previews">
              {form.photos.map((file, i) => (
                <div key={i} className="photo-thumb">
                  <img src={URL.createObjectURL(file)} alt={`upload-${i}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ NOW INSIDE THE CARD */}
        <div className="daycare-actions">
          <button className="btn-back-step" onClick={() => navigate(-1)}>
            {t('daycare.backStep')}
          </button>
          <button className="btn-primary btn-save" onClick={handleSubmit}>
            {t('daycare.saveBtn')} →
          </button>
        </div>

      

      </div> {/* ✅ end of daycare-form-wrapper */}
  <p className="help-text">
          {t('daycare.needHelp')} <a href="#!" className="help-link">{t('daycare.contactSupport')}</a>
        </p>
    </div>
  );
};

export default DaycareProfile;