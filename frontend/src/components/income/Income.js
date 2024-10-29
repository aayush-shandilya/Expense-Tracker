
// Income.js (updated version)
import React, { useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Form from '../Form/Form';
import IncomeItem from '../IncomeItems/IncomeItems';

function Income() {
    const {
        addIncome,
        incomes,
        getIncomes,
        deleteIncome,
        totalIncome,
        loading,
        error,
        user
    } = useGlobalContext();

    useEffect(() => {
        if (user) {
            getIncomes();
        }
    }, [user]);

    const handleDelete = useCallback(async (id) => {
        await deleteIncome(id);
        getIncomes(); // Refresh the list after deletion
    }, [deleteIncome, getIncomes]);

    const memoizedTotalIncome = useMemo(() => totalIncome(), [incomes]);

    if (!user) {
        return (
            <IncomeStyled>
                <InnerLayout>
                    <div className="error-message">
                        Please log in to view your income data.
                    </div>
                </InnerLayout>
            </IncomeStyled>
        );
    }

    return (
        <IncomeStyled>
            <InnerLayout>
                <h1>Incomes</h1>
                <h2 className="total-income">
                    Total Income: <span>₹{memoizedTotalIncome.toLocaleString()}</span>
                </h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="income-content">
                    <div className="form-container">
                        <Form 
                            onSubmit={(formData) => {
                                addIncome({ ...formData, user: user.id || user._id })
                                    .then(result => {
                                        if (result.success) {
                                            getIncomes();
                                        }
                                    });
                            }}
                        />
                    </div>
                    <div className="incomes">
                        {loading ? (
                            <p className="loading">Loading...</p>
                        ) : incomes && incomes.length > 0 ? (
                            incomes.map((income) => {
                                const {_id, title, amount, date, category, description, type} = income;
                                return (
                                    <IncomeItem
                                        key={_id}
                                        id={_id} 
                                        title={title} 
                                        description={description} 
                                        amount={amount} 
                                        date={date} 
                                        type={type}
                                        category={category} 
                                        indicatorColor="var(--color-green)"
                                        deleteItem={handleDelete}
                                    />
                                );
                            })
                        ) : (
                            <p className="no-data">No income records found.</p>
                        )}
                    </div>
                </div>
            </InnerLayout>
        </IncomeStyled>
    );
}

const IncomeStyled = styled.div`
    display: flex;
    overflow: auto;

    .total-income {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        
        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }

    .income-content {
        display: flex;
        gap: 2rem;
        
        .form-container {
            flex: 1;
        }

    //     .incomes {
    //         flex: 1;
    //         left: 10px;
    //         width: 100vh;
    //         max-width: 500px;
    //         right: 10px;
    //         position: relative;
    //         display: flex;
    //         flex-direction: column;
    //         gap: 1rem;
    //     }
    // }

    .incomes {
        flex: 1;
        left: 10px;
        max-width: 500px;
        width: calc(100% - 100px); /* Use 100% width with padding */
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 0 10px; /* Margin to prevent touching the sides */
        box-sizing: border-box; /* Include padding in width calculations */
    }

    .error-message {
        background: #ffebee;
        color: #c62828;
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        text-align: center;
    }

    .loading, .no-data {
        background: #FCF6F9;
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    }
`;

export default Income;