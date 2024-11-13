const Expense = require("../models/ExpenseModel");
const { ObjectId } = require('mongodb');
const mammoth = require('mammoth');

exports.addExpense = async (req, res) => {
    try {
        const { title, amount, categories, description, date } = req.body;
        const userId = req.user._id;
        const file = req.file;

        // Debug logging
        console.log('Adding expense for user:', userId);
        console.log('Expense data:', { title, amount, categories, description, date });
        if (file) console.log('File data:', { name: file.originalname, type: file.mimetype });

        // Validation
        if (!title || !description || !date) {
            return res.status(400).json({ success: false, error: 'All fields are required!' });
        }

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

        // Prepare expense data
        const expenseData = {
            title,
            amount: numericAmount,
            categories: Array.isArray(categories) ? categories : [categories],
            description,
            date,
            user: userId,
            type: 'expense'
        };

        // Handle file upload if present
        if (file) {
            const fileId = new ObjectId();
            const uploadStream = req.bucket.openUploadStreamWithId(fileId, file.originalname);
            uploadStream.write(file.buffer);
            uploadStream.end();

            expenseData.fileId = fileId;
            expenseData.fileName = file.originalname;
            expenseData.fileType = file.mimetype;
        }

        const expense = await Expense.create(expenseData);

        return res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error('Error in addExpense:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get total count
        const totalCount = await Expense.countDocuments({ user: userId });

        // Get records for current page
        const expenses = await Expense.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            data: expenses,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalItems: totalCount,
            hasMore: skip + expenses.length < totalCount
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};


exports.getExpenseFile = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user._id;
        
        const expense = await Expense.findOne({ _id: expenseId, user: userId });
        
        if (!expense || !expense.fileId) {
            return res.status(404).json({ success: false, error: 'File not found!' });
        }

        // Check if preview mode is requested
        const isPreview = req.query.preview === 'true';

        if (isPreview) {
            const chunks = [];
            const downloadStream = req.bucket.openDownloadStream(new ObjectId(expense.fileId));
            
            downloadStream.on('data', chunk => chunks.push(chunk));
            
            downloadStream.on('error', (error) => {
                console.error('Error streaming file:', error);
                res.status(500).json({ success: false, error: 'Error reading file' });
            });
            
            downloadStream.on('end', async () => {
                const buffer = Buffer.concat(chunks);
                
                try {
                    if (expense.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        // Convert DOCX to text
                        const result = await mammoth.extractRawText({ buffer });
                        res.json({
                            success: true,
                            data: {
                                content: result.value,
                                fileName: expense.fileName,
                                fileType: expense.fileType
                            }
                        });
                    } else if (expense.fileType.includes('text') || expense.fileType.includes('application/json')) {
                        // Handle text files
                        const fileContent = buffer.toString('utf-8');
                        res.json({
                            success: true,
                            data: {
                                content: fileContent,
                                fileName: expense.fileName,
                                fileType: expense.fileType
                            }
                        });
                    } else {
                        return res.status(400).json({
                            success: false,
                            error: 'Preview is not available for this file type'
                        });
                    }
                } catch (error) {
                    console.error('Error converting file:', error);
                    res.status(500).json({ success: false, error: 'Error converting file' });
                }
            });
        } else {
            // Normal file download
            res.set({
                'Content-Type': expense.fileType,
                'Content-Disposition': `attachment; filename="${expense.fileName}"`,
                'Content-Description': 'File Transfer',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
            });

            const downloadStream = req.bucket.openDownloadStream(new ObjectId(expense.fileId));
            
            downloadStream.on('error', (error) => {
                console.error('Error streaming file:', error);
                if (!res.headersSent) {
                    res.status(500).json({ success: false, error: 'Error downloading file' });
                }
            });

            downloadStream.pipe(res);
        }
    } catch (error) {
        console.error('Error in getExpenseFile:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user._id;

        console.log(`Attempting to delete expense ${expenseId} for user ${userId}`);

        const expense = await Expense.findOne({
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

        // Delete associated file if it exists
        if (expense.fileId) {
            await req.bucket.delete(expense.fileId);
        }

        await Expense.deleteOne({ _id: expenseId });

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

exports.getTotalExpense = async (req, res) => {
    try {
      const userId = req.user._id;
      
      const result = await Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      
      const total = result.length > 0 ? result[0].total : 0;
  
      return res.status(200).json({
        success: true,
        total: total
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  };