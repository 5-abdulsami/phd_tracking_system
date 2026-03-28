import React from 'react';

const Declaration = ({ data = {}, updateData, canSubmit, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateData('declaration', { ...data, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="section-form">
      <div className="card mb-20" style={{ padding: '30px', backgroundColor: '#f9fafb', border: '1px solid #eee' }}>
        <h3 style={{ marginBottom: '15px' }}>Declaration</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.8' }}>
          I hereby declare that the information provided in this application is true and correct to the best of my knowledge and belief. 
          In case any information is found to be false or untrue or misleading or misrepresenting, I am aware that I may be held 
          liable for it and my application/admission may be cancelled. I also understand that the decision of the admissions 
          committee at Spectrum Consultants and its partner universities is final.
        </p>

        <div className="form-group flex items-center gap-10 mb-20">
          <input 
            type="checkbox" 
            name="isAgreed"
            id="isAgreed"
            checked={data?.isAgreed || false} 
            onChange={handleChange}
            style={{ width: '20px', height: '20px' }}
          />
          <label htmlFor="isAgreed" style={{ fontWeight: 600, cursor: 'pointer' }}>
            I agree to the terms and declaration above.
          </label>
        </div>

        <div className="form-group">
          <label className="block mb-10 font-600">Full Signature (Type your name)</label>
          <input 
            type="text" 
            name="signature"
            value={data?.signature || ''} 
            onChange={handleChange}
            placeholder="Type your full name as signature" 
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button 
          onClick={onSubmit}
          disabled={!data?.isAgreed || !data?.signature || !canSubmit}
          className="btn btn-primary"
          style={{ 
            padding: '15px 50px', fontSize: '1.1rem', 
            opacity: (!data?.isAgreed || !data?.signature || !canSubmit) ? 0.5 : 1 
          }}
        >
          Submit Final Application
        </button>
        {!canSubmit && (
           <p style={{ color: 'var(--primary-red)', marginTop: '10px', fontSize: '0.85rem' }}>
             Please complete at least 90% of the application to submit.
           </p>
        )}
      </div>
    </div>
  );
};

export default Declaration;
