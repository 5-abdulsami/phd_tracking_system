import React from 'react';

const EnglishProficiency = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('englishProficiency', { ...data, [name]: value });
  };

  return (
    <div className="section-form">
      <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="block mb-10 font-600">English Test Type</label>
          <select name="testType" value={data?.testType || ''} onChange={handleChange}>
            <option value="">Select Test Type</option>
            <option value="IELTS">IELTS</option>
            <option value="TOEFL">TOEFL</option>
            <option value="PTE">PTE</option>
            <option value="Not Yet Taken">Not Yet Taken</option>
          </select>
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Overall Score / Band</label>
          <input 
            type="text" 
            name="score"
            value={data?.score || ''} 
            onChange={handleChange}
            placeholder="e.g. 7.5" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Date of Test</label>
          <input 
            type="date" 
            name="dateOfTest"
            value={data?.dateOfTest ? new Date(data.dateOfTest).toISOString().split('T')[0] : ''} 
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EnglishProficiency;
