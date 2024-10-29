const expenseModule = require('../models/expenseModuls')


exports.addExpense = async(req,res)=>{
    const{title, amount, category, description, date} = req.body;

    const Expense = new expenseModule({
        title,
        amount,
        category,
        description,
        date
    });

    try{
        if(!title||!amount||!category||!description||!date)
        {
            return res.status(400).json({message:"All the fields are required"})
        }
        if(amount<=0 || typeof amount !=amount)
        {
            return res.status(400).json({message:"amount must be greater than 0"})
        }
        await incomeModuls.save();
        res.status(200).json({message:"expenses inserted successfully"})
    }
    catch(error)
    {
        res.status(500).json({message:"server error"})
    }
    console.log(income)
}
exports.getExpense = async(req, res)=>
{
    try{
        const income = expenseModule.find().sort({createdAt:-1});
        res.status(200).json(income);
    }
    catch(error)
    {
        res.status(500).json({message:"server error"});
    }
}

exports.deleteExpense = async(req,res)=>{
       const {id} = req.params;
       console.log(req.params);

       expenseModule.findByIdAndDelete(id)
        .then((income)=>{
            res.status(200).json({message:"expenses deleted"});
        })
        .cache((error)=>{
            res.status(500).json({message:"server error"});
        })
}