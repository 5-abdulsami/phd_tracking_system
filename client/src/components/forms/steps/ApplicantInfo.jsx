import React from 'react';

const ApplicantInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('applicantInfo', { ...data, [name]: value });
  };

  return (
    <div className="section-form">
      <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="block mb-10 font-600">First Name</label>
          <input 
            type="text" 
            name="firstName"
            value={data?.firstName || ''} 
            onChange={handleChange}
            placeholder="Enter first name" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Last Name</label>
          <input 
            type="text" 
            name="lastName"
            value={data?.lastName || ''} 
            onChange={handleChange}
            placeholder="Enter last name" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Date of Birth</label>
          <input 
            type="date" 
            name="dob"
            value={data?.dob ? new Date(data.dob).toISOString().split('T')[0] : ''} 
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Gender</label>
          <select name="gender" value={data?.gender || ''} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Nationality</label>
          <input 
            type="text" 
            name="nationality"
            value={data?.nationality || ''} 
            onChange={handleChange}
            placeholder="Enter nationality" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">CNIC / Passport Number</label>
          <input 
            type="text" 
            name="cnic"
            value={data?.cnic || ''} 
            onChange={handleChange}
            placeholder="Enter CNIC or Passport" 
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicantInfo;
