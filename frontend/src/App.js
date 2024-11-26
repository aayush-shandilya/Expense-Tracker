import React, { useState } from 'react';
import { 
  Box, 
  Grid,
  styled 
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/chatContext'; 
import Navigation from './components/Navigation/Navigation';
import TopNavbar from './components/Navigation/TopNavbar';
import Dashboard from './components/Dashboard/Dashboard';
import Income from './components/income/Income';
import Expenses from './components/Expenses/Expenses';
import ExpensesCategory from './components/ExpensesComponents/ExpenseCategory';
import ChatLayout from './components/Chat/ChatLayout';
import { CustomerServiceProvider } from './context/CustomerServiceContext';
import CustomerServiceChat from './components/CustomerServiceChat/CustomerServiceChat';
import Login from './components/Login/Login';
import bg from './img/bg.png';

// Constants
const NAVBAR_HEIGHT = '50px';
const NAV_COLUMNS = 2.5;
const CONTENT_COLUMNS = 9.5;
const CONTAINER_SPACING = '5px';
const COMPONENT_MARGIN = '5px';

// Styled components remain the same
const AppWrapper = styled(Box)({
  minHeight: '100vh',
  backgroundImage: `url(${bg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
});

const MainContentWrapper = styled(Box)(({ theme }) => ({
  minHeight: `calc(100vh - ${NAVBAR_HEIGHT})`,
  paddingTop: CONTAINER_SPACING,
  paddingLeft: CONTAINER_SPACING,
  paddingRight: CONTAINER_SPACING,
  paddingBottom: CONTAINER_SPACING,
}));

const BaseContainer = styled(Box)(({ theme }) => ({
  height: `calc(100vh - ${NAVBAR_HEIGHT} - ${CONTAINER_SPACING} * 2)`,
  background: 'rgba(252, 246, 249, 0.78)',
  border: '3px solid #FFFFFF',
  backdropFilter: 'blur(4.5px)',
  borderRadius: '10px',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(34, 34, 96, 0.2)',
    borderRadius: '3px',
  },
}));

const ContentArea = styled(Box)(({ theme }) => ({
    height: `calc(100vh - ${NAVBAR_HEIGHT} - 10px)`,
    background: 'rgba(252, 246, 249, 0.78)',
    border: '3px solid #FFFFFF',
    backdropFilter: 'blur(4.5px)',
    borderRadius: '10px',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(34, 34, 96, 0.2)',
      borderRadius: '3px',
    },
}));

const GridContainer = styled(Grid)({
    margin: 0,
    width: '100%',
});

// // Protected Route Component remains the same
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) return <div>Loading...</div>;
//   if (!user) return <Navigate to="/login" />;
//   //return children;
//   return React.cloneElement(children, { user });
// };

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return React.cloneElement(children, { user });
};

// Main Layout Component with Chat integration
// const MainAppLayout = () => {
//     const [active, setActive] = useState(1);
  
//     const displayData = () => {
//       switch (active) {
//         case 1:
//         case 2:
//           return <Dashboard />;
//         case 3:
//           return <Income />;
//         case 4:
//           return <Expenses />;
//         case 5:
//           return <ExpensesCategory />;
//         case 6:  
//           return <ChatLayout />;
//         case 7: 
//           return <CustomerServiceChat currentUser={user} />;
//         default:
//           return <Dashboard />;
//       }
//     };

//     return (
//       <AppWrapper>
//         <TopNavbar />
//         <MainContentWrapper>
//           <GridContainer container>
//             <Grid 
//               item 
//               xs={NAV_COLUMNS} 
//               style={{ 
//                 height: '100%',
//                 paddingRight: COMPONENT_MARGIN
//               }}
//             >
//               <Navigation
//                 active={active}
//                 setActive={setActive}
//                 BaseContainer={BaseContainer}
//               />
//             </Grid>
//             <Grid 
//               item 
//               xs={CONTENT_COLUMNS} 
//               style={{ height: '100%' }}
//             >
//               <ContentArea>
//                 {displayData()}
//               </ContentArea>
//             </Grid>
//           </GridContainer>
//         </MainContentWrapper>
//       </AppWrapper>
//     );
//   };

// function App() {
// return (
//   <Router>
//     <AuthProvider>
//       <ChatProvider>
//         <CustomerServiceProvider>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route
//               path="/*"
//               element={
//                 <ProtectedRoute>
//                   <MainAppLayout />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </CustomerServiceProvider>
//       </ChatProvider>
//     </AuthProvider>
//   </Router>
// );
// }

// export default App;


const MainAppLayout = ({ user }) => {
  const [active, setActive] = useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      case 5:
        return <ExpensesCategory />;
      case 6:  
        return <ChatLayout />;
      case 7: 
        return <CustomerServiceChat currentUser={user} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppWrapper>
      <TopNavbar />
      <MainContentWrapper>
        <GridContainer container>
          <Grid 
            item 
            xs={NAV_COLUMNS} 
            style={{ 
              height: '100%',
              paddingRight: COMPONENT_MARGIN
            }}
          >
            <Navigation
              active={active}
              setActive={setActive}
              BaseContainer={BaseContainer}
            />
          </Grid>
          <Grid 
            item 
            xs={CONTENT_COLUMNS} 
            style={{ height: '100%' }}
          >
            <ContentArea>
              {displayData()}
            </ContentArea>
          </Grid>
        </GridContainer>
      </MainContentWrapper>
    </AppWrapper>
  );
};

function App() {
return (
  <Router>
    <AuthProvider>
      <ChatProvider>
        <CustomerServiceProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainAppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CustomerServiceProvider>
      </ChatProvider>
    </AuthProvider>
  </Router>
);
}

export default App;


  
//     return (
//         <AppWrapper>
//           <TopNavbar />
//           <MainContentWrapper>
//             <GridContainer container>
//               <Grid 
//                 item 
//                 xs={NAV_COLUMNS} 
//                 style={{ 
//                   height: '100%',
//                   paddingRight: COMPONENT_MARGIN
//                 }}
//               >
//                 <Navigation
//                   active={active}
//                   setActive={setActive}
//                   BaseContainer={BaseContainer}
//                 />
//               </Grid>
//               <Grid 
//                 item 
//                 xs={CONTENT_COLUMNS} 
//                 style={{ height: '100%' }}
//               >
//                 <ContentArea>
//                   {displayData()}
//                 </ContentArea>
//               </Grid>
//             </GridContainer>
//           </MainContentWrapper>
//         </AppWrapper>
//       );
//     };

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <ChatProvider>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route
//               path="/*"
//               element={
//                 <ProtectedRoute>
//                   <MainAppLayout />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </ChatProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;