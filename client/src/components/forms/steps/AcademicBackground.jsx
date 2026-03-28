import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const AcademicBackground = ({ data = [], updateData }) => {
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedList = [...data];
    updatedList[index] = { ...updatedList[index], [name]: value };
    updateData('academicBackground', updatedList);
  };

  const addDegree = () => {
    updateData('academicBackground', [...data, { degree: '', institution: '', field: '', year: '', cgpa: '' }]);
  };

  const removeDegree = (index) => {
    const updatedList = data.filter((_, i) => i !== index);
    updateData('academicBackground', updatedList);
  };

  return (
    <div className="section-form">
      {data.map((item, index) => (
        <div key={index} className="card mb-20" style={{ backgroundColor: '#f9fafb', border: '1px solid #eee' }}>
          <div className="flex justify-between items-center mb-10">
            <h4 style={{ fontSize: '1rem' }}>Degree #{index + 1}</h4>
            {data.length > 1 && (
              <button onClick={() => removeDegree(index)} style={{ color: 'var(--danger)', background: 'none' }}>
                <Trash2 size={18} />
              </button>
            )}
          </div>
          <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="block mb-10 font-600">Degree Title</label>
              <input 
                type="text" 
                name="degree"
                value={item.degree} 
                onChange={(e) => handleChange(index, e)}
                placeholder="e.g. BS Computer Science" 
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Institution</label>
              <input 
                type="text" 
                name="institution"
                value={item.institution} 
                onChange={(e) => handleChange(index, e)}
                placeholder="University name" 
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Field of Study</label>
              <input 
                type="text" 
                name="field"
                value={item.field} 
                onChange={(e) => handleChange(index, e)}
                placeholder="e.g. AI, Software Engineering" 
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">Year of Completion</label>
              <input 
                type="text" 
                name="year"
                value={item.year} 
                onChange={(e) => handleChange(index, e)}
                placeholder="YYYY" 
              />
            </div>
            <div className="form-group">
              <label className="block mb-10 font-600">CGPA / Percentage</label>
              <input 
                type="text" 
                name="cgpa"
                value={item.cgpa} 
                onChange={(e) => handleChange(index, e)}
                placeholder="e.g. 3.8/4.0" 
              />
            </div>
          </div>
        </div>
      ))}
      
      <button 
        onClick={addDegree} 
        className="btn flex items-center gap-10" 
        style={{ border: '1px dashed var(--primary-red)', color: 'var(--primary-red)', padding: '10px 20px', backgroundColor: 'transparent' }}
      >
        <Plus size={18} /> Add More Education
      </button>
    </div>
  );
};

export default AcademicBackground;
