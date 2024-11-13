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
    const [totalIncomeAmount, setTotalIncomeAmount] = useState(0);
    const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);


    const getUserId = () => user?.id || user?._id;

    const getAuthHeader = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
    });
    const addIncome = async (formData) => {
        if (!user) {
            setError('You must be logged in to add income');
            return;
        }
    
        setError(null);
        setLoading(true);
    
        try {
            console.log('FormData contents:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
    
            const response = await fetch(`${BASE_URL}/transactions/add-income`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
    
            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Could not add income');
            }
    
            console.log('Response data:', data);
    
            return { success: true };
        } catch (err) {
            console.error('Error adding income:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };
    

    // const getIncomes = async (page = 1, limit = 5) => {
    //     if (!user) {
    //         setIncomes([]);
    //         return null;
    //     }
    
    //     setError(null);
    //     if (page === 1) {
    //         setLoading(true); // Only show loading for initial page load
    //     }
    
    //     try {
    //         const response = await fetch(
    //             `http://localhost:5001/api/v1/transactions/get-incomes?page=${page}&limit=${limit}`, 
    //             {
    //                 headers: getAuthHeader()
    //             }
    //         );
            
    //         const data = await response.json();
            
    //         if (!response.ok) {
    //             throw new Error(data.message || 'Could not fetch incomes');
    //         }
    
    //         const userIncomes = Array.isArray(data.data) 
    //             ? data.data.filter(income => income.user === getUserId())
    //             : [];
            
    //         // If it's the first page, replace the entire income array
    //         // If it's a subsequent page, append to existing incomes
    //         if (page === 1) {
    //             setIncomes(userIncomes);
    //         } else {
    //             setIncomes(prevIncomes => [...prevIncomes, ...userIncomes]);
    //         }
    
    //         return {
    //             success: true,
    //             data: userIncomes,
    //             hasMore: userIncomes.length >= limit
    //         };
    
    //     } catch (err) {
    //         console.error('Error fetching incomes:', err);
    //         setError(err.message);
    //         if (page === 1) {
    //             setIncomes([]);
    //         }
    //         return {
    //             success: false,
    //             data: [],
    //             hasMore: false
    //         };
    //     } finally {
    //         if (page === 1) {
    //             setLoading(false);
    //         }
    //     }
    // };

    const getIncomes = async (page = 1, limit = 5) => {
        if (!user) {
          setIncomes([]);
          return null;
        }
    
        setError(null);
        if (page === 1) {
          setLoading(true);
        }
    
        try {
          const response = await fetch(
            `http://localhost:5001/api/v1/transactions/get-incomes?page=${page}&limit=${limit}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.error || 'Could not fetch incomes');
          }
    
          if (page === 1) {
            setIncomes(data.data || []);
          } else {
            setIncomes(prevIncomes => [...prevIncomes, ...(data.data || [])]);
          }
    
          return {
            success: true,
            data: data.data,
            hasMore: data.hasMore
          };
        } catch (err) {
          console.error('Error fetching incomes:', err);
          setError(err.message);
          if (page === 1) {
            setIncomes([]);
          }
          return { success: false, data: [], hasMore: false };
        } finally {
          if (page === 1) {
            setLoading(false);
          }
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
            const response = await fetch(`http://localhost:5001/api/v1/transactions/delete-income/${id}`, {
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

const downloadIncomeFile = async (incomeId, fileName, fileType) => {
    if (!user) {
        setError('You must be logged in to download files');
        return { success: false, error: 'Not logged in' };
    }

    setError(null);
    try {
        const isTextFile = fileType?.includes('text') || 
                          fileType?.includes('application/json') ||
                          fileType?.includes('application/xml');

        const url = `${BASE_URL}/transactions/get-income-file/${incomeId}${isTextFile ? '?preview=true' : ''}`;
        
        const response = await fetch(url, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            throw new Error('Failed to download file');
        }

        if (isTextFile) {
            const text = await response.text();
            const blob = new Blob([text], { type: fileType || 'text/plain;charset=utf-8' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName || 'download.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } else {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        }
        
        return { success: true };
    } catch (err) {
        console.error('Error downloading file:', err);
        setError(err.message || 'Error downloading file');
        return { success: false, error: err.message };
    }
};


const addExpense = async (formData) => {
    if (!user) {
        setError('You must be logged in to add expense');
        return { success: false, error: 'Not logged in' };
    }

    setError(null);
    setLoading(true);

    try {
        const response = await fetch(`${BASE_URL}/transactions/add-expense`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Could not add expense');
        }

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

const downloadExpenseFile = async (expenseId, fileName, fileType) => {
    if (!user) {
        setError('You must be logged in to download files');
        return { success: false, error: 'Not logged in' };
    }

    setError(null);
    try {
        const isTextFile = fileType?.includes('text') || 
                          fileType?.includes('application/json') ||
                          fileType?.includes('application/xml');

        const url = `${BASE_URL}/transactions/get-expense-file/${expenseId}${isTextFile ? '?preview=true' : ''}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to download file');
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        return { success: true };
    } catch (err) {
        console.error('Error downloading file:', err);
        setError(err.message || 'Error downloading file');
        return { success: false, error: err.message };
    }
};


// const getExpenses = async () => {
//     if (!user) {
//         setExpenses([]);
//         return;
//     }

//     setError(null);
//     setLoading(true);
//     try {
//         const response = await fetch(`http://localhost:5001/api/v1/transactions/get-expenses`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//         });
        
//         const data = await response.json();
        
//         if (!response.ok) {
//             throw new Error(data.error || 'Could not fetch expenses');
//         }

//         setExpenses(data.data || []);
//     } catch (err) {
//         console.error('Error fetching expenses:', err);
//         setError(err.message);
//         setExpenses([]);
//     } finally {
//         setLoading(false);
//     }
// };

// const getExpenses = async (page = 1, limit = 4) => {
//     if (!user) {
//         setExpenses([]);
//         return null;
//     }

//     setError(null);
//     if (page === 1) {
//         setLoading(true); // Only show loading for initial page
//     }

//     try {
//         const response = await fetch(
//             `http://localhost:5001/api/v1/transactions/get-expenses?page=${page}&limit=${limit}`,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.error || 'Could not fetch expenses');
//         }

//         // If it's the first page, replace the entire expenses array
//         // If it's a subsequent page, append to existing expenses
//         if (page === 1) {
//             setExpenses(data.data || []);
//         } else {
//             setExpenses(prevExpenses => [...prevExpenses, ...(data.data || [])]);
//         }

//         return {
//             success: true,
//             data: data.data,
//             hasMore: data.hasMore
//         };

//     } catch (err) {
//         console.error('Error fetching expenses:', err);
//         setError(err.message);
//         if (page === 1) {
//             setExpenses([]);
//         }
//         return {
//             success: false,
//             data: [],
//             hasMore: false
//         };
//     } finally {
//         if (page === 1) {
//             setLoading(false);
//         }
//     }
// };

const getExpenses = async (page = 1, limit = 4) => {
    if (!user) {
      setExpenses([]);
      return null;
    }

    setError(null);
    if (page === 1) {
      setLoading(true);
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/v1/transactions/get-expenses?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not fetch expenses');
      }

      if (page === 1) {
        setExpenses(data.data || []);
      } else {
        setExpenses(prevExpenses => [...prevExpenses, ...(data.data || [])]);
      }

      return {
        success: true,
        data: data.data,
        hasMore: data.hasMore
      };
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.message);
      if (page === 1) {
        setExpenses([]);
      }
      return { success: false, data: [], hasMore: false };
    } finally {
      if (page === 1) {
        setLoading(false);
      }
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
        const response = await fetch(`http://localhost:5001/api/v1/transactions/delete-expense/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        const data = await response.json();
        console.log('Delete expense response:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Could not delete expense');
        }

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
            const response = await fetch('http://localhost:5001/api/v1/transactions/add-category', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({
                    ...categoryData,
                    user: getUserId(),
                    icon: 'circle' 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Could not add category');
            }

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

    const getCategories = async () => {
        if (!user) {
            setCustomCategories([]);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/v1/transactions/get-categories', {
                headers: getAuthHeader()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Could not fetch categories');
            }

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

const deleteCategory = async (categoryKey) => {
    if (!user) {
        setError('You must be logged in to delete categories');
        return { success: false, error: 'Not logged in' };
    }

    setError(null);
    setLoading(true);

    try {
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

        setCustomCategories(prev => prev.filter(cat => cat.key !== categoryKey));
        
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

    const updateCategory = async (categoryId, updateData) => {
        if (!user) {
            setError('You must be logged in to update categories');
            return { success: false, error: 'Not logged in' };
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5001/api/v1/transactions/update-category/${categoryId}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Could not update category');
            }

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
    const getTotalIncome = async () => {
        if (!user) return;
        
        try {
          const response = await fetch(
            `http://localhost:5001/api/v1/transactions/get-total-income`, 
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          const data = await response.json();
          
          if (response.ok) {
            setTotalIncomeAmount(data.total);
          }
        } catch (err) {
          console.error('Error fetching total income:', err);
        }
      };
    
      const getTotalExpense = async () => {
        if (!user) return;
        
        try {
          const response = await fetch(
            `http://localhost:5001/api/v1/transactions/get-total-expense`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          const data = await response.json();
          
          if (response.ok) {
            setTotalExpenseAmount(data.total);
          }
        } catch (err) {
          console.error('Error fetching total expense:', err);
        }
      };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            downloadIncomeFile,
            deleteIncome,
            addExpense,
            getExpenses,
            expenses,
            downloadExpenseFile,
            deleteExpense,
            
            totalIncomeAmount,
            totalExpenseAmount,
            getTotalIncome,
            getTotalExpense,

            totalIncome,
            totalExpense,
            totalBalance,
            error,
            loading,
            setError,
            transactionHistory,
            user,
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