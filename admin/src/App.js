import React from 'react';
import './App.css';
import './Theme.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import ScrollToTop from './ScrollToTop';


function App() {

  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <AuthProvider />
      </div>
    </Router>
  );
}

export default App;
