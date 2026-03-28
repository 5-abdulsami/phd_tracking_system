import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, UserPlus, Shield } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--bg-light)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--secondary-dark)' }}>Apply Now</h2>
          <p style={{ color: 'var(--text-muted)' }}>Start your PhD journey with Spectrum</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', 
            borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ 
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ 
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} />
              <input 
                type="password" 
                placeholder="Build a strong password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} style={{ 
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} />
              <input 
                type="password" 
                placeholder="Repeat your password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
          >
            {isLoading ? 'Creating Account...' : (
              <><UserPlus size={20} /> Create Account & Start</>
            )}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--secondary-dark)', fontWeight: 700 }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
