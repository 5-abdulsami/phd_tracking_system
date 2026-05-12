import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { 
  Plus, Trash2, Edit2, Check, X, 
  ChevronDown, ChevronUp, Globe, 
  Calendar, MessageCircle
} from 'lucide-react';
import RemarksSection from './RemarksSection';

const UniversityApplicationsManager = ({ studentId, currentUser, isAdmin }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({
    universityName: '',
    programName: '',
    status: 'Pending',
    appliedDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchApplications();
  }, [studentId]);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`/api/university-applications/student/${studentId}`);
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch university applications');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`/api/university-applications/${formData._id}`, formData);
      } else {
        await axios.post('/api/university-applications', { ...formData, student: studentId });
      }
      setIsAdding(false);
      setFormData({
        universityName: '',
        programName: '',
        status: 'Pending',
        appliedDate: '',
        notes: ''
      });
      fetchApplications();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleEdit = (app) => {
    setFormData({
      ...app,
      appliedDate: app.appliedDate ? app.appliedDate.split('T')[0] : ''
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`/api/university-applications/${id}`);
        fetchApplications();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    <div className="university-applications-manager mt-30">
      <div className="flex justify-between items-center mb-20">
        <h2 className="flex items-center gap-10" style={{ margin: 0 }}>
          <Globe size={24} color="var(--primary-red)" /> 
          University & Scholarship Applications
        </h2>
        {isAdmin && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="btn btn-primary flex items-center gap-5"
          >
            <Plus size={18} /> Add New Application
          </button>
        )}
      </div>

      {isAdding && (
        <div className="card mb-30 shadow-md" style={{ borderLeft: '4px solid var(--primary-red)' }}>
          <div className="flex justify-between items-center mb-20">
            <h3>{formData._id ? 'Edit Application' : 'Add New Application'}</h3>
            <button onClick={() => setIsAdding(false)} className="btn-light p-5 rounded-full"><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label>University/Scholarship Name *</label>
                <input 
                  type="text" 
                  name="universityName" 
                  value={formData.universityName} 
                  onChange={handleInputChange} 
                  required 
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Program Name</label>
                <input 
                  type="text" 
                  name="programName" 
                  value={formData.programName} 
                  onChange={handleInputChange} 
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="form-control">
                  <option value="Pending">Pending</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>
              <div className="form-group">
                <label>Applied Date</label>
                <input 
                  type="date" 
                  name="appliedDate" 
                  value={formData.appliedDate} 
                  onChange={handleInputChange} 
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group mt-15">
              <label>Internal Notes (Admin Only)</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                className="form-control"
                rows="3"
              ></textarea>
            </div>
            <div className="flex gap-10 mt-20">
              <button type="submit" className="btn btn-primary">{formData._id ? 'Update' : 'Save'} Application</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-light">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="applications-list flex flex-col gap-15">
        {applications.length === 0 ? (
          <div className="card text-center p-40" style={{ color: '#999', borderStyle: 'dashed' }}>
            No university applications recorded yet.
          </div>
        ) : (
          applications.map((app) => (
            <div key={app._id} className={`card shadow-sm transition-all ${expandedId === app._id ? 'border-primary' : ''}`} style={{ padding: '0', overflow: 'hidden' }}>
              <div 
                className="flex justify-between items-center p-20 cursor-pointer hover-bg-light"
                onClick={() => toggleExpand(app._id)}
              >
                <div className="flex gap-15 items-center">
                  <div style={{ 
                    width: '45px', height: '45px', borderRadius: '10px', 
                    backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary-red)'
                  }}>
                    <Globe size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{app.universityName}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{app.programName || 'Program not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-20">
                  <span style={{
                    padding: '5px 12px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 600,
                    backgroundColor: app.status === 'Accepted' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#eff6ff',
                    color: app.status === 'Accepted' ? '#166534' : app.status === 'Rejected' ? '#991b1b' : '#1e40af'
                  }}>
                    {app.status}
                  </span>
                  <div className="flex gap-10" onClick={(e) => e.stopPropagation()}>
                    {isAdmin && (
                      <>
                        <button onClick={() => handleEdit(app)} className="btn-light p-5 rounded hover-text-blue"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(app._id)} className="btn-light p-5 rounded hover-text-red"><Trash2 size={16} /></button>
                      </>
                    )}
                    {expandedId === app._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {expandedId === app._id && (
                <div className="p-20 pt-0" style={{ borderTop: '1px solid #f3f4f6' }}>
                  <div className="mt-20 p-15 bg-light rounded-8">
                    <h5 className="mb-10 flex items-center gap-5"><Calendar size={14} /> Application Details</h5>
                    <div className="flex flex-col gap-8 text-sm">
                      <div><strong>Applied Date:</strong> {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</div>
                      <div><strong>Status:</strong> {app.status}</div>
                      {isAdmin && app.notes && (
                        <div className="mt-10 pt-10" style={{ borderTop: '1px solid #ddd' }}>
                          <strong>Admin Notes:</strong>
                          <p style={{ margin: '5px 0 0 0', fontStyle: 'italic' }}>{app.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-20">
                    <h5 className="mb-10 flex items-center gap-5"><MessageCircle size={14} /> Application-Specific Remarks</h5>
                    <RemarksSection 
                      universityApplicationId={app._id} 
                      currentUser={currentUser} 
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UniversityApplicationsManager;
