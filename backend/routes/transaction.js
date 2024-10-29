const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const { 
    addIncome,
    getIncomes,
    deleteIncome 
} = require('../controllers/income');

const {
    addExpense,
    getExpense,
    deleteExpense
} = require('../controllers/expense');

const {
    addCategory,
    getCategories,
    deleteCategory,
    checkCategory,
    updateCategory
} = require('../controllers/category'); 

router.use(protect);

router.post('/add-income', addIncome);
router.get('/get-incomes', getIncomes);
router.delete('/delete-income/:id', deleteIncome);

router.post('/add-expense', addExpense);
router.get('/get-expenses', getExpense);
router.delete('/delete-expense/:id', deleteExpense);

router.post('/add-category', addCategory);
router.get('/get-categories', getCategories);
router.delete('/delete-category/:id', deleteCategory);
router.get('/check-category/:id', checkCategory);

module.exports = router;