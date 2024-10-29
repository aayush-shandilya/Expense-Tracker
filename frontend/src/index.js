

// // index.js
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { GlobalProvider } from './context/globalContext';
// import { AuthProvider } from './context/AuthContext';
// import axios from 'axios';

// // Set base URL for axios
// axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:500';

// ReactDOM.render(
//     <React.StrictMode>
//         <AuthProvider>
//             <GlobalProvider>
//                 <App />
//             </GlobalProvider>
//         </AuthProvider>
//     </React.StrictMode>,
//     document.getElementById('root')
// );

import React from 'react';
import ReactDOM from 'react-dom/client'; // Update this import
import App from './App';
import { GlobalProvider } from './context/globalContext';
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';

// Set base URL for axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Create a root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your app
root.render(
    <React.StrictMode>
        <AuthProvider>
            <GlobalProvider>
                <App />
            </GlobalProvider>
        </AuthProvider>
    </React.StrictMode>
);
