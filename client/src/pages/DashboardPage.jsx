import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, CheckCircle, Clock, AlertCircle, ArrowRight, MessageSquare, Award, Filter, RefreshCw, Send } from 'lucide-react';
import RemarksSection from '../components/RemarksSection';
import UniversityApplicationsManager from '../components/UniversityApplicationsManager';

const isSectionComplete = (key, section) => {
  if (!section) return false;

  if (key === 'applicantInfo') {
    return !!(section.firstName && section.lastName && section.dob && section.gender && section.nationality);
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
    const hasPublications = Array.isArray(section.publications) && section.publications.length > 0 && section.publications.every(p => p.title && p.journalType);
    return !!(section.workExperience && hasPublications);
  }
  if (key === 'englishProficiency') {
    if (section.testType === 'Not Yet Taken') return true;
    return !!(section.testType && section.score && section.dateOfTest && section.expiryDate);
  }
  if (key === 'fundingInfo') {
    return !!(section.fundingType && section.details);
  }
  if (key === 'referees') {
    return true; // Optional section
  }
  if (key === 'documents') {
    return !!(section.cv);
  }
  if (key === 'declaration') {
    return !!(section.isAgreed && section.signature);
  }

  return false;
};

const DashboardPage = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState([]);
  const [appliedScholarships, setAppliedScholarships] = useState(new Set());
  const [scholarshipsLoading, setScholarshipsLoading] = useState(true);
  const [appsTrigger, setAppsTrigger] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filters state for scholarships
  const [filters, setFilters] = useState({
    country: '',
    degreeLevels: 'all',
    studyArea: ''
  });

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

  useEffect(() => {
    if (user?._id) {
      fetchScholarshipsAndApps();
    }
  }, [user?._id, appsTrigger]);

  const fetchScholarshipsAndApps = async (currentFilters = filters) => {
    try {
      setScholarshipsLoading(true);
      
      // Build query string
      const params = new URLSearchParams();
      if (currentFilters.country) params.append('country', currentFilters.country);
      if (currentFilters.studyArea) params.append('studyArea', currentFilters.studyArea);
      if (currentFilters.degreeLevels && currentFilters.degreeLevels !== 'all') {
        params.append('degreeLevels', currentFilters.degreeLevels);
      }

      // Fetch matching scholarships
      const { data: scholData } = await axios.get(`/api/scholarships?${params.toString()}`);
      setScholarships(scholData);

      // Fetch existing applications to check duplicates
      const { data: appsData } = await axios.get(`/api/university-applications/student/${user._id}`);
      const appliedSet = new Set(appsData.map(app => `${app.universityName.trim()}||${app.programName.trim()}`));
      setAppliedScholarships(appliedSet);
    } catch (err) {
      console.error('Error fetching scholarships/applications:', err);
    } finally {
      setScholarshipsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchScholarshipsAndApps(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      country: '',
      degreeLevels: 'all',
      studyArea: ''
    };
    setFilters(defaultFilters);
    fetchScholarshipsAndApps(defaultFilters);
  };

  const handleApplyToScholarship = async (scholarship) => {
    if (!window.confirm(`Are you sure you want to apply to: ${scholarship.title}?`)) {
      return;
    }

    try {
      const payload = {
        student: user._id,
        universityName: scholarship.university,
        programName: scholarship.title,
        status: 'Pending',
        appliedDate: new Date(),
        notes: `Applied online through Browse Scholarships panel. Study Area: ${scholarship.studyArea}.`
      };

      await axios.post('/api/university-applications', payload);
      alert('Application submitted successfully! It is now listed under your applications below for review.');
      
      // Update local trigger to sync everything
      setAppsTrigger(prev => prev + 1);
    } catch (err) {
      alert('Failed to submit application. Try again.');
    }
  };

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

  const getStrengthColor = (percent) => {
    if (percent >= 80) return '#10b981';
    if (percent >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard-page container mt-20">
      <div className="welcome-header flex justify-between items-center mb-20" style={{ padding: '0 0 20px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Welcome, {application?.applicantInfo?.firstName ? `${application.applicantInfo.firstName} ${application.applicantInfo.lastName}` : user.email.split('@')[0]}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your PhD profile and track your status.</p>
        </div>
        <div className="status-badge flex items-center gap-10" style={{
          backgroundColor: '#f3f4f6', padding: '8px 16px', borderRadius: '20px',
          border: `1px solid ${status.color}`, color: status.color, fontWeight: 600
        }}>
          {status.icon} {status.label}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-content">
          <div className="card mb-20">
            <h3 style={{ marginBottom: '15px' }}>Profile Progress</h3>
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
              Complete all mandatory sections to submit your PhD profile.
            </p>

            <button
              onClick={() => navigate('/application/edit')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 30px' }}
            >
              {application?.completionPercentage === 0 ? 'Start Profile' : 'View Profile'} <ArrowRight size={18} />
            </button>
          </div>

          <div className="dashboard-sections mb-30">
            <div className="card" style={{ display: 'flex', gap: '15px', borderLeft: `5px solid ${getStrengthColor(application?.profileStrength || 0)}` }}>
              <div style={{ backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', color: getStrengthColor(application?.profileStrength || 0) }}>
                <CheckCircle size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '5px' }}>Profile Strength</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px' }}>
                    <div style={{
                      backgroundColor: getStrengthColor(application?.profileStrength || 0),
                      width: `${application?.profileStrength || 0}%`,
                      height: '100%', borderRadius: '4px'
                    }}></div>
                  </div>
                  <span style={{ fontWeight: 700, minWidth: '40px' }}>{application?.profileStrength || 0}%</span>
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '5px', color: 'var(--text-muted)' }}>Based on CGPA, Publications, Age, and English Proficiency.</p>
              </div>
            </div>
          </div>

          {/* New Section: Available Scholarships Filtering & Applying */}
          <div className="card mb-30 shadow-sm" style={{ borderLeft: '4px solid var(--primary-red)' }}>
            <div className="flex justify-between items-center mb-20">
              <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--primary-red)" />
                Browse & Apply for Scholarships
              </h3>
            </div>

            {/* Filter toolbar */}
            <form onSubmit={applyFilters} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <input
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                placeholder="Filter by Country"
                style={{ flex: 1, minWidth: '120px', height: '36px', fontSize: '0.85rem' }}
              />
              <select
                name="degreeLevels"
                value={filters.degreeLevels}
                onChange={handleFilterChange}
                style={{ flex: 1, minWidth: '120px', height: '36px', fontSize: '0.85rem', padding: '0 8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="all">Degree Level (All)</option>
                <option value="PhD">PhD</option>
                <option value="Postdoctoral">Postdoctoral</option>
                <option value="Masters">Masters</option>
              </select>
              <input
                name="studyArea"
                value={filters.studyArea}
                onChange={handleFilterChange}
                placeholder="Filter by Study Area"
                style={{ flex: 1, minWidth: '120px', height: '36px', fontSize: '0.85rem' }}
              />
              <div style={{ display: 'flex', gap: '5px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0 15px', height: '36px', fontSize: '0.85rem' }}>Search</button>
                <button type="button" onClick={resetFilters} className="btn-light" style={{ padding: '0 15px', height: '36px', fontSize: '0.85rem', border: '1px solid #ddd' }}>Reset</button>
              </div>
            </form>

            {/* Scholarship Matching Cards */}
            {scholarshipsLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Matching scholarships...</div>
            ) : scholarships.length === 0 ? (
              <div style={{ padding: '25px', textAlign: 'center', color: '#999', border: '1px dashed #ddd', borderRadius: '8px' }}>
                No active scholarships match your search criteria.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                {scholarships.map(scholarship => {
                  const alreadyApplied = appliedScholarships.has(`${scholarship.university.trim()}||${scholarship.title.trim()}`);
                  return (
                    <div key={scholarship._id} style={{ display: 'flex', gap: '12px', border: '1px solid #e5e7eb', padding: '15px', borderRadius: '8px', backgroundColor: 'white' }}>
                      {scholarship.thumbnail ? (
                        <img src={scholarship.thumbnail} alt={scholarship.title} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-red)' }}>
                          <Award size={24} />
                        </div>
                      )}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>{scholarship.title}</h4>
                          <p style={{ margin: '2px 0 6px 0', fontSize: '0.8rem', color: '#666' }}>{scholarship.university} ({scholarship.country})</p>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: '#eff6ff', color: '#1e40af', borderRadius: '3px', fontWeight: 600 }}>{scholarship.studyArea}</span>
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '3px', fontWeight: 600 }}>{scholarship.fundedBy} Funded</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', borderTop: '1px solid #f3f4f6', paddingTop: '8px' }}>
                          <span style={{ fontSize: '0.7rem', color: '#dc2626' }}>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                          <button
                            onClick={() => handleApplyToScholarship(scholarship)}
                            disabled={alreadyApplied}
                            className={alreadyApplied ? 'btn-light btn-sm' : 'btn btn-primary btn-sm'}
                            style={{ padding: '4px 10px', fontSize: '0.75rem', height: '26px' }}
                          >
                            {alreadyApplied ? 'Applied' : 'Apply'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* University Applications for Student */}
          {user?._id && (
            <UniversityApplicationsManager
              studentId={user._id}
              currentUser={user}
              isAdmin={false}
              key={appsTrigger}
            />
          )}

          {/* Remarks Section for Student */}
          <div className="mt-40" style={{ marginBottom: '40px' }}>
            <RemarksSection
              applicationId={application?._id}
              currentUser={user}
              title="Profile Feedback & General Remarks"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
