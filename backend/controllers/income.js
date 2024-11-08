// const Income = require("../models/incomeModel");
// const mongoose = require('mongoose');
// const { GridFSBucket } = require('mongodb');

// exports.addIncome = async (req, res) => {
//     try {
//         const { title, amount, category, description, date } = req.body;
//         const userId = req.user._id;

//         if (!title || !category || !description || !date) {
//             return res.status(400).json({ success: false, error: 'All fields are required!' });
//         }
//         if (amount <= 0 || !amount === 'number') {
//             return res.status(400).json({ success: false, error: 'Amount must be a positive number!' });
//         }

//         const income = await Income.create({
//             title,
//             amount,
//             category,
//             description,
//             date,
//             user: userId,
//             type: 'income'
//         });

//         return res.status(201).json({
//             success: true,
//             data: income
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };


// controllers/income.js
const Income = require("../models/incomeModel");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');  // Import ObjectId

//const { GridFSBucket } = require('mongodb');

// // Helper function to get GridFS bucket
// const getBucket = (db) => {
//     return new GridFSBucket(db, {
//         bucketName: 'uploads'
//     });
// };

// exports.addIncome = async (req, res) => {
//     try {
//         const { title, amount, category, description, date } = req.body;
//         const userId = req.user._id;
//         const file = req.file; // Assuming you're using multer middleware

//         if (!title || !category || !description || !date) {
//             return res.status(400).json({ success: false, error: 'All fields are required!' });
//         }
//         if (amount <= 0 || !amount === 'number') {
//             return res.status(400).json({ success: false, error: 'Amount must be a positive number!' });
//         }

//         const incomeData = {
//             title,
//             amount,
//             category,
//             description,
//             date,
//             user: userId,
//             type: 'income'
//         };

//         // If file is uploaded, add file information
//         if (file) {
//             incomeData.fileId = file.id;
//             incomeData.fileName = file.originalname;
//             incomeData.fileType = file.mimetype;
//         }

//         const income = await Income.create(incomeData);

//         return res.status(201).json({
//             success: true,
//             data: income
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// exports.getIncomes = async (req, res) => {
//     try {
//         const userId = req.user._id;
        
//         const incomes = await Income.find({ user: userId })
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             success: true,
//             count: incomes.length,
//             data: incomes
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// exports.deleteIncome = async (req, res) => {
//     try {
//         const incomeId = req.params.id;
//         const userId = req.user._id;

//         const income = await Income.findOne({
//             _id: incomeId,
//             user: userId
//         });

//         if (!income) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Income not found or you are not authorized to delete it!'
//             });
//         }

//         // If there's an attached file, delete it first
//         if (income.fileId) {
//             const bucket = getBucket(mongoose.connection.db);
//             await bucket.delete(income.fileId);
//         }

//         // Delete the income record
//         await Income.deleteOne({ _id: incomeId });

//         return res.status(200).json({
//             success: true,
//             message: 'Income deleted successfully'
//         });
//     } catch (error) {
//         console.error('Error in deleteIncome:', error);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// // New endpoint to get file
// exports.getIncomeFile = async (req, res) => {
//     try {
//         const incomeId = req.params.id;
//         const userId = req.user._id;

//         const income = await Income.findOne({
//             _id: incomeId,
//             user: userId
//         });

//         if (!income || !income.fileId) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'File not found!'
//             });
//         }

//         const bucket = getBucket(mongoose.connection.db);
//         const downloadStream = bucket.openDownloadStream(income.fileId);

//         res.set('Content-Type', income.fileType);
//         res.set('Content-Disposition', `attachment; filename="${income.fileName}"`);

//         downloadStream.pipe(res);
//     } catch (error) {
//         console.error('Error in getIncomeFile:', error);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };
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

// exports.getIncomeFile = async (req, res) => {
//     try {
//         const incomeId = req.params.id;
//         const userId = req.user._id;

//         const income = await Income.findOne({
//             _id: incomeId,
//             user: userId
//         });

//         if (!income || !income.fileId) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'File not found!'
//             });
//         }

//         const downloadStream = req.bucket.openDownloadStream(income.fileId);
        
//         res.set('Content-Type', income.fileType);
//         res.set('Content-Disposition', `attachment; filename="${income.fileName}"`);

//         downloadStream.pipe(res);
//     } catch (error) {
//         console.error('Error in getIncomeFile:', error);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// exports.getIncomeFile = async (req, res) => {
//     try {
//         const incomeId = req.params.id;
//         const userId = req.user._id;

//         const income = await Income.findOne({
//             _id: incomeId,
//             user: userId
//         });

//         if (!income || !income.fileId) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'File not found!'
//             });
//         }

//         // Set proper headers for file download
//         res.set({
//             'Content-Type': income.fileType,
//             'Content-Disposition': `attachment; filename="${income.fileName}"`,
//             'Content-Description': 'File Transfer',
//             'Cache-Control': 'no-cache',
//             'Pragma': 'no-cache',
//             'Expires': '0'
//         });

//         const downloadStream = req.bucket.openDownloadStream(new ObjectId(income.fileId));

//         // Handle errors during streaming
//         downloadStream.on('error', (error) => {
//             console.error('Error streaming file:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Error downloading file'
//             });
//         });

//         // Pipe the file to response
//         downloadStream.pipe(res);
//     } catch (error) {
//         console.error('Error in getIncomeFile:', error);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// exports.getIncomeFile = async (req, res) => {
//     try {
//       const incomeId = req.params.id;
//       const userId = req.user._id;
      
//       const income = await Income.findOne({ _id: incomeId, user: userId });
      
//       if (!income || !income.fileId) {
//         return res.status(404).json({ success: false, error: 'File not found!' });
//       }
  
//       // Set proper headers for file download
//       res.set({
//         'Content-Type': income.fileType,
//         'Content-Disposition': `attachment; filename="${income.fileName}"`,
//         'Content-Description': 'File Transfer',
//         'Cache-Control': 'no-cache',
//         'Pragma': 'no-cache',
//         'Expires': '0'
//       });
  
//       const downloadStream = req.bucket.openDownloadStream(new ObjectId(income.fileId));
  
//       // Handle errors during streaming
//       downloadStream.on('error', (error) => {
//         console.error('Error streaming file:', error);
//         // Only send error response if headers haven't been sent
//         if (!res.headersSent) {
//           res.status(500).json({ success: false, error: 'Error downloading file' });
//         }
//       });
  
//       // Pipe the file to response
//       downloadStream.pipe(res);
//     } catch (error) {
//       console.error('Error in getIncomeFile:', error);
//       return res.status(500).json({ success: false, error: error.message });
//     }
//   };
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

// exports.deleteIncome = async (req, res) => {
//     try {
//         const incomeId = req.params.id;
//         const userId = req.user._id;

//         // Add logging to debug
//         console.log(`Attempting to delete income ${incomeId} for user ${userId}`);

//         const income = await Income.findOneAndDelete({
//             _id: incomeId,
//             user: userId
//         });

//         if (!income) {
//             console.log('Income not found or unauthorized');
//             return res.status(404).json({
//                 success: false,
//                 error: 'Income not found or you are not authorized to delete it!'
//             });
//         }

//         console.log('Income deleted successfully');
//         return res.status(200).json({
//             success: true,
//             message: 'Income deleted successfully'
//         });
//     } catch (error) {
//         console.error('Error in deleteIncome:', error);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };