import React, { useContext, useState } from "react";
import axios from 'axios';

const Base_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    //const [ExpenseCategory, setCategory] = useState();

    const addIncome = async (income) => {
        try {
            await axios.post(`${Base_URL}add-income`, income);
            getIncomes();
        } catch (err) {
            setError(err.response ? err.response.data.message : "An error occurred");
        }
    };

    

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${Base_URL}get-incomes`);
            setIncome(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : "An error occurred");
        }
    };

    const getExpenseCategory = async()=>{
        try{
            const response = await axios.get(`${Base_URL}get-ExpenseCategory`);
            setIncome(response.data);
        }
        catch(err)
        {
            setError(err.response ? err.response.data.message:"An error occured");
        }
    };



    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${Base_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            setError(err.response ? err.response.data.message : "An error occurred");
        }
    };

    

    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    

    const addExpense = async (expense) => {
        try {
            await axios.post(`${Base_URL}add-expense`, expense);
            getExpenses();
        } catch (err) {
            setError(err.response ? err.response.data.message : "An error occurred");
        }
    };

    

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${Base_URL}get-expenses`);
            setExpenses(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : "An error occurred");
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${Base_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            setError(err.response ? err.response.data.message : "An error occurred");
        }
    };

    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
        return history.slice(0, 3);
    };

    const addExpenseCategory = async(expenses)=>{
        try{
            await axios.post(`${Base_URL}add-ExpenseCategory`,expenses);
            getExpenseCategory();
        }
        catch(err)
        {
            setError(err.response ? err.response.data.message:"An error occured");
        }
    };

    const deleteExpenseCategory = async(id)=>{
        try{
            await axios.delete(`${Base_URL}delete-ExpemseCategory/${id}`);
            getExpenseCategory();
        }catch(err)
        {
            setError(err.response?err.response.data.message: "An error occured");
        }
    };
    const totalExpenseBasedOnCategory = async(id)=>{
        return expenses.reduce((total,income)=> total+income.amount,0);
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
