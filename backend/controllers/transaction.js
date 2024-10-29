const Income = require('../models/incomeModel');
const Expense = require('../models/ExpenseModel');

exports.getTransactionHistory = async (req, res) => {
    try {
        // Get recent incomes and expenses
        const [incomes, expenses] = await Promise.all([
            Income.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .limit(5),
            Expense.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        // Combine and sort transactions
        const transactions = [...incomes, ...expenses]
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5);

        return res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};