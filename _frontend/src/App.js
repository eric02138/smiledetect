// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import UploadForm from './components/UploadForm';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1>File Streaming Upload</h1>
        </header>
        <main>
          <UploadForm />
        </main>
      </div>
    </Provider>
  );
}

export default App;