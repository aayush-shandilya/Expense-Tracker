// // controllers/category.js
// const Category = require('../models/CategoryModel'); // You'll need to create this model
// const { validationResult } = require('express-validator');

// // @desc    Add category
// // @route   POST /api/v1/add-category
// // @access  Private
// exports.addCategory = async (req, res) => {
//     try {
//         const { key, label, icon } = req.body;

//         // Validate required fields
//         if (!key || !label) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Please provide both key and label for the category'
//             });
//         }

//         // Check if category already exists for this user
//         const existingCategory = await Category.findOne({ 
//             user: req.user.id,
//             key: key.toLowerCase()
//         });

//         if (existingCategory) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Category with this key already exists'
//             });
//         }

//         // Create category
//         const category = await Category.create({
//             key: key.toLowerCase(),
//             label,
//             icon: icon || 'circle',
//             user: req.user.id
//         });

//         return res.status(201).json({
//             success: true,
//             category
//         });

//     } catch (error) {
//         console.error('Error in addCategory:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     }
// };

// // @desc    Get categories
// // @route   GET /api/v1/get-categories
// // @access  Private
// exports.getCategories = async (req, res) => {
//     try {
//         const categories = await Category.find({ user: req.user.id });

//         return res.status(200).json({
//             success: true,
//             count: categories.length,
//             categories
//         });

//     } catch (error) {
//         console.error('Error in getCategories:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     }
// };

// // @desc    Delete category
// // @route   DELETE /api/v1/delete-category/:id
// // @access  Private
// exports.deleteCategory = async (req, res) => {
//     try {
//         const category = await Category.findById(req.params.id);

//         if (!category) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Category not found'
//             });
//         }

//         // Make sure user owns category
//         if (category.user.toString() !== req.user.id) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'User not authorized'
//             });
//         }

//         await category.remove();

//         return res.status(200).json({
//             success: true,
//             data: {}
//         });

//     } catch (error) {
//         console.error('Error in deleteCategory:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     }
// };

// // @desc    Update category
// // @route   PUT /api/v1/update-category/:id
// // @access  Private
// exports.updateCategory = async (req, res) => {
//     try {
//         let category = await Category.findById(req.params.id);

//         if (!category) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Category not found'
//             });
//         }

//         // Make sure user owns category
//         if (category.user.toString() !== req.user.id) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'User not authorized'
//             });
//         }

//         // Update fields
//         category = await Category.findByIdAndUpdate(
//             req.params.id,
//             { $set: req.body },
//             { new: true, runValidators: true }
//         );

//         return res.status(200).json({
//             success: true,
//             category
//         });

//     } catch (error) {
//         console.error('Error in updateCategory:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     }
// };


// backend/controllers/category.js
const CategoryModel = require('../models/CategoryModel');

exports.addCategory = async (req, res) => {
    try {
        const { key, label, icon } = req.body;
        const userId = req.user.id;

        if (!key || !label) {
            return res.status(400).json({
                success: false,
                error: 'Please provide both key and label for the category'
            });
        }

        // Check if category already exists for this user
        const existingCategory = await CategoryModel.findOne({ 
            user: userId,
            key: key.toLowerCase()
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                error: 'Category with this key already exists'
            });
        }

        // Create new category
        const category = await CategoryModel.create({
            key: key.toLowerCase(),
            label,
            icon: icon || 'circle',
            user: userId
        });

        res.status(201).json({
            success: true,
            category
        });

    } catch (error) {
        console.error('Error in addCategory:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find({ user: req.user.id });
        
        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        console.log('Deleting category with ID:', req.params.id); // Debug log

        const category = await CategoryModel.findOne({ 
            key: req.params.id,
            user: req.user.id 
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        // Make sure user owns category
        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authorized'
            });
        }

        await CategoryModel.deleteOne({ _id: category._id });

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteCategory:', error);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


exports.checkCategory = async (req, res) => {
    try {
        const category = await CategoryModel.findOne({
            key: req.params.id,
            user: req.user.id
        });

        return res.status(200).json({
            success: true,
            exists: !!category
        });
    } catch (error) {
        console.error('Error checking category:', error);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        let category = await CategoryModel.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        // Make sure user owns category
        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authorized'
            });
        }

        category = await CategoryModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};