
// controllers/income.js
const Income = require("../models/incomeModel");

exports.addIncome = async (req, res) => {
    try {
        const { title, amount, category, description, date } = req.body;
        const userId = req.user._id;

        if (!title || !category || !description || !date) {
            return res.status(400).json({ success: false, error: 'All fields are required!' });
        }
        if (amount <= 0 || !amount === 'number') {
            return res.status(400).json({ success: false, error: 'Amount must be a positive number!' });
        }

        const income = await Income.create({
            title,
            amount,
            category,
            description,
            date,
            user: userId,
            type: 'income'
        });

        return res.status(201).json({
            success: true,
            data: income
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const incomes = await Income.find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: incomes.length,
            data: incomes
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const incomeId = req.params.id;
        const userId = req.user._id;

        // Add logging to debug
        console.log(`Attempting to delete income ${incomeId} for user ${userId}`);

        const income = await Income.findOneAndDelete({
            _id: incomeId,
            user: userId
        });

        if (!income) {
            console.log('Income not found or unauthorized');
            return res.status(404).json({
                success: false,
                error: 'Income not found or you are not authorized to delete it!'
            });
        }

        console.log('Income deleted successfully');
        return res.status(200).json({
            success: true,
            message: 'Income deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteIncome:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};