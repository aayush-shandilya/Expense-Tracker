const incomeModel = require('../models/incomeModuls')

exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    const income = new incomeModel({
        title,
        amount,
        category,
        description,
        date
    });

    try {
        if (!title || !amount || !category || !description || !date) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        if (amount <= 0 || typeof amount !== 'number') {
            return res.status(400).json({ message: "Amount should be a positive number" });
        }
        await income.save();
        res.status(200).json({ message: 'Income Added' });
    } catch (error) {
        console.error('Error saving income:', error); // Log the error
        return res.status(500).json({ message: 'Server error', error: error.message }); // Include error message for debugging
    }
};


exports.getIncomes = async(req,res)=>{
    try{
        const income = await incomeModel.find().sort({createdAt:-1});
        res.status(200).json(income)
    }catch(error)
    {
        return res.status(500).json({message:'server error'});
    }
}

exports.deleteIncomes = async(req,res)=>{
    const{id}=req.params;
    console.log(req.params);

    incomeModel.findByIdAndDelete(id)
    .then((income)=>{
        res.status(200).json({message:'income Deleted'})
    })
    .catch((err)=>{
        res.status(500).json({message:'Server Error'})
    })
}