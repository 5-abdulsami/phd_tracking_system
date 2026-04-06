import React from 'react';

const ResearchExperience = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('researchExperience', { ...data, [name]: value });
  };

  return (
    <div className="section-form">
      <div className="form-group mb-20">
        <label className="block mb-10 font-600">Research Statement / Interest Summary <span style={{ color: 'red' }}>*</span></label>
        <textarea 
          name="researchStatement"
          value={data?.researchStatement || ''} 
          onChange={handleChange}
          placeholder="Briefly describe your research goals (max 500 words)" 
          rows="6"
          style={{ borderColor: !data?.researchStatement ? 'var(--primary-red)' : '' }}
        />
      </div>
      <div className="form-group mb-20">
        <label className="block mb-10 font-600">Relevant Work Experience <span style={{ color: 'red' }}>*</span></label>
        <textarea 
          name="workExperience"
          value={data?.workExperience || ''} 
          onChange={handleChange}
          placeholder="List any professional roles relevant to your program (max 500 words)" 
          rows="4"
          style={{ borderColor: !data?.workExperience ? 'var(--primary-red)' : '' }}
        />
      </div>
      <div className="form-group">
        <label className="block mb-10 font-600">Previous Publications (Optional)</label>
        <textarea 
          name="publications"
          value={(data?.publications || []).join('\n')} 
          onChange={(e) => updateData('researchExperience', { ...data, publications: e.target.value.split('\n') })}
          placeholder="List publication titles, one per line" 
          rows="4"
        />
      </div>
    </div>
  );
};

export default ResearchExperience;
