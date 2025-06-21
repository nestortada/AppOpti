import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import NotFound from './pages/NotFound.jsx';
import { ResultsProvider } from './context/ResultsContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ResultsProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ResultsProvider>
  </BrowserRouter>
);
