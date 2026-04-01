import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Globe, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero" style={{
        backgroundColor: 'var(--secondary-dark)', color: 'white',
        padding: '100px 0', borderBottom: '6px solid var(--primary-red)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '20px', lineHeight: '1.2' }}>
            Elevate Your Career with <br />
            <span style={{ color: 'var(--primary-red)' }}>PhD & Postdoctoral</span> Tracking
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '800px', margin: '0 auto 40px auto' }}>
            Your professional gateway to global research opportunities. Track your application
            from initial draft to final institutional acceptance with Spectrum Consultants.
          </p>
          <div className="flex justify-center gap-20">
            <Link to="/register" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>Get Assessment Now</Link>
            <Link to="/login" className="btn btn-dark" style={{ border: '1px solid white', padding: '15px 40px', fontSize: '1.1rem' }}>Track Application</Link>
          </div>
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
            <Link to="/register" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '15px' }}>
              Create Applicant Profile <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer style={{ backgroundColor: 'var(--secondary-dark)', color: 'white', padding: '60px 0 20px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <img src="../assets/spectrum_logo.png" alt="Spectrum" style={{ height: '60px', marginBottom: '20px' }} />
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
