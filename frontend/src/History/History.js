
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';
import { useAuth } from '../context/AuthContext';

const History = () => {
    const { transactionHistory, loading, error } = useGlobalContext();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (user) {
            setHistory(transactionHistory);
        }
    }, [user, transactionHistory]);

    if (loading) {
        return (
            <HistoryStyled>
                <h2>Recent History</h2>
                <div className="loading">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="loading-item" />
                    ))}
                </div>
            </HistoryStyled>
        );
    }

    if (error) {
        return (
            <HistoryStyled>
                <h2>Recent History</h2>
                <div className="error">
                    {error}
                </div>
            </HistoryStyled>
        );
    }

    if (!history.length) {
        return (
            <HistoryStyled>
                <h2>Recent History</h2>
                <div className="empty">
                    No transactions yet
                </div>
            </HistoryStyled>
        );
    }

    return (
        <HistoryStyled>
            <h2>Recent History</h2>
            {history.map((item) => {
                const { _id, title, amount, type, createdAt } = item;
                const isExpense = type === 'expense';

                return (
                    <div key={_id} className="history-item">
                        <div className="inner-content">
                            <div className="text">
                                <p className="title">{title}</p>
                                <p className="date">
                                    {new Date(createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className={`amount ${isExpense ? 'expense' : 'income'}`}>
                                {isExpense 
                                    ? `-₹${amount <= 0 ? 0 : amount.toLocaleString()}`
                                    : `+₹${amount <= 0 ? 0 : amount.toLocaleString()}`
                                }
                            </div>
                        </div>
                    </div>
                );
            })}
        </HistoryStyled>
    );
};

const HistoryStyled = styled.div`
    h2 {
        margin: 1rem 0;
        font-size: 1.2rem;
    }

    .history-item {
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        margin-bottom: 1rem;

        .inner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .text {
                .title {
                    font-size: 1.2rem;
                    font-weight: 600;
                }
                .date {
                    font-size: 0.8rem;
                    color: var(--color-gray);
                    margin-top: 0.2rem;
                }
            }

            .amount {
                font-weight: 600;
                font-size: 1.2rem;
                
                &.expense {
                    color: red;
                }
                
                &.income {
                    color: var(--color-green);
                }
            }
        }
    }

    .loading {
        .loading-item {
            height: 4rem;
            background: #eee;
            border-radius: 20px;
            margin-bottom: 1rem;
        }
    }

    .error {
        background: #fee;
        color: red;
        padding: 1rem;
        border-radius: 20px;
    }

    .empty {
        background: #FCF6F9;
        padding: 1rem;
        border-radius: 20px;
        color: var(--color-gray);
        text-align: center;
    }
`;

export default History;