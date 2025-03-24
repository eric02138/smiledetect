// src/components/UploadForm.js
import React, { useState, useRef, useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UploadService } from '../services/uploadService';
import { 
  saveStart,  
  saveSuccess, 
  saveError, 
  saveCancel
} from '../slices/uploadSlice';

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
  listSubheaderClasses,
} from '@mui/material';
import { 
  Save as SaveIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Item = styled(Container)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.subtitle2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const Results = () => {
  const dispatch = useDispatch();
  const upload_state = useSelector((state) => state.upload);

  // Subscription reference to store the observable subscription
  const saveSubscription = useRef(null);

  const id = useId()
  const id2 = useId()


  const startSaving = () => {
    dispatch(saveStart());
    saveSubscription.current = UploadService.saveImage(upload_state.smileData)
    .subscribe(
      (event) => {
        console.log("event")
        console.log(event)
        switch (event.type) {
          case 'progress':
            dispatch(saveStart(event.payload));
            break;
          case 'success':
            dispatch(saveSuccess(event.payload));
            break;
          case 'error':
            dispatch(saveError(event.payload));
            break;
          case 'cancel':
            dispatch(saveCancel());
            break;
          default:
            break;
        }
      }
    );  
  };

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Current Result
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>

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
          <Grid container spacing={3}>
            <Grid item xs={3} md={3}>
              <Item>Filename:</Item>
            </Grid>
            <Grid item xs={9} md={9}>
              <Item>
              {upload_state?.smileData?.output_filename && (
                  <div key={ id } >
                    <p>{ upload_state.smileData.output_filename }</p>
                  </div>
                )
              }
              </Item>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={3} md={3}>
              <Item>Coordinates:</Item>
            </Grid>
            <Grid item xs={9} md={9}>
              <Item>
            {!upload_state?.smileData?.smile_list || upload_state.smileData.smile_list.length === 0 ? (
                "No smile detected"
              )
            : 
              upload_state.smileData.smile_list.map((item) => (
                <div key={ id2 } >
                  <p>Top Left: x={ item[0] }px, y={ item[1] }px</p>
                  <p>Bottom Right: x={ item[2] }px, y={ item[3] }px</p>
                </div>
              ))
            }
              </Item>
          </Grid>
          <Grid item xs={12} md={12} sx={{ textAlign: 'center' }}>
              { upload_state?.smileData?.smile_list && !upload_state.isCapturing && (
                  <Button 
                  variant="contained" 
                  color="success" 
                  startIcon={<SaveIcon />}
                  onClick={ startSaving }
                  disabled={upload_state.isSaving}
                >
                  {!upload_state.isSaving ? ("Save") : ("Saving...")}
                </Button>
              ) 
              }

          </Grid>
        </Grid>                

          </Paper>    
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default Results;