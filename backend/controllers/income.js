// controllers/income.js
const Income = require("../models/incomeModel");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
exports.addIncome = async (req, res) => {
    try {
        const { title, amount, category, description, date } = req.body;
        const userId = req.user._id;
        const file = req.file;

        if (!title || !category || !description || !date) {
            return res.status(400).json({ success: false, error: 'All fields are required!' });
        }
        if (amount <= 0 || !amount === 'number') {
            return res.status(400).json({ success: false, error: 'Amount must be a positive number!' });
        }

        const incomeData = {
            title,
            amount,
            category,
            description,
            date,
            user: userId,
            type: 'income'
        };

        // Handle file upload if present
        if (file) {
            const fileId = new ObjectId();
            const uploadStream = req.bucket.openUploadStreamWithId(fileId, file.originalname);
            uploadStream.write(file.buffer);
            uploadStream.end();

            incomeData.fileId = fileId;
            incomeData.fileName = file.originalname;
            incomeData.fileType = file.mimetype;
        }

        const income = await Income.create(incomeData);

        return res.status(201).json({
            success: true,
            data: income
        });
    } catch (error) {
        console.error('Error in addIncome:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
const mammoth = require('mammoth');

exports.getIncomeFile = async (req, res) => {
  try {
    const incomeId = req.params.id;
    const userId = req.user._id;
    
    const income = await Income.findOne({ _id: incomeId, user: userId });
    
    if (!income || !income.fileId) {
      return res.status(404).json({ success: false, error: 'File not found!' });
    }

    // Check if preview mode is requested
    const isPreview = req.query.preview === 'true';

    if (isPreview) {
      const chunks = [];
      const downloadStream = req.bucket.openDownloadStream(new ObjectId(income.fileId));
      
      downloadStream.on('data', chunk => chunks.push(chunk));
      
      downloadStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        res.status(500).json({ success: false, error: 'Error reading file' });
      });
      
      downloadStream.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        
        try {
          if (income.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Convert DOCX to text
            const result = await mammoth.extractRawText({ buffer });
            res.json({
              success: true,
              data: {
                content: result.value,
                fileName: income.fileName,
                fileType: income.fileType
              }
            });
          } else if (income.fileType.includes('text') || income.fileType.includes('application/json')) {
            // Handle text files
            const fileContent = buffer.toString('utf-8');
            res.json({
              success: true,
              data: {
                content: fileContent,
                fileName: income.fileName,
                fileType: income.fileType
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
        'Content-Type': income.fileType,
        'Content-Disposition': `attachment; filename="${income.fileName}"`,
        'Content-Description': 'File Transfer',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      const downloadStream = req.bucket.openDownloadStream(new ObjectId(income.fileId));
      
      downloadStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        if (!res.headersSent) {
          res.status(500).json({ success: false, error: 'Error downloading file' });
        }
      });

      downloadStream.pipe(res);
    }
  } catch (error) {
    console.error('Error in getIncomeFile:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
    try {
        const incomeId = req.params.id;
        const userId = req.user._id;

        const income = await Income.findOne({
            _id: incomeId,
            user: userId
        });

        if (!income) {
            return res.status(404).json({
                success: false,
                error: 'Income not found or you are not authorized to delete it!'
            });
        }

        // Delete associated file if it exists
        if (income.fileId) {
            await req.bucket.delete(income.fileId);
        }

        await Income.deleteOne({ _id: incomeId });

        return res.status(200).json({
            success: true,
            message: 'Income deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteIncome:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};



// In your backend route handler
exports.getIncomes = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      const incomes = await Income.find({ user: req.user.id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);

      const total = await Income.countDocuments({ user: req.user.id });

      res.status(200).json({
          success: true,
          data: incomes,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasMore: skip + incomes.length < total
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message
      });
  }
};


// controllers/income.js
exports.getTotalIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Aggregate to calculate total amount
    const result = await Income.aggregate([
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