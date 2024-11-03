import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { GlobalProvider } from './context/globalContext';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#222260', 
      light: '#373777',
      dark: '#1a1a4b',
    },
    secondary: {
      main: '#FCF6F9',
      light: '#FFFFFF',
      dark: '#E8E0E4',
    },
    background: {
      default: '#FCF6F9',
      paper: 'rgba(252, 246, 249, 0.78)',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 32,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(252, 246, 249, 0.78)',
          border: '3px solid #FFFFFF',
          backdropFilter: 'blur(4.5px)',
          borderRadius: 32,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          padding: '0.5rem 1.5rem',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(252, 246, 249, 0.78)',
          backdropFilter: 'blur(4.5px)',
        },
      },
    },
  },
});

// Global styles
const GlobalStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }

      :root {
        --primary-color: #222260;
        --primary-color2: rgba(34, 34, 96, .6);
        --primary-color3: rgba(34, 34, 96, .4);
        --color-green: #42AD00;
        --color-grey: #aaa;
        --color-accent: #F56692;
        --color-delete: #FF0000;
      }

      body {
        font-family: 'Poppins', sans-serif;
        overflow-x: hidden;
      }

      input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder {
          color: rgba(34, 34, 96, 0.4);
        }
      }
    `}
  </style>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <AuthProvider>
        <GlobalProvider>
          <App />
        </GlobalProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);