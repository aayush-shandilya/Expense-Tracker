const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const multer = require('multer');
//const { GridFsStorage } = require('multer-gridfs-storage');
const upload = multer({ storage: multer.memoryStorage() });


// // Configure GridFS storage
// const storage = new GridFsStorage({
//     url: process.env.MONGO_URL,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         return {
//             bucketName: 'uploads',
//             filename: `${Date.now()}-${file.originalname}`
//         };
//     }
// });


const { 
    addIncome,
    getIncomes,
    deleteIncome,
    getIncomeFile
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

// //router.post('/add-income', addIncome);
// router.get('/get-incomes', getIncomes);
// router.delete('/delete-income/:id', deleteIncome);
// router.post('/add-income', upload.single('file'), addIncome);
// router.get('/get-income-file/:id', protect, getIncomeFile);

// Income routes with file upload
router.post('/add-income', upload.single('file'), addIncome);
router.get('/get-incomes', getIncomes);
router.delete('/delete-income/:id', deleteIncome);
router.get('/get-income-file/:id', getIncomeFile);

router.post('/add-expense', addExpense);
router.get('/get-expenses', getExpense);
router.delete('/delete-expense/:id', deleteExpense);

router.post('/add-category', addCategory);
router.get('/get-categories', getCategories);
router.delete('/delete-category/:id', deleteCategory);
router.get('/check-category/:id', checkCategory);

module.exports = router;