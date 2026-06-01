import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdOutlineEmail,
  MdOutlineSupportAgent,
  MdOutlineQuestionAnswer,
  MdOutlineCheckCircle,
  MdArrowBack,
} from 'react-icons/md';
import { sendSupportMessage, getUser } from '../api/auth';
import './Helpcenter.css';

const FAQ_ITEMS = [
  {
    q: 'How do I enroll my child in a daycare?',
    a: 'Go to the dashboard, find a daycare you like, click "View Details", then click "Enroll". Choose your child and submit the request. The daycare will review and respond.',
  },
  {
    q: 'How do I save a daycare to my favorites?',
    a: 'Click the heart icon on any daycare card. You can view all saved daycares in the "My Favorites" section from your profile.',
  },
  {
    q: 'Can I cancel an enrollment request?',
    a: 'Yes. Go to "My Enrollment Requests", find the pending request, and click "Cancel". You can only cancel requests that are still pending.',
  },
  {
    q: "How do I update my child's information?",
    a: 'Go to "My Children" in your profile. Click "Edit" on the child you want to update, make your changes, and save.',
  },
  {
    q: 'How does the rating system work?',
    a: 'After your child is enrolled, you can leave a review with a 1–5 star rating and a comment. Each parent can only leave one review per daycare.',
  },
  {
    q: 'I forgot my password. What do I do?',
    a: "On the login page, click \"Forgot Password\". Enter your email and we'll send you a reset link.",
  },
];

const HelpCenter = () => {
   useTranslation();
  const navigate = useNavigate();
  const currentUser = getUser();

  const [activeTab, setActiveTab] = useState('faq');
  const [openFaq,   setOpenFaq]   = useState(null);
  const [subject,   setSubject]   = useState('');
  const [message,   setMessage]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendSupportMessage(subject.trim(), message.trim());
      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hc-page">

      {/* ── HERO ── */}
      <div className="hc-hero">
        <button className="hc-back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size={18} /> Back
        </button>
        <div className="hc-hero-icon">
          <MdOutlineSupportAgent size={40} />
        </div>
        <h1 className="hc-hero-title">How can we help you?</h1>
        <p className="hc-hero-sub">
          Find answers to common questions or send us a message — we're here for you.
        </p>

        <div className="hc-tabs">
          <button
            className={`hc-tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <MdOutlineQuestionAnswer size={18} /> FAQ
          </button>
          <button
            className={`hc-tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <MdOutlineEmail size={18} /> Contact Support
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="hc-body">

        {activeTab === 'faq' && (
          <div className="hc-faq">
            <h2 className="hc-section-title">Frequently Asked Questions</h2>
            <div className="hc-faq-list">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`hc-faq-item ${openFaq === i ? 'open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="hc-faq-question">
                    <span>{item.q}</span>
                    <span className="hc-faq-chevron">{openFaq === i ? '−' : '+'}</span>
                  </div>
                  {openFaq === i && (
                    <div className="hc-faq-answer">{item.a}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="hc-faq-cta">
              <p>Still have questions?</p>
              <button className="hc-cta-btn" onClick={() => setActiveTab('contact')}>
                <MdOutlineEmail size={17} /> Contact Support
              </button>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="hc-contact">
            <h2 className="hc-section-title">Send Us a Message</h2>
            <p className="hc-contact-sub">
              Our support team usually responds within 24 hours.
            </p>

            {success ? (
              <div className="hc-success">
                <MdOutlineCheckCircle size={52} />
                <h3>Message Sent!</h3>
                <p>Thank you, {currentUser?.name || 'there'}. We'll get back to you soon.</p>
                <button className="hc-cta-btn" onClick={() => setSuccess(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="hc-form" onSubmit={handleSubmit}>
                <div className="hc-form-group">
                  <label className="hc-label">Subject</label>
                  <input
                    className="hc-input"
                    type="text"
                    placeholder="e.g. Problem with enrollment request"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="hc-form-group">
                  <label className="hc-label">Message</label>
                  <textarea
                    className="hc-textarea"
                    placeholder="Describe your issue or question in detail..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                {error && <p className="hc-error">⚠️ {error}</p>}
                <button className="hc-submit-btn" type="submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;