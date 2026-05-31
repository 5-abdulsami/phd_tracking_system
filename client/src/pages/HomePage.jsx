import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { BookOpen, GraduationCap, Globe, ShieldCheck, ArrowRight, CheckCircle2, Search, Award, Phone, Calendar, Book } from 'lucide-react';
import logo from '../assets/spectrum_logo.png';

const HomePage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
    country: '',
    degreeLevels: 'all',
    studyArea: ''
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentFilters.country) params.append('country', currentFilters.country);
      if (currentFilters.studyArea) params.append('studyArea', currentFilters.studyArea);
      if (currentFilters.degreeLevels && currentFilters.degreeLevels !== 'all') {
        params.append('degreeLevels', currentFilters.degreeLevels);
      }

      const { data } = await axios.get(`/api/scholarships?${params.toString()}`);
      setScholarships(data);
    } catch (err) {
      console.error('Error fetching scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchScholarships(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      country: '',
      degreeLevels: 'all',
      studyArea: ''
    };
    setFilters(defaultFilters);
    fetchScholarships(defaultFilters);
  };

  const handleApplyAction = (scholarship) => {
    // If all filters are selected, take user to register/login page to create profile
    navigate('/login', { state: { selectedScholarship: scholarship } });
  };

  const handleMainApplyClick = () => {
    // Redirect user to login/register to create profile
    navigate('/register');
  };

  return (
    <div className="homepage" style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="hero" style={{
        backgroundColor: 'var(--secondary-dark)', color: 'white',
        padding: '100px 0', borderBottom: '6px solid var(--primary-red)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '20px', lineHeight: '1.2' }}>
            Elevate Your Career with <br />
            <span style={{ color: 'var(--primary-red)' }}>Scholarships</span> Hub
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '800px', margin: '0 auto 40px auto' }}>
            Your professional gateway to global research opportunities. Discover and apply to
            premier international scholarship programs with Spectrum Consultants.
          </p>
          <div className="flex justify-center gap-20">
            <Link to="/register" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>Get Assessment Now</Link>
          </div>
        </div>
      </section>

      {/* Scholarship Explorer Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#f9fafb' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary-dark)' }}>
              Find the best scholarship for you
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px' }}>
              Filter through premium fully-funded international PhD and postdoctoral opportunities.
            </p>
          </div>

          {/* Interactive Filters Panel */}
          <div className="card mb-40 shadow-md" style={{ padding: '30px', borderRadius: '12px', borderLeft: '5px solid var(--primary-red)' }}>
            <form onSubmit={handleApplyFilters} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Country</label>
                <input
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  placeholder="e.g. United Kingdom, USA"
                  style={{ width: '100%', height: '42px' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Degree Program</label>
                <select
                  name="degreeLevels"
                  value={filters.degreeLevels}
                  onChange={handleFilterChange}
                  style={{ width: '100%', height: '42px', padding: '0 10px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="all">All Programs</option>
                  <option value="PhD">PhD</option>
                  <option value="Postdoctoral">Postdoctoral</option>
                  <option value="Masters">Masters</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Study Area</label>
                <input
                  name="studyArea"
                  value={filters.studyArea}
                  onChange={handleFilterChange}
                  placeholder="e.g. Computer Science, Physics"
                  style={{ width: '100%', height: '42px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '42px', padding: 0 }}>Apply Filters</button>
                <button type="button" onClick={resetFilters} className="btn-light" style={{ height: '42px', padding: '0 20px', border: '1px solid #ddd' }}>Reset</button>
              </div>
            </form>
          </div>

          {/* Dynamic matching grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', color: '#666' }}>Loading matching scholarships...</div>
          ) : scholarships.length === 0 ? (
            <div className="card text-center p-40" style={{ color: '#999', borderStyle: 'dashed', backgroundColor: 'white' }}>
              <h3>No scholarships match your filters</h3>
              <p>Try resetting the filters to see all available offerings.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {scholarships.map(scholarship => (
                <div key={scholarship._id} className="card shadow-sm hover-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', borderRadius: '10px', backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
                  {scholarship.thumbnail ? (
                    <img src={scholarship.thumbnail} alt={scholarship.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '180px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-red)' }}>
                      <Award size={48} />
                    </div>
                  )}
                  <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: 'var(--secondary-dark)', fontWeight: 700 }}>{scholarship.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>{scholarship.university} • <strong>{scholarship.country}</strong></p>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#eff6ff', color: '#1e40af' }}>{scholarship.fundedBy} Funded</span>
                      <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#ecfdf5', color: '#065f46' }}>{scholarship.studyArea}</span>
                    </div>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid #f3f4f6', paddingTop: '15px', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600 }}>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                      <button 
                        onClick={() => handleApplyAction(scholarship)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '6px 15px', fontSize: '0.8rem' }}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features container" style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h6 style={{ color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Our Excellence</h6>
          <h2 style={{ fontSize: '2.5rem' }}>Full-Fledge Tracking Features</h2>
        </div>

        <div className="grid gap-20" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ color: 'var(--primary-red)', marginBottom: '20px' }}><BookOpen size={40} /></div>
            <h3 style={{ marginBottom: '15px' }}>11-Step Detailed Form</h3>
            <p style={{ color: 'var(--text-muted)' }}>Comprehensive application capturing everything from academic background to research statements and funding details.</p>
          </div>
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ color: 'var(--primary-red)', marginBottom: '20px' }}><Globe size={40} /></div>
            <h3 style={{ marginBottom: '15px' }}>Global Tracking</h3>
            <p style={{ color: 'var(--text-muted)' }}>Monitor your progress across multiple international programs and universities in real-time from your student dashboard.</p>
          </div>
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ color: 'var(--primary-red)', marginBottom: '20px' }}><ShieldCheck size={40} /></div>
            <h3 style={{ marginBottom: '15px' }}>Secure Document Portal</h3>
            <p style={{ color: 'var(--text-muted)' }}>Safely upload and manage your transcripts, CVs, and research proposals in our encrypted cloud storage.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ backgroundColor: '#f9fafb', padding: '80px 0' }}>
        <div className="container flex items-center justify-between flex-col-mobile gap-20">
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Ready to Start Your Research Journey?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="flex items-center gap-10"><CheckCircle2 size={20} color="var(--primary-red)" /> Expert PhD Consultancy</div>
              <div className="flex items-center gap-10"><CheckCircle2 size={20} color="var(--primary-red)" /> 99% Visa Approval Rate</div>
              <div className="flex items-center gap-10"><CheckCircle2 size={20} color="var(--primary-red)" /> Direct University Partnerships</div>
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'var(--white)', padding: '40px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ marginBottom: '20px' }}>Start Today</h3>
            <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>Create your profile and let our specialist review your academic credentials within 24-48 hours.</p>
            <button onClick={handleMainApplyClick} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '15px', width: '100%', border: 'none' }}>
              Create Applicant Profile <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section style={{ backgroundColor: '#fff', padding: '60px 0', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: 'var(--secondary-dark)' }}>Need Direct Guidance?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px auto' }}>
            Speak directly with a Spectrum Consultants representative to guide you through your PhD scholarship application process.
          </p>
          <a href="tel:+923001234567" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 40px', fontSize: '1.1rem', textDecoration: 'none' }}>
            <Phone size={20} /> Contact Us: +92 300 123 4567
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--secondary-dark)', color: 'white', padding: '60px 0 20px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <img src={logo} alt="Spectrum" style={{ height: '60px', marginBottom: '20px' }} />
          <p style={{ color: '#999', marginBottom: '40px' }}>Your Most Trusted Partner for Overseas Education.</p>
          <div style={{ borderTop: '1px solid #333', paddingTop: '20px', fontSize: '0.8rem', color: '#666' }}>
            &copy; 2026 Spectrum Overseas Education Consultants Pvt Ltd. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
