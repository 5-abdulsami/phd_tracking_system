import React from 'react';

const ContactDetails = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('contactDetails', { ...data, [name]: value });
  };

  return (
    <div className="section-form">
      <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="block mb-10 font-600">Phone</label>
          <input 
            type="text" 
            name="phone"
            value={data?.phone || ''} 
            onChange={handleChange}
            placeholder="Enter phone number" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Alternate Phone</label>
          <input 
            type="text" 
            name="alternatePhone"
            value={data?.alternatePhone || ''} 
            onChange={handleChange}
            placeholder="Enter alternate phone" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Contact Email</label>
          <input 
            type="email" 
            name="email"
            value={data?.email || ''} 
            onChange={handleChange}
            placeholder="Enter secondary email" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Current Address</label>
          <input 
            type="text" 
            name="address"
            value={data?.address || ''} 
            onChange={handleChange}
            placeholder="Enter home address" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">City</label>
          <input 
            type="text" 
            name="city"
            value={data?.city || ''} 
            onChange={handleChange}
            placeholder="Enter city" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Country</label>
          <input 
            type="text" 
            name="country"
            value={data?.country || ''} 
            onChange={handleChange}
            placeholder="Enter country" 
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
