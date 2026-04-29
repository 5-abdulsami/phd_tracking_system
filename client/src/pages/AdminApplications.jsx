import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get('/api/applications');
      setApplications(data);
      setFilteredApps(data);
    } catch (err) {
      console.error('Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterApps(value, statusFilter);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    filterApps(searchTerm, value);
  };

  const filterApps = (search, status) => {
    let filtered = applications;
    if (search) {
      filtered = filtered.filter(app => 
        app.user?.email.toLowerCase().includes(search) || 
        app.applicantInfo?.firstName.toLowerCase().includes(search) ||
        app.applicantInfo?.lastName.toLowerCase().includes(search)
      );
    }
    if (status !== 'all') {
      filtered = filtered.filter(app => app.status === status);
    }
    setFilteredApps(filtered);
  };

  const updateAppStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/applications/${id}/status`, { status: newStatus });
      // Create notification for student
      await axios.post('/api/notifications', {
        userId: applications.find(a => a._id === id).user._id,
        title: 'Application Status Updated',
        message: `Your PhD application status has been updated to: ${newStatus.replace('_', ' ')}`,
        type: 'status_update'
      });
      fetchApplications(); // Refresh list
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="container mt-20">Loading Applications...</div>;

  return (
    <div className="admin-applications container mt-20">
      <div className="flex justify-between items-center mb-20">
        <h1 style={{ fontSize: '1.8rem' }}>Manage Applications</h1>
        <div className="flex gap-10">
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search applicant..." 
              value={searchTerm} 
              onChange={handleSearch}
              style={{ paddingLeft: '40px', width: '250px' }}
            />
          </div>
          <select value={statusFilter} onChange={handleStatusFilter} style={{ width: '150px' }}>
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', backgroundColor: '#f9fafb', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '15px 20px' }}>Student Email</th>
              <th style={{ padding: '15px 20px' }}>Program</th>
              <th style={{ padding: '15px 20px' }}>Strength</th>
              <th style={{ padding: '15px 20px' }}>Progress</th>
              <th style={{ padding: '15px 20px' }}>Status</th>
              <th style={{ padding: '15px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <tr 
                key={app._id} 
                className="hover-row"
                onClick={() => navigate(`/admin/applications/${app._id}`)}
                style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
              >
                <td style={{ padding: '15px 20px', fontWeight: 600 }}>{app.user?.email}</td>
                <td style={{ padding: '15px 20px' }}>{app.programInfo?.programType || 'N/A'}</td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', backgroundColor: '#eee', height: '6px', borderRadius: '3px' }}>
                      <div style={{ 
                        backgroundColor: app.profileStrength >= 80 ? '#10b981' : app.profileStrength >= 50 ? '#f59e0b' : '#ef4444', 
                        height: '100%', width: `${app.profileStrength || 0}%`, borderRadius: '3px' 
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{app.profileStrength || 0}%</span>
                  </div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                   <div style={{ width: '100px', backgroundColor: '#eee', height: '6px', borderRadius: '3px' }}>
                      <div style={{ backgroundColor: 'var(--primary-red)', height: '100%', width: `${app.completionPercentage}%`, borderRadius: '3px' }}></div>
                   </div>
                   <span style={{ fontSize: '0.75rem', color: '#666' }}>{app.completionPercentage}%</span>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 600,
                    backgroundColor: app.status === 'accepted' ? '#ecfdf5' : 
                                    app.status === 'rejected' ? '#fef2f2' : 
                                    app.status === 'submitted' ? '#eff6ff' : '#f3f4f6',
                    color: app.status === 'accepted' ? '#10b981' : 
                           app.status === 'rejected' ? '#ef4444' : 
                           app.status === 'submitted' ? '#3b82f6' : '#666'
                  }}>{app.status.replace('_', ' ')}</span>
                </td>
                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                   <div className="flex gap-10 justify-end">
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/applications/${app._id}`); }} title="View Details" style={{ color: '#3b82f6', background: 'none' }}><Eye size={18} /></button>
                      <button onClick={(e) => { e.stopPropagation(); updateAppStatus(app._id, 'under_review'); }} title="Set to Under Review" style={{ color: '#d97706', background: 'none' }}><Clock size={18} /></button>
                      <button onClick={(e) => { e.stopPropagation(); updateAppStatus(app._id, 'accepted'); }} title="Accept" style={{ color: '#10b981', background: 'none' }}><CheckCircle size={18} /></button>
                      <button onClick={(e) => { e.stopPropagation(); updateAppStatus(app._id, 'rejected'); }} title="Reject" style={{ color: '#ef4444', background: 'none' }}><XCircle size={18} /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplications;
