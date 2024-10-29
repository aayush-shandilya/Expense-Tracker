
//frontend/Login/Login.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let result;
            if (isRegister) {
                result = await register(name, email, password);
            } else {
                result = await login(email, password);
            }

            if (result.success) {
                navigate('/'); // Navigate to root after successful login/register
            } else {
                setError(result.error || `${isRegister ? 'Registration' : 'Login'} failed`);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LoginStyled>
            <div className="login-card">
                <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                {error && <div className="error">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="input-group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                required={isRegister}
                            />
                        </div>
                    )}
                    
                    <div className="input-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading 
                            ? (isRegister ? 'Creating Account...' : 'Logging in...') 
                            : (isRegister ? 'Create Account' : 'Login')}
                    </button>

                    <div className="toggle-form">
                        <p>
                            {isRegister 
                                ? 'Already have an account? ' 
                                : "Don't have an account? "}
                            <span onClick={() => setIsRegister(!isRegister)}>
                                {isRegister ? 'Login' : 'Register'}
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </LoginStyled>
    );
};

const LoginStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: rgba(252, 246, 249, 0.78);
    backdrop-filter: blur(4.5px);

    .login-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 400px;

        h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: rgba(34, 34, 96, 1);
        }

        .error {
            color: red;
            margin-bottom: 1rem;
            text-align: center;
        }

        .input-group {
            margin-bottom: 1rem;

            input {
                width: 100%;
                padding: 0.8rem;
                border: 1px solid #ddd;
                border-radius: 0.5rem;
                font-size: 1rem;

                &:focus {
                    outline: none;
                    border-color: rgba(34, 34, 96, 0.6);
                }
            }
        }

        button {
            width: 100%;
            padding: 0.8rem;
            background: rgba(34, 34, 96, 1);
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background: rgba(34, 34, 96, 0.8);
            }

            &:disabled {
                background: rgba(34, 34, 96, 0.5);
                cursor: not-allowed;
            }
        }

        .toggle-form {
            margin-top: 1rem;
            text-align: center;
            color: rgba(34, 34, 96, 0.6);

            span {
                color: rgba(34, 34, 96, 1);
                cursor: pointer;
                font-weight: 500;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
`;

export default Login;

