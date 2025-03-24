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

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef(null);
  const dispatch = useDispatch();
  const { isUploading, progress, error, smileData } = useSelector((state) => state.upload);
  
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
              setFilePreview(event.payload.file_upload_path)
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

  const SmallButton = styled(Button)({
    width: 250
  });

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
        <div>
          <SmallButton
            size="medium"
            component="label"
            role={undefined}
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Select file
            <VisuallyHiddenInput
              type="file"
              id="file"
              ref={fileInput}
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </SmallButton>
        </div>        
        
        <div>
          <Grid size={2}>
            {!isUploading && (
              <button 
              type="submit" 
              disabled={!selectedFile}
              className="btn btn-primary"
              >
                Upload
              </button>
            )}            

            {isUploading && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-danger"
              >
                Cancel Upload
              </button>
            )}

          </Grid>

        </div>

        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>

        {smileData && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            <Paper elevation={3} sx={{ p: 2 }}>
            <img src={ "http://127.0.0.1:8000/uploads/" + smileData.output_filename } />
            </Paper>
          </Box>
        )}

        </Stack>
      </form>
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
    </>
  );
};

export default UploadForm;