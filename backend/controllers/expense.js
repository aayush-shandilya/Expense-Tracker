// // const Expense = require("../models/ExpenseModel"); // Correct model import

// // // Add Expense
// // exports.addExpense = async (req, res) => {
// //     const { title, amount, category, description, date } = req.body;

// //     const expense = new Expense({
// //         title,
// //         amount,
// //         category,
// //         description,
// //         date
// //     });

// //     try {
// //         // Validation
// //         if (!title || !category || !description || !date) {
// //             return res.status(400).json({ message: "Please fill all fields" });
// //         }

// //         if (amount <= 0 || typeof amount !== 'number') {
// //             return res.status(400).json({ message: "Amount should be a valid number greater than 0" });
// //         }

// //         await expense.save(); // Save the new expense record to the database
// //         res.status(200).json({ message: 'Expense Added' });
// //     } catch (error) {
// //         return res.status(500).json({ message: "Server Error" });
// //     }
// //     console.log(expense);
// // };

// // // Get Expenses
// // exports.getExpense = async (req, res) => {
// //     try {
// //         const expenses = await Expense.find().sort({ createdAt: -1 }); // Find all expenses, sorted by newest first
// //         res.status(200).json(expenses); // Return the list of expenses
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // };

// // // Delete Expense
// // exports.deleteExpense = async (req, res) => {
// //     const { id } = req.params;
// //     console.log(req.params);

// //     Expense.findByIdAndDelete(id)
// //         .then((expense) => {
// //             if (!expense) {
// //                 return res.status(404).json({ message: 'Expense not found' });
// //             }
// //             res.status(200).json({ message: 'Expense Deleted' });
// //         })
// //         .catch((err) => {
// //             res.status(500).json({ message: 'Server Error' });
// //         });
// // };


// // const ExpenseModel = require("../models/ExpenseModel")

// // exports.addExpense = async (req, res) => {
// //     const { title, amount, category, description, date } = req.body;

// //     const expense = new ExpenseModel({
// //         title,
// //         amount,
// //         category,
// //         description,
// //         date
// //     });

// //     try {
// //         // validation
// //         if (!title || !category || !description || !date) {
// //             return res.status(400).json({ message: "Please fill all fields" });
// //         }

// //         if (amount <= 0 || typeof amount !== 'number') {
// //             return res.status(400).json({ message: "Amount should be a valid number greater than 0" });
// //         }

// //         await expense.save();
// //         res.status(200).json({ message: 'Expense Added' });
// //     } catch (error) {
// //         return res.status(500).json({ message: "Server Error" });
// //     }
// // }

// // exports.getExpense = async (req, res) => {
// //     try {
// //         const expenses = await ExpenseModel.find().sort({createdAt: -1});
// //         res.status(200).json(expenses)
// //     } catch (error) {
// //         res.status(500).json({message: 'Server Error'})
// //     }
// // }

// // exports.deleteExpense = async (req, res) => {
// //     const {id} = req.params;
// //     ExpenseModel.findByIdAndDelete(id)
// //         .then((expense) => {
// //             res.status(200).json({message: 'Expense Deleted'})
// //         })
// //         .catch((err) => {
// //             res.status(500).json({message: 'Server Error'})
// //         })
// // }

// // const Expense = require("../models/ExpenseModel"); // Correct model import
// // exports.addExpense = async (req, res) => {
// //     const { title, amount, category, description, date } = req.body;

// //     try {
// //         if (!title || !category || !description || !date || amount === undefined) {
// //             return res.status(400).json({ message: "Please fill all fields" });
// //         }

// //         if (amount <= 0 || typeof amount !== 'number') {
// //             return res.status(400).json({ message: "Amount should be a valid number greater than 0" });
// //         }

// //         const expense = new ExpenseModel({
// //             title, amount, category, description, date, user: req.user.id  // Assuming user ID is linked
// //         });

// //         await expense.save();
// //         res.status(200).json({ message: 'Expense Added', data: expense });
// //     } catch (error) {
// //         return res.status(500).json({ message: "Server Error", error: error.message });
// //     }
// // };

// // exports.getExpense = async (req, res) => {
// //     try {
// //         const expenses = await ExpenseModel.find({ user: req.user.id }).sort({ createdAt: -1 });
// //         res.status(200).json(expenses);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server Error', error: error.message });
// //     }
// // };

// // exports.deleteExpense = async (req, res) => {
// //     const { id } = req.params;

// //     try {
// //         const expense = await ExpenseModel.findById(id);
// //         if (!expense) {
// //             return res.status(404).json({ message: 'Expense not found' });
// //         }

// //         await expense.remove();
// //         res.status(200).json({ message: 'Expense Deleted', data: expense });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server Error', error: error.message });
// //     }
// // };






// // controllers/expense.js
// const Expense = require("../models/ExpenseModel");

// exports.addExpense = async (req, res) => {
//     const { title, amount, category, description, date } = req.body;

//     try {
//         if (!title || !category || !description || !date || amount === undefined) {
//             return res.status(400).json({ message: "Please fill all fields" });
//         }

//         if (amount <= 0 || typeof amount !== 'number') {
//             return res.status(400).json({ message: "Amount should be a valid number greater than 0" });
//         }

//         // Create expense with user ID from authenticated request
//         const expense = new Expense({
//             title,
//             amount,
//             category,
//             description,
//             date,
//             user: req.user.id  // Add the authenticated user's ID
//         });

//         await expense.save();
//         res.status(200).json({ message: 'Expense Added', data: expense });
//     } catch (error) {
//         return res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

// exports.getExpense = async (req, res) => {
//     try {
//         // Only fetch expenses for the logged-in user
//         const expenses = await Expense.find({ user: req.user.id })
//             .sort({ createdAt: -1 });
//         res.status(200).json(expenses);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// exports.deleteExpense = async (req, res) => {
//     const { id } = req.params;

//     try {
//         // Find expense and ensure it belongs to the logged-in user
//         const expense = await Expense.findOne({ 
//             _id: id,
//             user: req.user.id  // Only delete if it belongs to the user
//         });

//         if (!expense) {
//             return res.status(404).json({ message: 'Expense not found or unauthorized' });
//         }

//         await expense.remove();
//         res.status(200).json({ message: 'Expense Deleted', data: expense });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };




// // controllers/expense.js
// const Expense = require("../models/ExpenseModel");

// exports.addExpense = async (req, res) => {
//     try {
//         const { title, amount, category, description, date } = req.body;
//         // Debug log
//         console.log('Received expense data:', { title, amount, category, description, date, user });
//         console.log('Authenticated user:', req.user._id);

//         const userId = req.user._id;

//         if (!title || !category || !description || !date) {
//             return res.status(400).json({ success: false, error: 'All fields are required!' });
//         }
//         if (amount <= 0 || !amount === 'number') {
//             return res.status(400).json({ success: false, error: 'Amount must be a positive number!' });
//         }

//         const expense = await Expense.create({
//             title,
//             amount,
//             category,
//             description,
//             date,
//             user: userId,
//             type: 'expense'
//         });

//         return res.status(201).json({
//             success: true,
//             data: expense
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };



// // controllers/expense.js
// const Expense = require("../models/ExpenseModel");

// exports.addExpense = async (req, res) => {
//     try {
//         const { title, amount, category, description, date } = req.body;
//         const userId = req.user._id;  // Get user ID from authenticated request

//         // Debug logging
//         console.log('Adding expense for user:', userId);
//         console.log('Expense data:', { title, amount, category, description, date });

//         if (!title || !category || !description || !date) {
//             return res.status(400).json({ success: false, error: 'All fields are required!' });
//         }

//         const numericAmount = parseFloat(amount);
//         if (isNaN(numericAmount) || numericAmount <= 0) {
//             return res.status(400).json({ success: false, error: 'Amount must be a positive number!' });
//         }

//         const expense = await Expense.create({
//             title,
//             amount: numericAmount,
//             category,
//             description,
//             date,
//             user: userId,  // Use the authenticated user's ID
//             type: 'expense'
//         });

//         return res.status(201).json({
//             success: true,
//             data: expense
//         });
//     } catch (error) {
//         console.error('Error in addExpense:', error);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };
// exports.getExpense = async (req, res) => {
//         try {
//             const userId = req.user._id;
            
//             const expenses = await Expense.find({ user: userId })
//                 .sort({ createdAt: -1 });
    
//             return res.status(200).json({
//                 success: true,
//                 count: expenses.length,
//                 data: expenses
//             });
//         } catch (error) {
//             return res.status(500).json({ success: false, error: error.message });
//         }
//     };
    
//     exports.deleteExpense = async (req, res) => {
//         try {
//             const expenseId = req.params.id;
//             const userId = req.user._id;
    
//             console.log(`Attempting to delete expense ${expenseId} for user ${userId}`);
    
//             const expense = await Expense.findOneAndDelete({
//                 _id: expenseId,
//                 user: userId
//             });
    
//             if (!expense) {
//                 console.log('Expense not found or unauthorized');
//                 return res.status(404).json({
//                     success: false,
//                     error: 'Expense not found or you are not authorized to delete it!'
//                 });
//             }
    
//             console.log('Expense deleted successfully');
//             return res.status(200).json({
//                 success: true,
//                 message: 'Expense deleted successfully'
//             });
//         } catch (error) {
//             console.error('Error in deleteExpense:', error);
//             return res.status(500).json({ success: false, error: error.message });
//         }
//     };





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






// // controllers/expense.js
// const Expense = require("../models/ExpenseModel");

// exports.addExpense = async (req, res) => {
//     try {
//         const { title, amount, category, description, date } = req.body;
//         const userId = req.user._id;  // Get user ID from authenticated request

//         // Debug logging
//         console.log('Adding expense for user:', userId);
//         console.log('Expense data:', { title, amount, category, description, date });

//         if (!title || !category || !description || !date) {
//             return res.status(400).json({ success: false, error: 'All fields are required!' });
//         }

//         const numericAmount = parseFloat(amount);
//         if (isNaN(numericAmount) || numericAmount <= 0) {
//             return res.status(400).json({ success: false, error: 'Amount must be a positive number!' });
//         }

//         const expense = await Expense.create({
//             title,
//             amount: numericAmount,
//             category,
//             description,
//             date,
//             user: userId,  // Use the authenticated user's ID
//             type: 'expense'
//         });

//         return res.status(201).json({
//             success: true,
//             data: expense
//         });
//     } catch (error) {
//         console.error('Error in addExpense:', error);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// exports.getExpense = async (req, res) => {
//     try {
//         const userId = req.user._id;
        
//         const expenses = await Expense.find({ user: userId })
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             success: true,
//             count: expenses.length,
//             data: expenses
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// exports.deleteExpense = async (req, res) => {
//     try {
//         const expenseId = req.params.id;
//         const userId = req.user._id;

//         console.log(`Attempting to delete expense ${expenseId} for user ${userId}`);

//         const expense = await Expense.findOneAndDelete({
//             _id: expenseId,
//             user: userId
//         });

//         if (!expense) {
//             console.log('Expense not found or unauthorized');
//             return res.status(404).json({
//                 success: false,
//                 error: 'Expense not found or you are not authorized to delete it!'
//             });
//         }

//         console.log('Expense deleted successfully');
//         return res.status(200).json({
//             success: true,
//             message: 'Expense deleted successfully'
//         });
//     } catch (error) {
//         console.error('Error in deleteExpense:', error);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };