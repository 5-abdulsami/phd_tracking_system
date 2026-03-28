import React from 'react';

const GuardianInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('guardianInfo', { ...data, [name]: value });
  };

  return (
    <div className="section-form">
      <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="block mb-10 font-600">Father's Full Name</label>
          <input 
            type="text" 
            name="fatherName"
            value={data?.fatherName || ''} 
            onChange={handleChange}
            placeholder="Enter father's name" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Mother's Full Name</label>
          <input 
            type="text" 
            name="motherName"
            value={data?.motherName || ''} 
            onChange={handleChange}
            placeholder="Enter mother's name" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Guardian Contact Number</label>
          <input 
            type="text" 
            name="guardianPhone"
            value={data?.guardianPhone || ''} 
            onChange={handleChange}
            placeholder="Enter guardian phone" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Guardian Email Address</label>
          <input 
            type="email" 
            name="guardianEmail"
            value={data?.guardianEmail || ''} 
            onChange={handleChange}
            placeholder="Enter guardian email" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Occupation</label>
          <input 
            type="text" 
            name="occupation"
            value={data?.occupation || ''} 
            onChange={handleChange}
            placeholder="Enter guardian occupation" 
          />
        </div>
      </div>
    </div>
  );
};

export default GuardianInfo;
