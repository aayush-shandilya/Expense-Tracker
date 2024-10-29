
import styled from "styled-components";
import bg from './img/bg.png';
import { MainLayout } from "./styles/Layouts";
import Navigation from './components/Navigation/Navigation';
import { useState } from "react";
import Dashboard from "./components/Dashboard/Dashboard";
import Income from "./components/income/Income";
import Expenses from "./components/Expenses/Expenses";
import ExpensesCategory from "./components/ExpensesComponents/ExpenseCategory";
import { useGlobalContext } from './context/globalContext';
import { useAuth } from './context/AuthContext';
import Login from './components/Login/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

// Main Layout Component
const MainAppLayout = () => {
    const [active, setActive] = useState(1);
    const { logout } = useAuth();
    
    const displayData = () => {
        switch (active) {
            case 1:
                return <Dashboard />;
            case 2:
                return <Dashboard />;
            case 3:
                return <Income />;
            case 4:
                return <Expenses />;
            case 5:
                return <ExpensesCategory />;
            default:
                return <Dashboard />;
        }
    };
    
    return (
        <AppStyled bg={bg} className="App">
            <MainLayout>
                <Navigation
                    active={active}
                    setActive={setActive}
                    onLogout={logout}
                />
                <main>
                    {displayData()}
                </main>
            </MainLayout>
        </AppStyled>
    );
};

function App() {
    const { loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
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
        </Router>
    );
}

const AppStyled = styled.div`
    height: 100vh;
    background-image: url(${props => props.bg});
    position: relative;
    main {
        flex: 1;
        background: rgba(252, 246, 249, 0.78);
        border: 3px solid #FFFFFF;
        backdrop-filter: blur(4.5px);
        border-radius: 32px;
        overflow-x: hidden;
        &::-webkit-scrollbar {
            width: 0;
        }
    }
`;

export default App;