import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@fontsource-variable/roboto-mono';
import '@fontsource/vt323';
import '@fontsource/anonymous-pro';
import '@fontsource-variable/azeret-mono';
import '@fontsource/dejavu-mono';
import '@fontsource/sixtyfour';
import '@fontsource-variable/red-hat-mono';

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
