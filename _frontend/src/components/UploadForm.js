// src/components/UploadForm.js
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  uploadStart, 
  uploadProgress, 
  uploadSuccess, 
  uploadError, 
  uploadCancel 
} from '../slices/uploadSlice';
import { UploadService } from '../services/uploadService';

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef(null);
  const dispatch = useDispatch();
  const { isUploading, progress, error } = useSelector((state) => state.upload);
  
  // Subscription reference to store the observable subscription
  const uploadSubscription = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    
    dispatch(uploadStart());
    
    // Subscribe to the observable
    uploadSubscription.current = UploadService.uploadFile(selectedFile)
      .subscribe(
        (event) => {
          switch (event.type) {
            case 'progress':
              dispatch(uploadProgress(event.payload));
              break;
            case 'success':
              dispatch(uploadSuccess(event.payload));
              setSelectedFile(null);
              if (fileInput.current) {
                fileInput.current.value = '';
              }
              break;
            case 'error':
              dispatch(uploadError(event.payload));
              break;
            case 'cancel':
              dispatch(uploadCancel());
              break;
            default:
              break;
          }
        }
      );
  };

  const handleCancel = () => {
    if (uploadSubscription.current) {
      uploadSubscription.current.unsubscribe();
      uploadSubscription.current = null;
      dispatch(uploadCancel());
    }
  };

  return (
    <div className="upload-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">Select File:</label>
          <input
            type="file"
            id="file"
            ref={fileInput}
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={!selectedFile || isUploading}
            className="btn btn-primary"
          >
            Upload
          </button>
          
          {isUploading && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-danger"
            >
              Cancel Upload
            </button>
          )}
        </div>
      </form>
      
      {isUploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default UploadForm;