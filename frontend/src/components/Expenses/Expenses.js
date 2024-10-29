import React, { useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import ExpenseForm from './ExpensesForm';
import IncomeItem from '../IncomeItems/IncomeItems';
import { trash } from '../../utils/icon';

function Expenses() {
    const {
        addExpense,
        expenses,
        getExpenses,
        deleteExpense,
        totalExpense,
        loading,
        error,
        setError,
        user
    } = useGlobalContext();

    useEffect(() => {
        if (user) {
            getExpenses();
        }
    }, [user]);

    const handleDelete = useCallback(async (id) => {
        try {
            const result = await deleteExpense(id);
            if (result.success) {
                console.log('Expense deleted successfully');
                getExpenses(); // Refresh the list after successful deletion
            } else {
                console.error('Failed to delete expense:', result.error);
                setError(result.error);
            }
        } catch (err) {
            console.error('Error in handleDelete:', err);
            setError('Failed to delete expense. Please try again.');
        }
    }, [deleteExpense, setError, getExpenses]);

    const memoizedTotalExpense = useMemo(() => totalExpense(), [expenses]);

    if (!user) {
        return (
            <ExpenseStyled>
                <InnerLayout>
                    <div className="error-message">
                        Please log in to view your expense data.
                    </div>
                </InnerLayout>
            </ExpenseStyled>
        );
    }
    
    const handleFormSubmit = async (formData) => {
        try {
            const result = await addExpense({ ...formData, user: user.id || user._id });
            if (result.success) {
                await getExpenses();
                return true;
            } else {
                setError(result.error || 'Failed to add expense');
                return false;
            }
        } catch (err) {
            console.error('Error adding expense:', err);
            setError('Failed to add expense. Please try again.');
            return false;
        }
    };

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-expense">
                    Total Expense: <span>₹{memoizedTotalExpense.toLocaleString()}</span>
                </h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="expense-content">
                    <div className="form-container">
                        <ExpenseForm onSubmit={handleFormSubmit} />
                    </div>
                    <div className="expenses">
                        {loading ? (
                            <p className="loading">Loading...</p>
                        ) : expenses && expenses.length > 0 ? (
                            expenses.map((expense) => {
                                const {_id, title, amount, date, category, categories, description, type} = expense;
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
                                        categories={categories}
                                        indicatorColor="var(--color-red)"
                                        deleteItem={handleDelete}
                                    />
                                );
                            })
                        ) : (
                            <p className="no-data">No expense records found.</p>
                        )}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
    display: flex;
    overflow: auto;

    .total-expense {
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
            color: var(--color-red);
        }
    }

    .expense-content {
        display: flex;
        gap: 2rem;
        
        .form-container {
            flex: 1;
        }

        .expenses {
            // flex: 1;
            // left: 10px;
            // // width: 50px;
            // right: 10px;
            // position: relative;
            // display: flex;
            // flex-direction: column;
            // gap: 1rem;

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

export default Expenses;