
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './daycareprofile.css';
import { completeDaycareProfile } from '../api/auth';

const DaycareProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const certInputRef  = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const [form, setForm] = useState({
    fullAddress: '',
    city: '',
    monthlyFeeMin: '',
    monthlyFeeMax: '',
    totalCapacity: '',
    ageFrom: '',
    ageTo: '',
    educationLevels: false,
    languageLearning: false,
    events: false,
    plays: false,
    opensAt: '',
    closesAt: '',
    dayStart: '',
    dayEnd: '',
    transport: false,
    healthcare: false,
    lunch: false,
    snacks: false,
    description: '',
    photos: [],
    certification: null,
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
      const combined = [...prev.photos, ...newFiles].slice(0, 5);
      return { ...prev, photos: combined };
    });
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setForm((prev) => {
      const combined = [...prev.photos, ...newFiles].slice(0, 5);
      return { ...prev, photos: combined };
    });
  };

  const handleCertification = (e) => {
    const file = e.target.files[0];
    if (file) setForm((prev) => ({ ...prev, certification: file }));
    e.target.value = '';
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

   const data = new FormData();
data.append('address',          form.fullAddress);
data.append('city',             form.city);
data.append('capacity',         form.totalCapacity);
data.append('age_range',        `${form.ageFrom} - ${form.ageTo}`);
data.append('price',            form.monthlyFeeMin);
data.append('has_transport',    form.transport);
data.append('has_lunch',        form.lunch);
data.append('has_snacks',       form.snacks);
data.append('hours',            `${form.opensAt} - ${form.closesAt} | ${form.dayStart} - ${form.dayEnd}`);
data.append('education_info',   form.educationLevels ? 'Education per Levels' : '');
data.append('healthcare_info',  form.healthcare ? 'Healthcare available' : '');


if (form.certification) data.append('certificate', form.certification);
    form.photos.forEach((photo) => data.append('photos', photo));

    try {
      // Uses DAYCARE_API (VITE_DAYCARE_API_URL) with token attached automatically
      await completeDaycareProfile(data);
      navigate('/facility-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="daycare-container">
      <h1 className="daycare-title">{t('daycare.title')}</h1>

      {error && (
        <p style={{ color: '#e53e3e', padding: '0 24px 12px', fontSize: 13 }}>{error}</p>
      )}

      <div className="daycare-form-wrapper">

        {/* ── LEFT COLUMN ── */}
        <div className="daycare-left">
          <a className="back-step" onClick={() => navigate(-1)}>
            ← {t('daycare.backStep')}
          </a>

          <div className="form-group">
            <label className="form-label">{t('daycare.fullAddress')}</label>
            <input className="form-input" type="text" name="fullAddress" placeholder={t('daycare.fullAddressPlaceholder')} value={form.fullAddress} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'city')} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('daycare.city')}</label>
              <select className="form-select" name="city" value={form.city} onChange={handleChange}>
                <option value="">{t('daycare.selectCity')}</option>
                <option value="01">01 - Adrar</option><option value="02">02 - Chlef</option>
                <option value="03">03 - Laghouat</option><option value="04">04 - Oum El Bouaghi</option>
                <option value="05">05 - Batna</option><option value="06">06 - Béjaïa</option>
                <option value="07">07 - Biskra</option><option value="08">08 - Béchar</option>
                <option value="09">09 - Blida</option><option value="10">10 - Bouira</option>
                <option value="11">11 - Tamanrasset</option><option value="12">12 - Tébessa</option>
                <option value="13">13 - Tlemcen</option><option value="14">14 - Tiaret</option>
                <option value="15">15 - Tizi Ouzou</option><option value="16">16 - Alger</option>
                <option value="17">17 - Djelfa</option><option value="18">18 - Jijel</option>
                <option value="19">19 - Sétif</option><option value="20">20 - Saïda</option>
                <option value="21">21 - Skikda</option><option value="22">22 - Sidi Bel Abbès</option>
                <option value="23">23 - Annaba</option><option value="24">24 - Guelma</option>
                <option value="25">25 - Constantine</option><option value="26">26 - Médéa</option>
                <option value="27">27 - Mostaganem</option><option value="28">28 - M'Sila</option>
                <option value="29">29 - Mascara</option><option value="30">30 - Ouargla</option>
                <option value="31">31 - Oran</option><option value="32">32 - El Bayadh</option>
                <option value="33">33 - Illizi</option><option value="34">34 - Bordj Bou Arreridj</option>
                <option value="35">35 - Boumerdès</option><option value="36">36 - El Tarf</option>
                <option value="37">37 - Tindouf</option><option value="38">38 - Tissemsilt</option>
                <option value="39">39 - El Oued</option><option value="40">40 - Khenchela</option>
                <option value="41">41 - Souk Ahras</option><option value="42">42 - Tipaza</option>
                <option value="43">43 - Mila</option><option value="44">44 - Aïn Defla</option>
                <option value="45">45 - Naâma</option><option value="46">46 - Aïn Témouchent</option>
                <option value="47">47 - Ghardaïa</option><option value="48">48 - Relizane</option>
                <option value="49">49 - Timimoun</option><option value="50">50 - Bordj Badji Mokhtar</option>
                <option value="51">51 - Ouled Djellal</option><option value="52">52 - Béni Abbès</option>
                <option value="53">53 - In Salah</option><option value="54">54 - In Guezzam</option>
                <option value="55">55 - Touggourt</option><option value="56">56 - Djanet</option>
                <option value="57">57 - El M'Ghair</option><option value="58">58 - El Meniaa</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('daycare.monthlyFee')}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="form-input" type="number" name="monthlyFeeMin" placeholder="e.g. 3000" value={form.monthlyFeeMin} onChange={handleChange} />
                <input className="form-input" type="number" name="monthlyFeeMax" placeholder="e.g. 5000" value={form.monthlyFeeMax} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('daycare.totalCapacity')}</label>
              <input className="form-input" type="text" name="totalCapacity" placeholder={t('daycare.capacityPlaceholder')} value={form.totalCapacity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('daycare.ageRange')}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="form-input" type="text" name="ageFrom" placeholder={t('daycare.ageFromPlaceholder')} value={form.ageFrom} onChange={handleChange} />
                <input className="form-input" type="text" name="ageTo"   placeholder={t('daycare.ageToPlaceholder')}   value={form.ageTo}   onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label services-title">{t('daycare.activitiesOffered')}</label>
              <div className="activities-box">
                {[['educationLevels', t('daycare.educationLevels')], ['languageLearning', t('daycare.languageLearning')], ['events', t('daycare.events')], ['plays', t('daycare.plays')]].map(([name, label]) => (
                  <div className="checkbox-row" key={name}>
                    <input type="checkbox" id={name} name={name} checked={form[name]} onChange={handleChange} />
                    <label htmlFor={name} className="checkbox-label">{label}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <div className="time-group">
                <div className="form-group">
                  <label className="form-label">{t('daycare.opensAt')}</label>
                  <input className="form-input" type="time" name="opensAt" value={form.opensAt} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('daycare.closesAt')}</label>
                  <input className="form-input" type="time" name="closesAt" value={form.closesAt} onChange={handleChange} />
                </div>
              </div>
              <div className="time-group" style={{ marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label">{t('daycare.dayFrom')}</label>
                  <select className="form-select" name="dayStart" value={form.dayStart} onChange={handleChange}>
                    <option value="">--</option>
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('daycare.dayTo')}</label>
                  <select className="form-select" name="dayEnd" value={form.dayEnd} onChange={handleChange}>
                    <option value="">--</option>
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row services-row">
            <div className="form-group">
              <label className="form-label services-title">{t('daycare.services')}</label>
              {[['transport', t('daycare.transport')], ['healthcare', t('daycare.healthcare')]].map(([name, label]) => (
                <div className="toggle-row" key={name}>
                  <span className="toggle-label">{label}</span>
                  <div className={`toggle ${form[name] ? 'active' : ''}`} onClick={() => handleToggle(name)}>
                    <div className="toggle-thumb" />
                  </div>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label services-title">{t('daycare.foodServices')}</label>
              {[['lunch', t('daycare.lunch')], ['snacks', t('daycare.snacks')]].map(([name, label]) => (
                <div className="checkbox-row" key={name}>
                  <input type="checkbox" id={name} name={name} checked={form[name]} onChange={handleChange} />
                  <label htmlFor={name} className="checkbox-label">{label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('daycare.description')}</label>
            <textarea className="form-textarea" name="description" placeholder={t('daycare.descriptionPlaceholder')} value={form.description} onChange={handleChange} />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="daycare-right">
          <label className="form-label">
            {t('daycare.jobCertification')} <span style={{ color: '#e8a0a0' }}>*</span>
          </label>
          <div className="upload-area" onClick={() => certInputRef.current.click()}
            onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) setForm((prev) => ({ ...prev, certification: file })); }}
            onDragOver={(e) => e.preventDefault()}>
            <div className="upload-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E8A0A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="12" x2="12" y2="18" /><line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <p className="upload-title">{t('daycare.jobCertificationUploadTitle')}</p>
            <p className="upload-sub">{t('daycare.jobCertificationUploadSub')}</p>
            <p className="upload-limit">{t('daycare.jobCertificationUploadLimit')}</p>
            <input ref={certInputRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleCertification} />
          </div>

          {form.certification && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#fdf4f4', border: '1px solid #f0d8d8', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#666', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.certification.name}</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '16px' }}
                onClick={(e) => { e.stopPropagation(); setForm((prev) => ({ ...prev, certification: null })); }}>×</button>
            </div>
          )}

          <div style={{ height: '24px' }} />

          <label className="form-label">{t('daycare.gallery')}</label>
          <div className="upload-area" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => photoInputRef.current.click()}>
            <div className="upload-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E8A0A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="upload-title">{t('daycare.uploadTitle')}</p>
            <p className="upload-sub">{t('daycare.uploadSub')}</p>
            <p className="upload-limit">{t('daycare.uploadLimit')}</p>
            <input ref={photoInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotos} />
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

        {/* Actions */}
        <div className="daycare-actions">
          <button className="btn-back-step" onClick={() => navigate(-1)}>
            {t('daycare.backStep')}
          </button>
          <button className="btn-primary btn-save" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : `${t('daycare.saveBtn')} →`}
          </button>
        </div>

      </div>

      <p className="help-text">
        {t('daycare.needHelp')} <a href="#!" className="help-link">{t('daycare.contactSupport')}</a>
      </p>
    </div>
  );
};

export default DaycareProfile;