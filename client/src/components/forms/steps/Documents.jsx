import React, { useState } from 'react';
import axios from 'axios';
import { Upload, File, Check, X, AlertCircle, Loader } from 'lucide-react';

const Documents = ({ data = {}, updateData }) => {
  const [uploading, setUploading] = useState({});

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading({ ...uploading, [type]: true });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'documents');

    try {
      const { data: uploadRes } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      updateData('documents', { ...data, [type]: uploadRes.url });
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || 'Server error'));
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const docTypes = [
    { key: 'cv', label: 'CV / Resume' },
    { key: 'sop', label: 'Statement of Purpose (SOP)' },
    { key: 'transcript', label: 'Academic Transcripts' },
    { key: 'passport', label: 'Passport / ID Copy' },
    { key: 'englishCert', label: 'English Proficiency Certificate' },
  ];

  return (
    <div className="section-form">
      <p className="mb-20" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Upload your documents in PDF or Image format (max 5MB each).
      </p>

      {docTypes.map((doc) => (
        <div key={doc.key} className="card mb-20" style={{ padding: '20px', border: '1px solid #eee' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-15">
              <div style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '8px', color: '#666' }}>
                <File size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{doc.label}</h4>
                {data[doc.key] ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Check size={14} /> Uploaded Successfully
                  </span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Not uploaded yet</span>
                )}
              </div>
            </div>

            <div className="upload-actions">
              {uploading[doc.key] ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-red)' }}>
                  <Loader className="animate-spin" size={18} /> Uploading...
                </div>
              ) : data[doc.key] ? (
                <div className="flex gap-10">
                   <a href={data[doc.key]} target="_blank" rel="noreferrer" className="btn" style={{ padding: '5px 15px', fontSize: '0.8rem', border: '1px solid #ddd' }}>View</a>
                   <label style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--primary-red)', fontWeight: 600 }}>
                    Replace
                    <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, doc.key)} />
                  </label>
                </div>
              ) : (
                <label className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={16} /> Upload
                  <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, doc.key)} />
                </label>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Documents;
