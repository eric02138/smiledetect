import React, { useState, useEffect, useRef } from 'react';

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const captureIntervalRef = useRef(null);

  // Initialize webcam
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Error accessing camera: " + err.message);
        console.error("Error accessing camera:", err);
      }
    };

    startWebcam();

    // Cleanup function to stop all streams when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Handle capturing images every half-second
  const startCapturing = () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    captureIntervalRef.current = setInterval(() => {
      captureImage();
    }, 500); // 500ms = half-second
  };

  const stopCapturing = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    const timestamp = new Date().toLocaleTimeString();
    
    setImages(prevImages => [
      { src: imageData, timestamp },
      ...prevImages.slice(0, 9) // Keep only the 10 most recent images
    ]);
  };

  const clearImages = () => {
    setImages([]);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Webcam Image Capture</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto border rounded-lg bg-gray-100"
        />
      </div>
      
      <div className="flex gap-2 mb-6">
        {isCapturing ? (
          <button 
            onClick={stopCapturing} 
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Stop Capturing
          </button>
        ) : (
          <button 
            onClick={startCapturing} 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            disabled={!!error}
          >
            Start Capturing (Every 0.5s)
          </button>
        )}
        
        <button 
          onClick={clearImages} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          disabled={images.length === 0}
        >
          Clear Images
        </button>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Captured Images ({images.length})</h2>
        {images.length === 0 ? (
          <p className="text-gray-500 italic">No images captured yet. Click "Start Capturing" to begin.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="border rounded overflow-hidden">
                <img src={image.src} alt={`Captured ${index}`} className="w-full h-32 object-cover" />
                <div className="p-2 text-xs text-center bg-gray-100">
                  {image.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
