import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const isSectionComplete = (key, section) => {
  if (!section) return false;

  if (key === 'applicantInfo') {
    return !!(section.firstName && section.lastName && section.dob && section.gender && section.nationality && section.cnic);
  }
  if (key === 'contactDetails') {
    return !!(section.phone && section.email && section.address && section.city && section.country);
  }
  if (key === 'guardianInfo') {
    return !!(section.fatherName && section.motherName && section.guardianPhone && section.guardianEmail && section.occupation);
  }
  if (key === 'academicBackground') {
    return Array.isArray(section) && section.length > 0 && section.every(edu => edu.degree && edu.institution && edu.year && edu.cgpa);
  }
  if (key === 'programInfo') {
    return !!(section.programType && section.proposedField && section.intakeYear);
  }
  if (key === 'researchExperience') {
    return !!(section.workExperience && section.researchStatement);
  }
  if (key === 'englishProficiency') {
    return !!(section.testType && section.score && section.dateOfTest);
  }
  if (key === 'fundingInfo') {
    return !!(section.fundingType && section.details);
  }
  if (key === 'referees') {
    return true; // Optional section
  }
  if (key === 'documents') {
    return !!(section.cv && section.sop && section.transcript && section.passport);
  }
  if (key === 'declaration') {
    return !!(section.isAgreed && section.signature);
  }

  return false;
};

const DashboardPage = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data } = await axios.get('/api/applications/me');
        setApplication(data);
      } catch (err) {
        console.error('Error fetching application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  if (loading) return (
    <div className="container mt-20" style={{ textAlign: 'center', padding: '50px' }}>
       <div className="spinner">Loading...</div>
    </div>
  );

  const getStatusDisplay = (status) => {
    const statusMap = {
      'draft': { label: 'In Progress', color: '#666', icon: <Clock size={20} /> },
      'submitted': { label: 'Submitted', color: '#2563eb', icon: <CheckCircle size={20} /> },
      'under_review': { label: 'Under Review', color: '#d97706', icon: <Clock size={20} /> },
      'shortlisted': { label: 'Shortlisted', color: '#059669', icon: <CheckCircle size={20} /> },
      'accepted': { label: 'Accepted', color: '#10b981', icon: <CheckCircle size={20} /> },
      'rejected': { label: 'Rejected', color: '#dc2626', icon: <AlertCircle size={20} /> }
    };
    return statusMap[status] || { label: status, color: '#666', icon: <Clock size={20} /> };
  };

  const status = getStatusDisplay(application?.status);

  return (
    <div className="dashboard-page container mt-20">
      <div className="welcome-header flex justify-between items-center mb-20" style={{ padding: '0 0 20px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Welcome, {user.email.split('@')[0]}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your PhD application and track your status.</p>
        </div>
        <div className="status-badge flex items-center gap-10" style={{ 
          backgroundColor: '#f3f4f6', padding: '8px 16px', borderRadius: '20px', 
          border: `1px solid ${status.color}`, color: status.color, fontWeight: 600
        }}>
          {status.icon} {status.label}
        </div>
      </div>

      <div className="dashboard-grid flex gap-20 flex-col-mobile">
        <div className="main-content" style={{ flex: 2 }}>
          <div className="card mb-20">
            <h3 style={{ marginBottom: '15px' }}>Application Progress</h3>
            <div className="progress-container" style={{ position: 'relative', marginBottom: '30px' }}>
              <div style={{ backgroundColor: '#e5e7eb', height: '12px', borderRadius: '6px' }}>
                <div style={{ 
                  backgroundColor: 'var(--primary-red)', height: '100%', borderRadius: '6px',
                  width: `${application?.completionPercentage || 0}%`, transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
              <span style={{ position: 'absolute', right: 0, top: '-25px', fontSize: '0.9rem', fontWeight: 700 }}>
                {application?.completionPercentage || 0}% Completed
              </span>
            </div>
            
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              Complete all 11 sections of your application to submit for review.
            </p>

            <button 
              onClick={() => navigate('/application/edit')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 30px' }}
            >
              {application?.completionPercentage === 0 ? 'Start Application' : 'Continue Application'} <ArrowRight size={18} />
            </button>
          </div>

          <div className="dashboard-sections grid gap-20" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div className="card" style={{ display: 'flex', gap: '15px' }}>
              <div style={{ backgroundColor: '#fee2e2', padding: '10px', borderRadius: '8px', color: 'var(--primary-red)' }}>
                <FileText size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '5px' }}>Form Sections</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>11 sections requiring your academic & personal details.</p>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', gap: '15px' }}>
              <div style={{ backgroundColor: '#e0f2fe', padding: '10px', borderRadius: '8px', color: '#0ea5e9' }}>
                <CheckCircle size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '5px' }}>Status Tracker</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time updates as your application moves to review.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar" style={{ flex: 1 }}>
          <div className="card">
            <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Section Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              {[
                { title: 'Applicant Info', key: 'applicantInfo' },
                { title: 'Contact Details', key: 'contactDetails' },
                { title: 'Guardian Info', key: 'guardianInfo' },
                { title: 'Academic Background', key: 'academicBackground' },
                { title: 'Program Info', key: 'programInfo' },
                { title: 'Research Experience', key: 'researchExperience' },
                { title: 'English Proficiency', key: 'englishProficiency' },
                { title: 'Funding Information', key: 'fundingInfo' },
                { title: 'Referee Details', key: 'referees' },
                { title: 'Document Uploads', key: 'documents' },
                { title: 'Final Declaration', key: 'declaration' }
              ].map((s, idx) => {
                const isDone = isSectionComplete(s.key, application?.[s.key]);
                return (
                  <div key={idx} className="flex justify-between items-center" style={{ 
                    padding: '10px 15px', borderRadius: '6px', backgroundColor: isDone ? '#f0fdf4' : '#f9fafb',
                    border: '1px solid', borderColor: isDone ? '#bcf0da' : '#eee'
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: isDone ? '#166534' : '#666' }}>{s.title}</span>
                    {isDone ? (
                      <CheckCircle size={16} color="#22c55e" />
                    ) : (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #e5e7eb' }}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
