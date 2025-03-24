import React, { useState, useRef, useEffect } from 'react';
import { Subject } from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';
import { 
    uploadStart, 
    uploadProgress, 
    uploadSuccess, 
    uploadError, 
    uploadCancel ,
    captureStart,
    captureCancel
} from '../slices/uploadSlice';
import { UploadService } from '../services/uploadService';

import { 
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Stack,
  CircularProgress
} from '@mui/material';
import { 
  CameraAlt as CameraIcon, 
  Stop as StopIcon, 
  Delete as DeleteIcon, 
  Download as DownloadIcon 
} from '@mui/icons-material';

const WebcamCaptureApp = () => {
  const dispatch = useDispatch();

  const [isCapturing, setIsCapturing] = useState(false);
  const [image, setImage] = useState(null)
  const [hasWebcam, setHasWebcam] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isUploading, progress, error, smileData, dbResponse } = useSelector((state) => state.upload);

  // Subscription reference to store the observable subscription
  const uploadSubscription = useRef(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  
  // Initialize webcam when component mounts
  useEffect(() => {
    const setupWebcam = async () => {
      try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasWebcam(true);
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        setHasWebcam(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    setupWebcam();
    
    // Cleanup function to stop all streams when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Subscribe to the observable
    if (image) {
        uploadSubscription.current = UploadService.uploadImage(image)
        .subscribe(
          (event) => {
            switch (event.type) {
              case 'progress':
                dispatch(uploadProgress(event.payload));
                break;
              case 'success':
                dispatch(uploadSuccess(event.payload));
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
    }
  }, [image]);

// Function to capture an image from the video stream
const captureImage = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');

    setImage(imageDataUrl)
};

  // Start capturing image every half-second
  const startCapturing = () => {
    setIsCapturing(true);
    dispatch(captureStart());
    // Capture one image immediately
    captureImage();

    // Then set up interval for capturing
    intervalRef.current = setInterval(captureImage, 500);
  };
  
  // Stop capturing image
  const stopCapturing = () => {
    setIsCapturing(false);
    dispatch(captureCancel());
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      uploadSubscription.current.unsubscribe();
      uploadSubscription.current = null;
      intervalRef.current = null;
      dispatch(uploadCancel());
    }
  };
  
  // Clear captured image
  const clearImage = () => {
    setImage(null);
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Webcam Capture App
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Webcam Preview */}
          <Grid item xs={12} md={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                minHeight: 400,
                position: 'relative'
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <CircularProgress />
                </Box>
              ) : hasWebcam ? (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <Typography color="error">
                    No webcam detected or access denied
                  </Typography>
                </Box>
              )}
              
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ mt: 2, mb: 2 }}
              >
                {isCapturing ? (
                  <Button 
                    variant="contained" 
                    color="error" 
                    startIcon={<StopIcon />}
                    onClick={stopCapturing}
                  >
                    Stop Capturing
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<CameraIcon />}
                    onClick={startCapturing}
                    disabled={!hasWebcam || isLoading}
                  >
                    Start Capturing
                  </Button>
                )}
              </Stack>

              {!smileData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <Typography color="text.secondary">
                    No image captured yet
                  </Typography>
                </Box>
              ) : (
                <Paper elevation={2} sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                        Processed Image
                        </Typography>
                    </Box>
                    <img 
                    src={'http://127.0.0.1:8000' + smileData.output_file_path.replace('..', '')} 
                    style={{ width: '100%', objectFit: 'contain' }}
                    />
                </Paper>
              )}
            </Paper>
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
};

export default WebcamCaptureApp;
