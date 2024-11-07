//globalContext.js    
import React, { createContext, useContext, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { DEFAULT_CATEGORIES } from '../config/categories';

const GlobalContext = createContext(null);
const BASE_URL = 'http://localhost:5001/api/v1';


export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [customCategories, setCustomCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Helper to ensure consistent user ID
    const getUserId = () => user?.id || user?._id;

    // Helper for Authorization header
    const getAuthHeader = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`  // Fixed template literal
    });

    const addIncome = async (income) => {
        if (!user) {
            setError('You must be logged in to add income');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/v1/add-income', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({
                    ...income,
                    user: getUserId()
                })
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Could not add income');
            }

            // Update local state only after successful API call
            getIncomes();  // Refresh the full list
            return { success: true };
        } catch (err) {
            console.error('Error adding income:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };



    const getIncomes = async () => {
        if (!user) {
            setIncomes([]);
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/v1/get-incomes`, {
                headers: getAuthHeader()
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Could not fetch incomes');
            }

            // Filter incomes for the current user
            const userIncomes = Array.isArray(data.data) 
                ? data.data.filter(income => income.user === getUserId())
                : [];
            
            setIncomes(userIncomes);
        } catch (err) {
            console.error('Error fetching incomes:', err);
            setError(err.message);
            setIncomes([]);
        } finally {
            setLoading(false);
        }
    };
    const deleteIncome = async (id) => {
        if (!user) {
            setError('You must be logged in to delete income');
            return { success: false, error: 'Not logged in' };
        }

        setError(null);
        setLoading(true);
        
        try {
            const response = await fetch(`http://localhost:5001/api/v1/delete-income/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            console.log('Delete response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Could not delete income');
            }

            setIncomes(prevIncomes => prevIncomes.filter(income => income._id !== id));
            return { success: true };

        } catch (err) {
            console.error('Error deleting income:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

// In your globalContext.js file, update the addExpense function:
const addExpense = async (expense) => {
    if (!user) {
        setError('You must be logged in to add expense');
        return { success: false, error: 'Not logged in' };
    }

    setError(null);
    setLoading(true);

    try {
        // Debug logging
        console.log('Current user:', user);
        console.log('Sending expense data:', { ...expense, user: user._id });

        const response = await fetch('http://localhost:5001/api/v1/add-expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                ...expense,
                categories: Array.isArray(expense.categories) ? expense.categories : [expense.categories], // Convert to array if not already
                user: user._id
            })
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Could not add expense');
        }

        // Update local state after successful addition
        await getExpenses();
        return { success: true };

    } catch (err) {
        console.error('Error adding expense:', err);
        setError(err.message);
        return { success: false, error: err.message };
    } finally {
        setLoading(false);
    }
};


const getExpenses = async () => {
    if (!user) {
        setExpenses([]);
        return;
    }

    setError(null);
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:5001/api/v1/get-expenses`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Could not fetch expenses');
        }

        setExpenses(data.data || []);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        setError(err.message);
        setExpenses([]);
    } finally {
        setLoading(false);
    }
};

const deleteExpense = async (id) => {
    if (!user) {
        setError('You must be logged in to delete expense');
        return { success: false, error: 'Not logged in' };
    }

    setError(null);
    setLoading(true);
    
    try {
        const response = await fetch(`http://localhost:5001/api/v1/delete-expense/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        const data = await response.json();
        console.log('Delete expense response:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Could not delete expense');
        }

        // Update the local state only if delete was successful
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense._id !== id));
        return { success: true };

    } catch (err) {
        console.error('Error deleting expense:', err);
        setError(err.message);
        return { success: false, error: err.message };
    } finally {
        setLoading(false);
    }
};


    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    const totalExpense = () => {
        return expenses
            .filter(expense => expense.user === getUserId())
            .reduce((total, expense) => total + expense.amount, 0);
    };

    const totalBalance = () => {
        return totalIncome() - totalExpense();
    };

    const transactionHistory = () => {
        if (!user) return [];
        
        const allTransactions = [...incomes, ...expenses];
        return allTransactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
    };

    const addCategory = async (categoryData) => {
        if (!user) {
            setError('You must be logged in to add categories');
            return { success: false, error: 'Not logged in' };
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/v1/add-category', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({
                    ...categoryData,
                    user: getUserId(),
                    icon: 'circle' // Default icon
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Could not add category');
            }

            // Update local state
            setCustomCategories(prev => [...prev, data.category]);
            return { success: true, category: data.category };

        } catch (err) {
            console.error('Error adding category:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // New function to get custom categories
    const getCategories = async () => {
        if (!user) {
            setCustomCategories([]);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/v1/get-categories', {
                headers: getAuthHeader()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Could not fetch categories');
            }

            // Filter categories for current user
            const userCategories = Array.isArray(data.categories) 
                ? data.categories.filter(cat => cat.user === getUserId())
                : [];

            setCustomCategories(userCategories);

        } catch (err) {
            console.error('Error fetching categories:', err);
            setError(err.message);
            setCustomCategories([]);
        } finally {
            setLoading(false);
        }
    };

    // New function to delete custom category
    // In your globalContext.js, add or update the deleteCategory function:
// In your GlobalProvider component:
const deleteCategory = async (categoryKey) => {
    if (!user) {
        setError('You must be logged in to delete categories');
        return { success: false, error: 'Not logged in' };
    }

    setError(null);
    setLoading(true);

    try {
        // Check if it's a default category
        if (DEFAULT_CATEGORIES.hasOwnProperty(categoryKey)) {
            setError('Cannot delete default categories');
            return { success: false, error: 'Cannot delete default categories' };
        }

        const response = await fetch(`${BASE_URL}/delete-category/${categoryKey}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Could not delete category');
        }

        // Update categories in state
        setCustomCategories(prev => prev.filter(cat => cat.key !== categoryKey));
        
        // Optionally refresh all categories
        await getCategories();

        return { success: true };

    } catch (err) {
        console.error('Error deleting category:', err);
        setError(err.message);
        return { success: false, error: err.message };
    } finally {
        setLoading(false);
    }
};

    // Update category
    const updateCategory = async (categoryId, updateData) => {
        if (!user) {
            setError('You must be logged in to update categories');
            return { success: false, error: 'Not logged in' };
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5001/api/v1/update-category/${categoryId}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Could not update category');
            }

            // Update local state
            setCustomCategories(prev => 
                prev.map(cat => cat._id === categoryId ? { ...cat, ...updateData } : cat)
            );
            return { success: true, category: data.category };

        } catch (err) {
            console.error('Error updating category:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            addExpense,
            getExpenses,
            expenses,
            deleteExpense,
            totalIncome,
            totalExpense,
            totalBalance,
            error,
            loading,
            setError,
            transactionHistory,
            user,
            // Add new category-related functions
            addCategory,
            getCategories,
            deleteCategory,
            updateCategory,
            customCategories
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);