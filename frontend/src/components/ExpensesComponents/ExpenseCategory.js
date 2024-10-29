import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import { EXPENSE_CATEGORIES, getAllCategories, getCategoryIcon, getCategoryLabel } from '../../config/categories';
import Button from '../Button/Button';
//import { plus } from '../../utils/icon';
import { updateCategories } from '../../config/categories';
import AddCategoryModal from '../Modals/AddCategoryModels';
import DeleteCategoryModal from '../Modals/DeleteCateoryModal';
import { plus, trash } from '../../utils/icon';


function ExpensesCategory() {
    const {
        expenses,
        getExpenses,
        user,
        loading,
        error,
        getCategories, // Add this from globalContext
        customCategories // Add this from globalContext
    } = useGlobalContext();

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // Add state for categories
    const [categories, setCategories] = useState([]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);


    // All possible categories
    const allCategories = getAllCategories();

    // // Fetch expenses only once when component mounts or user changes
    // useEffect(() => {
    //     if (user) {
    //         getExpenses();
    //     }
    // }, [user]);

    // Fetch both expenses and categories when component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                await Promise.all([
                    getExpenses(),
                    getCategories()
                ]);
            }
        };
        fetchData();
    }, [user]);

    // Update categories when customCategories change
    useEffect(() => {
        const updatedCategories = updateCategories(customCategories);
        setCategories(getAllCategories());
    }, [customCategories]);

    // Process category data with proper error handling and type checking
    // const categoryData = useMemo(() => {
    //     const initialData = allCategories.reduce((acc, category) => {
    //         acc[category] = {
    //             total: 0,
    //             count: 0,
    //             expenses: []
    //         };
    //         return acc;
    //     }, {});

    //     if (!Array.isArray(expenses) || expenses.length === 0) {
    //         return initialData;
    //     }

    //     return expenses.reduce((acc, expense) => {
    //         if (expense && typeof expense === 'object') {
    //             const category = expense.category?.toLowerCase();
    //             if (category && acc[category]) {
    //                 const amount = parseFloat(expense.amount) || 0;
    //                 acc[category].total += amount;
    //                 acc[category].count += 1;
    //                 acc[category].expenses.push(expense);
    //             }
    //         }
    //         return acc;
    //     }, initialData);
    // }, [expenses, allCategories]);

    const categoryData = useMemo(() => {
        const initialData = allCategories.reduce((acc, category) => {
            acc[category] = {
                total: 0,
                count: 0,
                expenses: []
            };
            return acc;
        }, {});
    
        if (!Array.isArray(expenses) || expenses.length === 0) {
            return initialData;
        }
    
        return expenses.reduce((acc, expense) => {
            if (expense && typeof expense === 'object') {
                // Handle multiple categories
                const expenseCategories = Array.isArray(expense.categories) 
                    ? expense.categories 
                    : [expense.category]; // Fallback to single category if categories array not present
    
                expenseCategories.forEach(category => {
                    const categoryKey = category?.toLowerCase();
                    if (categoryKey && acc[categoryKey]) {
                        const amount = parseFloat(expense.amount) || 0;
                        // For multiple categories, divide the amount among categories
                        //const amountPerCategory = amount / expenseCategories.length;
                        
                        acc[categoryKey].total += amount;
                        acc[categoryKey].count += 1;
                        acc[categoryKey].expenses.push({
                            ...expense,
                            //amount: amountPerCategory // Store the divided amount
                            amount:amount
                        });
                    }
                });
            }
            return acc;
        }, initialData);
    }, [expenses, allCategories]);

    // Calculate selected category data with proper error handling
    const selectedCategoryData = useMemo(() => {
        if (selectedCategory === 'all') {
            if (!Array.isArray(expenses)) {
                return { total: 0, count: 0, expenses: [] };
            }
    
            return {
                total: expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0),
                count: expenses.length,
                expenses: expenses.map(expense => ({
                    ...expense,
                    categories: Array.isArray(expense.categories) 
                        ? expense.categories.map(cat => getCategoryLabel(cat)).join(', ')
                        : getCategoryLabel(expense.category)
                }))
            };
        }
    
        return categoryData[selectedCategory] || { total: 0, count: 0, expenses: [] };
    }, [selectedCategory, expenses, categoryData]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    if (!user) {
        return (
            <CategoryStyled>
                <InnerLayout>
                    <div className="error-message">
                        Please log in to view category data.
                    </div>
                </InnerLayout>
            </CategoryStyled>
        );
    }

    return (
        <CategoryStyled>
            <InnerLayout>
            <div className="category-header">
                    <h1>Expenses by Category</h1>
                    <div className="header-actions">
                        <Button
                            name={'Add Category'}
                            icon={plus}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'#FF8C00'}  // Direct color value
                            
                            color={'#fff'}
                            onClick={() => setIsAddModalOpen(true)}
                        />
                        <select 
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="category-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {getCategoryLabel(category)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="category-management">
                    <h3>Manage Categories</h3>
                    <div className="category-list">
                        {categories.filter(cat => cat !== 'all').map(category => (
                            <div key={category} className="category-item">
                                <div className="category-info">
                                    <span className="category-icon">
                                        {getCategoryIcon(category)}
                                    </span>
                                    <span className="category-label">
                                        {getCategoryLabel(category)}
                                    </span>
                                </div>
                                <Button
                                    name={''}
                                    icon={trash}
                                    bPad={'.5rem'}
                                    bRad={'50%'}
                                    bg={'#ff000d'}
                                    color={'#fff'}
                                    onClick={() => {
                                        setSelectedCategoryForDelete({
                                            key: category,
                                            label: getCategoryLabel(category)
                                        });
                                        setIsDeleteModalOpen(true);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="category-details">
                        <div className="category-card">
                            <div className="icon">
                                {selectedCategory !== 'all' && getCategoryIcon(selectedCategory)}
                            </div>
                            <div className="details">
                                <h2>
                                    {selectedCategory === 'all' 
                                        ? 'Total Expenses' 
                                        : getCategoryLabel(selectedCategory)}
                                </h2>
                                <div className="info">
                                    <p className="amount">
                                        ₹{selectedCategoryData.total.toFixed(2).toLocaleString()}
                                    </p>
                                    <p className="count">
                                        {selectedCategoryData.count} transactions
                                    </p>
                                </div>
                            </div>
                        </div>

                        {selectedCategoryData.expenses.length > 0 ? (
                            <div className="transactions-list">
                                <h3>
                                    Recent Transactions in {
                                        selectedCategory === 'all' 
                                            ? 'All Categories' 
                                            : getCategoryLabel(selectedCategory)
                                    }
                                </h3>
                                {/* {selectedCategoryData.expenses
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .slice(0, 5)
                                    .map((expense) => (
                                        <div key={expense._id} className="transaction-item">
                                            <div className="transaction-info">
                                                <p className="title">{expense.title}</p>
                                                <p className="description">{expense.description}</p>
                                                <p className="date">
                                                    {new Date(expense.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <p className="amount">
                                                ₹{parseFloat(expense.amount).toLocaleString()}
                                            </p>
                                        </div>
                                    ))} */}
                                    {selectedCategoryData.expenses
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .slice(0, 5)
                                    .map((expense) => (
                                        <div key={expense._id} className="transaction-item">
                                            <div className="transaction-info">
                                                <p className="title">{expense.title}</p>
                                                <p className="description">{expense.description}</p>
                                                <p className="date">
                                                    {new Date(expense.date).toLocaleDateString()}
                                                </p>
                                                <p className="categories">
                                                    Categories: {
                                                        // If expense has multiple categories (array)
                                                        Array.isArray(expense.categories) && expense.categories.length > 0
                                                            ? expense.categories.map(cat => getCategoryLabel(cat)).join(', ')
                                                        // If expense has single category
                                                        : expense.category
                                                            ? getCategoryLabel(expense.category)
                                                        // Fallback if no category is found
                                                        : "Uncategorized"
                                                    }
                                                </p>
                                            </div>
                                            <p className="amount">
                                                ₹{parseFloat(expense.amount).toLocaleString()} 
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="no-transactions">
                                No transactions found for {
                                    selectedCategory === 'all' 
                                        ? 'any category' 
                                        : getCategoryLabel(selectedCategory)
                                }
                            </div>
                        )}
                    </div>
                )}

                <AddCategoryModal 
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                />
                <DeleteCategoryModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedCategoryForDelete(null);
                    }}
                    category={selectedCategoryForDelete}
                />
            </InnerLayout>
        </CategoryStyled>
    );
}

const CategoryStyled = styled.div`
    .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;

        h1 {
            font-size: 2.5rem;
            font-weight: 600;
        }

        .header-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
    }

    .category-select {
        padding: 0.8rem 1.5rem;
        border: 2px solid #FFFFFF;
        border-radius: 10px;
        background: rgba(252, 246, 249, 0.78);
        font-size: 1.1rem;
        outline: none;
        color: rgba(34, 34, 96, 1);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background: #FCF6F9;
        }
    }

    .category-details {
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 2rem;
        
        .category-card {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 2rem;

            .icon {
                width: 100px;
                height: 100px;
                border-radius: 20px;
                background: rgba(252, 246, 249, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #FFFFFF;
            }

            .details {
                flex: 1;

                h2 {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    color: rgba(34, 34, 96, 1);
                }

                .info {
                    display: flex;
                    gap: 2rem;
                    
                    .amount {
                        font-size: 1.5rem;
                        font-weight: 600;
                        color: var(--color-red);
                    }

                    .count {
                        font-size: 1.2rem;
                        color: rgba(34, 34, 96, 0.6);
                    }
                }
            }
        }

        .transactions-list {
            margin-top: 2rem;
            
            h3 {
                font-size: 1.3rem;
                margin-bottom: 1rem;
                color: rgba(34, 34, 96, 1);
            }

            .transaction-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid rgba(34, 34, 96, 0.1);

                &:last-child {
                    border-bottom: none;
                }

                .transaction-info {
                    .title {
                        font-weight: 500;
                        color: rgba(34, 34, 96, 1);
                        margin-bottom: 0.2rem;
                    }

                    .description {
                        font-size: 0.9rem;
                        color: rgba(34, 34, 96, 0.8);
                        margin-bottom: 0.2rem;
                    }

                    .date {
                        font-size: 0.9rem;
                        color: rgba(34, 34, 96, 0.6);
                    }
                }

                .amount {
                    font-weight: 600;
                    color: var(--color-red);
                }
            }
        }

        .no-transactions {
            text-align: center;
            padding: 2rem;
            color: rgba(34, 34, 96, 0.6);
            font-size: 1.1rem;
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

    .loading {
        background: #FCF6F9;
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    }
    .category-management {
        margin-top: 2rem;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 2rem;

        h3 {
            font-size: 1.5rem;
            color: var(--primary-color);
            margin-bottom: 1.5rem;
        }

        .category-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
        }

        .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: white;
            border-radius: 10px;
            box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.03);

            .category-info {
                display: flex;
                align-items: center;
                gap: 1rem;

                .category-icon {
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .category-label {
                    color: rgba(34, 34, 96, 0.9);
                    font-weight: 500;
                }
            }
        }
    }
`;


export default ExpensesCategory;

