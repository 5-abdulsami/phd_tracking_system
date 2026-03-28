import React from 'react';

const ProgramInfo = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('programInfo', { ...data, [name]: value });
  };

  return (
    <div className="section-form">
      <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="block mb-10 font-600">Program Type</label>
          <select name="programType" value={data?.programType || ''} onChange={handleChange}>
            <option value="">Select Program</option>
            <option value="PhD">PhD</option>
            <option value="Postdoctoral">Postdoctoral</option>
          </select>
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Proposed Field of Research</label>
          <input 
            type="text" 
            name="proposedField"
            value={data?.proposedField || ''} 
            onChange={handleChange}
            placeholder="e.g. Artificial Intelligence" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Preferred Supervisor (Optional)</label>
          <input 
            type="text" 
            name="supervisorName"
            value={data?.supervisorName || ''} 
            onChange={handleChange}
            placeholder="Name of supervisor" 
          />
        </div>
        <div className="form-group">
          <label className="block mb-10 font-600">Intended Intake Year</label>
          <select name="intakeYear" value={data?.intakeYear || ''} onChange={handleChange}>
            <option value="">Select Year</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProgramInfo;
