// src/services/dbService.js
import axios from 'axios';
import { Observable } from 'rxjs';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
});

export class DbService {
  static saveData(file) {
    return new Observable((subscriber) => {
      // Create a cancelation token
      const cancelToken = axios.CancelToken.source();
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Make the API call
      api
        .post('/dbsave', formData, config)
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