import { useState } from 'react'
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import theme from './theme.jsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Container maxWidth="lg" style={{ marginTop: theme.spacing(6) }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Smile Detector
          </Typography>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Card>
                <CardContent>
                  <h4>
                    Please select a headshot image to upload:
                  </h4>
                  <p>
                    <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>
                    (.jpg and .png filetypes are supported.)
                    </Typography>
                  </p>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={6}>
              <Card>
                <CardContent>
                  <h4>
                    Results:
                  </h4>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </Container>

      {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
    </>
  )
}

export default App
