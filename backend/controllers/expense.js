const Expense = require("../models/ExpenseModel");

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, categories, description, date } = req.body;
        const userId = req.user._id;

        // Debug logging
        console.log('Adding expense for user:', userId);
        console.log('Expense data:', { title, amount, categories, description, date });

        // Updated validation logic
        if (!title || !description || !date) {
            return res.status(400).json({ success: false, error: 'All fields are required!' });
        }

        // Validate categories
        if (!categories || (Array.isArray(categories) && categories.length === 0)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please select at least one category!' 
            });
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Amount must be a positive number!' 
            });
        }

        // Ensure categories is always an array
        const categoriesArray = Array.isArray(categories) ? categories : [categories];

        const expense = await Expense.create({
            title,
            amount: numericAmount,
            categories: categoriesArray,
            description,
            date,
            user: userId,
            type: 'expense'
        });

        return res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error('Error in addExpense:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
exports.getExpense = async (req, res) => {
    try {
        const userId = req.user._id;
        const expenses = await Expense.find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user._id;
        
        console.log(`Attempting to delete expense ${expenseId} for user ${userId}`);
        
        const expense = await Expense.findOneAndDelete({
            _id: expenseId,
            user: userId
        });

        if (!expense) {
            console.log('Expense not found or unauthorized');
            return res.status(404).json({
                success: false,
                error: 'Expense not found or you are not authorized to delete it!'
            });
        }

        console.log('Expense deleted successfully');
        return res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteExpense:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};






