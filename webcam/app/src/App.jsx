import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WebcamCapture from './webcam-image-capture'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WebcamCapture />
    </>
  )
}

export default App
