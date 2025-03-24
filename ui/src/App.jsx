import './App.css'
import { Provider } from 'react-redux';
import { store } from './store';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import theme from './theme.jsx';
// import UploadForm from './components/UploadForm.jsx';
import WebcamCapture from './components/WebcamCapture.jsx';
import Results from './components/Results.jsx';

function App() {

  return (
    <>
      <Provider store={store}>
        <Container maxWidth="lg" style={{ marginTop: theme.spacing(6) }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
              Smile Detector
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Card>
                  <CardContent>
                    <WebcamCapture />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={6}>
                <Card>
                  <CardContent>
                    <Results />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
        </Container>
      </Provider>
    </>
  )
}

export default App
