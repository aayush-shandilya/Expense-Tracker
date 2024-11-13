
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
    addIncome,
    getIncomes,
    deleteIncome,
    getIncomeFile,
    getTotalIncome
} = require('../controllers/income');

const {
    addExpense,
    getExpenses,
    deleteExpense,
    getExpenseFile,
    getTotalExpense
} = require('../controllers/expense');

const {
    addCategory,
    getCategories,
    deleteCategory,
    checkCategory,
    updateCategory
} = require('../controllers/category');

router.use(protect);

// Income routes with file upload
router.post('/add-income', upload.single('file'), addIncome);
router.get('/get-incomes', getIncomes);
router.delete('/delete-income/:id', deleteIncome);
router.get('/get-income-file/:id', getIncomeFile);

// Expense routes with file upload
router.post('/add-expense', upload.single('file'), addExpense);
router.get('/get-expenses', getExpenses);
router.delete('/delete-expense/:id', deleteExpense);
router.get('/get-expense-file/:id', getExpenseFile);  // Add new file route

// Category routes
router.post('/add-category', addCategory);
router.get('/get-categories', getCategories);
router.delete('/delete-category/:id', deleteCategory);
router.get('/check-category/:id', checkCategory);


// routes/transactions.js
router.get('/get-total-income',  getTotalIncome);
router.get('/get-total-expense', getTotalExpense);

module.exports = router;