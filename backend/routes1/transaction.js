const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncomes } = require('../controllers/income')

const router = require('express').Router()

router.post('/add-income', addIncome)
        .get('/get-income', getIncomes)
        .delete('/delete-income/:id',deleteIncomes)

        .post('/add-expense', addExpense)
        .get('/get-expense', getExpense)
        .delete('/delete-expense/:id',deleteExpense)

module.exports = router;