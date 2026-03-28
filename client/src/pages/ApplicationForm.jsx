import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, ArrowRight, Save, CheckCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import ApplicantInfo from '../components/forms/steps/ApplicantInfo';
import ContactDetails from '../components/forms/steps/ContactDetails';
import GuardianInfo from '../components/forms/steps/GuardianInfo';
import AcademicBackground from '../components/forms/steps/AcademicBackground';
import ProgramInfo from '../components/forms/steps/ProgramInfo';
import ResearchExperience from '../components/forms/steps/ResearchExperience';
import EnglishProficiency from '../components/forms/steps/EnglishProficiency';
import FundingInfo from '../components/forms/steps/FundingInfo';
import Referees from '../components/forms/steps/Referees';
import Documents from '../components/forms/steps/Documents';
import Declaration from '../components/forms/steps/Declaration';

const ApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const steps = [
    'Applicant Info', 'Contact Details', 'Guardian Info', 'Academic', 
    'Program', 'Research', 'English', 'Funding', 'Referees', 'Documents', 'Submission'
  ];

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data } = await axios.get('/api/applications/me');
        setFormData(data);
      } catch (err) {
        console.error('Error fetching application');
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, []);

  const saveCurrentSection = async () => {
    const sections = [
      'applicantInfo', 'contactDetails', 'guardianInfo', 'academicBackground', 
      'programInfo', 'researchExperience', 'englishProficiency', 'fundingInfo', 
      'referees', 'documents', 'declaration'
    ];
    
    const currentSectionKey = sections[step - 1];
    setIsSaving(true);
    try {
      const response = await axios.put(`/api/applications/me/section/${currentSectionKey}`, formData[currentSectionKey]);
      setFormData(response.data); // Update local data with saved data (including percentage)
    } catch (err) {
      console.error('Error saving section');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (section, data) => {
    setFormData({ ...formData, [section]: data });
  };

  const submitApplication = async () => {
    try {
      await axios.post('/api/applications/me/submit');
      navigate('/dashboard');
    } catch (err) {
      alert('Submission failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  const nextStep = async () => {
    await saveCurrentSection();
    if (step < steps.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (loading) return <div>Loading Application...</div>;

  return (
    <div className="application-form-container container mt-20 mb-20">
      <div className="flex items-center gap-10 mb-20" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
        <ChevronLeft size={18} /> Back to Dashboard
      </div>

      <div className="flex gap-20 flex-col-mobile">
        {/* Step Navigation Sidebar */}
        <div className="steps-nav sidebar" style={{ flex: 1 }}>
          <div className="card" style={{ padding: '0' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Application Steps</h3>
            </div>
            <ul style={{ listStyle: 'none' }}>
              {steps.map((s, index) => (
                <li key={index} style={{ 
                  padding: '15px 20px', borderBottom: index < steps.length - 1 ? '1px solid var(--border-color)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  backgroundColor: step === index + 1 ? '#fee2e2' : 'transparent',
                  color: step === index + 1 ? 'var(--primary-red)' : 'var(--text-main)',
                  fontWeight: step === index + 1 ? 700 : 400,
                  cursor: 'pointer'
                }} onClick={() => setStep(index + 1)}>
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step > index + 1 ? 'var(--primary-red)' : '#ccc',
                    color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px'
                  }}>
                    {step > index + 1 ? <CheckCircle size={14} /> : index + 1}
                  </div>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="form-content" style={{ flex: 3 }}>
          <div className="card">
            <div className="section-header mb-20 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-red)' }}>{steps[step - 1]}</h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Step {step} of 11</span>
            </div>

            <div className="step-component" style={{ minHeight: '400px' }}>
               {step === 1 && <ApplicantInfo data={formData.applicantInfo} updateData={updateFormData} />}
               {step === 2 && <ContactDetails data={formData.contactDetails} updateData={updateFormData} />}
               {step === 3 && <GuardianInfo data={formData.guardianInfo} updateData={updateFormData} />}
               {step === 4 && <AcademicBackground data={formData.academicBackground} updateData={updateFormData} />}
               {step === 5 && <ProgramInfo data={formData.programInfo} updateData={updateFormData} />}
               {step === 6 && <ResearchExperience data={formData.researchExperience} updateData={updateFormData} />}
               {step === 7 && <EnglishProficiency data={formData.englishProficiency} updateData={updateFormData} />}
               {step === 8 && <FundingInfo data={formData.fundingInfo} updateData={updateFormData} />}
               {step === 9 && <Referees data={formData.referees} updateData={updateFormData} />}
               {step === 10 && <Documents data={formData.documents} updateData={updateFormData} />}
               {step === 11 && (
                 <Declaration 
                   data={formData.declaration} 
                   updateData={updateFormData} 
                   canSubmit={formData.completionPercentage >= 90}
                   onSubmit={submitApplication}
                 />
               )}
            </div>

            <div className="form-actions mt-20 flex justify-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <button onClick={prevStep} disabled={step === 1} className="btn-dark" style={{ 
                padding: '10px 25px', borderRadius: '4px', opacity: step === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <ChevronLeft size={18} /> Previous
              </button>
              
              <div className="flex gap-10">
                <button onClick={saveCurrentSection} className="btn" style={{ 
                  backgroundColor: '#f3f4f6', color: '#666', border: '1px solid #ddd', padding: '10px 25px', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  {isSaving ? 'Saving...' : <><Save size={18} /> Save Progress</>}
                </button>
                
                {step < 11 ? (
                  <button onClick={nextStep} className="btn btn-primary" style={{ padding: '10px 25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <button className="btn" style={{ backgroundColor: 'var(--success)', color: 'white', padding: '10px 25px' }}>
                    Final Submission
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
