import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { 
  Search, Globe, Plus, 
  ChevronDown, ChevronUp, Edit2, 
  Trash2, MessageCircle, User 
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import RemarksSection from '../components/RemarksSection';
import { useAuth } from '../contexts/AuthContext';

const AdminUniversityApps = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [universityApps, setUniversityApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const { user: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    universityName: '',
    programName: '',
    status: 'Pending',
    appliedDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('/api/applications');
      // Filter students who have submitted their profile
      const submittedStudents = data.filter(app => app.user != null);
      setStudents(submittedStudents);
    } catch (err) {
      console.error('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversityApps = async (studentId) => {
    try {
      const { data } = await axios.get(`/api/university-applications/student/${studentId}`);
      setUniversityApps(data);
    } catch (err) {
      console.error('Error fetching university apps');
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchUniversityApps(student.user._id);
    setIsAdding(false);
    setExpandedId(null);
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
        await axios.post('/api/university-applications', { ...formData, student: selectedStudent.user._id });
      }
      setIsAdding(false);
      setFormData({ universityName: '', programName: '', status: 'Pending', appliedDate: '', notes: '' });
      fetchUniversityApps(selectedStudent.user._id);
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`/api/university-applications/${id}`);
        fetchUniversityApps(selectedStudent.user._id);
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.applicantInfo?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.applicantInfo?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-university-apps flex gap-20">
        {/* Left Panel: Students List */}
        <div className="students-sidebar card" style={{ width: '300px', padding: '0', height: 'fit-content' }}>
          <div className="p-15 border-bottom">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Select Student</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '35px', fontSize: '0.85rem' }}
              />
            </div>
          </div>
          <div className="students-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredStudents.map(student => (
              <div 
                key={student._id}
                onClick={() => handleStudentSelect(student)}
                style={{ 
                  padding: '12px 20px', 
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: selectedStudent?._id === student._id ? '#eff6ff' : 'transparent',
                  borderLeft: selectedStudent?._id === student._id ? '4px solid var(--primary-red)' : '4px solid transparent'
                }}
                className="hover-bg-light"
              >
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{student.applicantInfo?.firstName} {student.applicantInfo?.lastName}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>{student.user?.email}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Applications Management */}
        <div className="main-management flex-1">
          {selectedStudent ? (
            <div className="student-apps-content">
              <div className="flex justify-between items-center mb-15 bg-white p-15 rounded-8 shadow-sm">
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Applications for {selectedStudent.applicantInfo?.firstName}</h2>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>{selectedStudent.user?.email}</p>
                </div>
                {!isAdding && (
                  <button 
                    onClick={() => setIsAdding(true)} 
                    className="btn btn-primary flex items-center gap-5"
                  >
                    <Plus size={18} /> New Application
                  </button>
                )}
              </div>

              {isAdding && (
                <div className="card mb-30 shadow-md" style={{ borderLeft: '4px solid var(--primary-red)' }}>
                  <h3 className="mb-20">{formData._id ? 'Edit Application' : 'Create New Application'}</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-20">
                      <div className="form-group">
                        <label>University/Scholarship Name *</label>
                        <input name="universityName" value={formData.universityName} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label>Program Name</label>
                        <input name="programName" value={formData.programName} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange}>
                          <option value="Pending">Pending</option>
                          <option value="Applied">Applied</option>
                          <option value="Interview">Interview</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Applied Date</label>
                        <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="form-group mt-15">
                      <label>Internal Admin Notes</label>
                      <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3"></textarea>
                    </div>
                    <div className="flex gap-10 mt-20">
                      <button type="submit" className="btn btn-primary">Save Application</button>
                      <button type="button" onClick={() => setIsAdding(false)} className="btn-light">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="apps-list flex flex-col gap-15">
                {universityApps.length === 0 ? (
                  <div className="card text-center p-40" style={{ color: '#999', borderStyle: 'dashed' }}>
                    No applications created yet for this student.
                  </div>
                ) : (
                  universityApps.map(app => (
                    <div key={app._id} className="card p-0 overflow-hidden shadow-sm">
                      <div 
                        className="p-15 flex justify-between items-center cursor-pointer hover-bg-light"
                        onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                      >
                        <div className="flex items-center gap-12">
                          <Globe size={18} color="var(--primary-red)" />
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{app.universityName}</h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>{app.programName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-12">
                          <span style={{ 
                            padding: '3px 10px', borderRadius: '15px', fontSize: '0.7rem', fontWeight: 700,
                            backgroundColor: app.status === 'Accepted' ? '#dcfce7' : '#eff6ff',
                            color: app.status === 'Accepted' ? '#166534' : '#1e40af'
                          }}>{app.status}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(app); }} className="btn-light p-5 rounded hover-text-blue"><Edit2 size={14} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(app._id); }} className="btn-light p-5 rounded hover-text-red"><Trash2 size={14} /></button>
                          {expandedId === app._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      
                      {expandedId === app._id && (
                        <div className="p-20 pt-0 border-top">
                          <div className="mt-15 p-15 bg-light rounded-8 mb-20">
                            <div className="text-sm"><strong>Date:</strong> {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</div>
                            <div className="text-sm mt-5"><strong>Notes:</strong> {app.notes || 'None'}</div>
                          </div>
                          <RemarksSection 
                            universityApplicationId={app._id} 
                            currentUser={currentUser}
                            title={`Chat about ${app.universityName}`}
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-100 card" style={{ height: '400px', color: '#999' }}>
              <User size={48} className="mb-20" opacity={0.2} />
              <h3>Select a student from the left to manage their applications</h3>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUniversityApps;
