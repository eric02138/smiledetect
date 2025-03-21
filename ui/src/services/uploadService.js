// src/services/uploadService.js
import axios from 'axios';
import { Observable } from 'rxjs';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
});

export class UploadService {
  static uploadFile(file) {
    return new Observable((subscriber) => {
      // Create a cancelation token
      const cancelToken = axios.CancelToken.source();
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Track upload progress
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          subscriber.next({ 
            type: 'progress', 
            payload: percentCompleted 
          });
        },
        cancelToken: cancelToken.token,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      // Make the API call
      api
        .post('/upload', formData, config)
        .then((response) => {
          subscriber.next({ 
            type: 'success', 
            payload: response.data 
          });
          subscriber.complete();
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            subscriber.next({ 
              type: 'cancel', 
              payload: 'Upload was canceled' 
            });
          } else {
            subscriber.next({ 
              type: 'error', 
              payload: error.message 
            });
          }
          subscriber.complete();
        });
      
      // Return cancel function
      return () => {
        cancelToken.cancel('Operation canceled by the user.');
      };
    });
  }
}