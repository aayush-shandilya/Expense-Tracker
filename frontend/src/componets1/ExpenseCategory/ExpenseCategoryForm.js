// // import React, { useState } from 'react'
// // import styled from 'styled-components'
// // import DatePicker from 'react-datepicker'
// // import "react-datepicker/dist/react-datepicker.css";
// // import { useGlobalContext } from '../../context/globalContext';
// // import Button from '../Button/Button';
// // import { categories, plus } from '../../utils/icons';
// // import Calendar from 'react-calendar';
// // import IncomeItem from "../IncomItem/IncomeItem";
// // import MultiSelectDropdown from '../Expense/MultiSelectDropdown';

// // const handleInput = (name) => (event) => {
// //     const { options } = event.target;
// //     const selectedValues = [];
// //     for (let i = 0; i < options.length; i++) {
// //       if (options[i].selected) {
// //         selectedValues.push(options[i].value);
// //       }
// //     }
// //     // Update your state with selected values
// //     useState({ [name]: selectedValues });
// //   };
  

// // function ExpenseCategoryForm() {
// //     const {addExpense, error, setError} = useGlobalContext()
// //     const [inputState, setInputState] = useState({
// //         title: '',
// //         category: '',
// //         description: '',
// //     })

// //     const { title, category, description } = inputState;     

// //     const handleInput = name => e => {
// //         setInputState({...inputState, [name]: e.target.value})
// //         setError('')
// //     }
// //     const handleCategoryChange = (selectedCategories) => {
// //         setInputState({ ...inputState, category: selectedCategories });
// //     };

// //     const handleSubmit = e => {
// //         e.preventDefault()
// //         addExpense(inputState)
// //         setInputState({
// //             title: '',
// //             category: '',
// //             description: '',
// //         })
// //     }

// //     const categoryOptions = [
// //         "Fees","SalaryInvestments","Subscriptions","Rent","Clothing","Grocessry","Other"
// //     ];

// //     return (
// //         <ExpenseCategoryFormStyled onSubmit={handleSubmit}>
// //             {error && <p className='error'>{error}</p>}
// //             <div className='Calender'>
// //             <h4>Select Date/Month/year:</h4>
// //                 <Calendar/>
// //             </div>
// //             <div className="input-control">                             
// //                 <input 
// //                     type="text" 
// //                     value={title}
// //                     name={'title'} 
// //                     placeholder="Expense_category Title"
// //                     onChange={handleInput('title')}
// //                 />
// //             </div>
            
// //             <div className="selects input-control">
// //                 <MultiSelectDropdown
// //                     options={categoryOptions}
// //                     selectedOptions={category}
// //                     onChange={handleCategoryChange}
// //                 />
// //             </div>
// //             <div className="input-control">
// //                 <textarea name="description" value={description} placeholder='Add A Reference' id="description" cols="30" rows="4" onChange={handleInput('description')}></textarea>
// //             </div>
// //             <div className="submit-btn">
// //                 <h1>submit</h1>
// //                 <Button 
// //                     name={'Add Income'}
// //                     icon={plus}
// //                     onClick={handleSubmit}
// //                     bg={'var(--color-accent)'}
// //                     bPad={'.8rem 1.6rem'}
// //                     bRad={'30px'}
// //                     color={'#fff'}
// //                 />
// //             </div>
// //         </ExpenseCategoryFormStyled>
// //     )
// // }
// // const ExpenseCategoryFormStyled = styled.form`
// //     display: flex;
// //     flex-direction: column;
// //     gap: 2rem;
// //     input, textarea, select{
// //         font-family: inherit;
// //         font-size: inherit;
// //         outline: none;
// //         border: none;
// //         padding: .5rem 1rem;
// //         border-radius: 5px;
// //         border: 2px solid #fff;
// //         background: transparent;
// //         resize: none;
// //         box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
// //         color: rgba(34, 34, 96, 0.9);
// //         &::placeholder{
// //             color: rgba(34, 34, 96, 0.4);
// //         }
// //     }
// //     .input-control{
// //         input{
// //             width: 100%;
// //         }
// //     }

// //     .selects{
// //         display: flex;
// //         justify-content: flex-end;
// //         select{
// //             color: rgba(34, 34, 96, 0.4);
// //             &:focus, &:active{
// //                 color: rgba(34, 34, 96, 1);
// //             }
// //         }
// //     }

// //     .submit-btn{
// //         button{
// //             box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
// //             &:hover{
// //                 background: var(--color-green) !important;
// //             }
// //         }
// //     }
// // `;
// // export default ExpenseCategoryForm



// import React, { useState } from 'react';
// import styled from 'styled-components';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { useGlobalContext } from '../../context/globalContext';
// import Button from '../Button/Button';
// import { plus } from '../../utils/icons';
// import MultiSelectDropdown from '../Expense/MultiSelectDropdown';

// function ExpenseCategoryForm() {
//     const { addExpense, error, setError } = useGlobalContext();
//     const [inputState, setInputState] = useState({
//         title: '',
//         category: [],  // Changed to array for multiple selections
//         description: '',
//         date: new Date()
//     });

//     const { title, category, description, date } = inputState;

//     const handleInput = name => e => {
//         setInputState({...inputState, [name]: e.target.value});
//         setError('');
//     };

//     const handleCategoryChange = (selectedCategories) => {
//         setInputState({ ...inputState, category: selectedCategories });
//     };

//     const handleDateChange = (newDate) => {
//         setInputState({ ...inputState, date: newDate });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Validation
//         if (!title || !category.length) {
//             setError('Please fill in all required fields');
//             return;
//         }

//         try {
//             await addExpense(inputState);
//             // Reset form after successful submission
//             setInputState({
//                 title: '',
//                 category: [],
//                 description: '',
//                 date: new Date()
//             });
//         } catch (err) {
//             setError(err.message || 'Failed to add expense category');
//         }
//     };

//     const categoryOptions = [
//         "Fees",
//         "SalaryInvestments",
//         "Subscriptions",
//         "Rent",
//         "Clothing",
//         "Grocery",
//         "Other"
//     ];

//     return (
//         <ExpenseCategoryFormStyled onSubmit={handleSubmit}>
//             {error && <p className='error'>{error}</p>}
            
//             <div className='calendar-container'>
//                 <h4>Select Date/Month/Year:</h4>
//                 <Calendar
//                     onChange={handleDateChange}
//                     value={date}
//                     className="custom-calendar"
//                 />
//             </div>

//             <div className="input-control">
//                 <input 
//                     type="text" 
//                     value={title}
//                     name={'title'} 
//                     placeholder="Expense Category Title"
//                     onChange={handleInput('title')}
//                     required
//                 />
//             </div>
            
//             <div className="selects input-control">
//                 <MultiSelectDropdown
//                     options={categoryOptions}
//                     selectedOptions={category}
//                     onChange={handleCategoryChange}
//                 />
//             </div>

//             <div className="input-control">
//                 <textarea 
//                     name="description" 
//                     value={description} 
//                     placeholder='Add A Reference' 
//                     id="description" 
//                     cols="30" 
//                     rows="4" 
//                     onChange={handleInput('description')}
//                 />
//             </div>

//             <div className="submit-btn">
//                 <Button 
//                     name={'Add Expense Category'}
//                     icon={plus}
//                     onClick={handleSubmit}
//                     bg={'var(--color-orange)'}
//                     bPad={'.8rem 1.6rem'}
//                     bRad={'30px'}
//                     color={'#fff'}
//                     hColor={'var(--color-red)'}
//                 />
//             </div>
//         </ExpenseCategoryFormStyled>
//     );
// }

// const ExpenseCategoryFormStyled = styled.form`
//     display: flex;
//     flex-direction: column;
//     gap: 2rem;
//     padding: 2rem;
//     background: #FCF6F9;
//     border-radius: 20px;
//     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

//     .error {
//         color: red;
//         background: rgba(255, 0, 0, 0.1);
//         padding: 0.5rem;
//         border-radius: 5px;
//         text-align: center;
//     }

//     .calendar-container {
//         h4 {
//             margin-bottom: 1rem;
//             color: var(--primary-color);
//         }
        
//         .custom-calendar {
//             width: 100%;
//             border: none;
//             border-radius: 10px;
//             box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//         }
//     }

//     input, textarea, select {
//         font-family: inherit;
//         font-size: inherit;
//         outline: none;
//         border: none;
//         padding: .8rem 1rem;
//         border-radius: 5px;
//         border: 2px solid #fff;
//         background: #fff;
//         resize: none;
//         box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//         color: rgba(34, 34, 96, 0.9);
        
//         &::placeholder {
//             color: rgba(34, 34, 96, 0.4);
//         }
//     }

//     .input-control {
//         input {
//             width: 100%;
//         }
//     }

//     .selects {
//         display: flex;
//         justify-content: flex-end;
        
//         select {
//             color: rgba(34, 34, 96, 0.4);
//             &:focus, &:active {
//                 color: rgba(34, 34, 96, 1);
//             }
//         }
//     }

//     .submit-btn {
//         display: flex;
//         justify-content: center;
        
//         button {
//             box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//         }
//     }
// `;

// export default ExpenseCategoryForm;



import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/icons';
import MultiSelectDropdown from './MultiSelectDropdown';

function ExpenseCategoryForm() {
    const { addExpense, error, setError } = useGlobalContext();
    const [inputState, setInputState] = useState({
        title: '',
        category: [], // Initialize as empty array
        description: '',
        date: new Date()
    });

    const { title, category, description, date } = inputState;

    const handleInput = name => e => {
        setInputState({...inputState, [name]: e.target.value});
        setError('');
    };

    const handleCategoryChange = (selectedCategories) => {
        setInputState(prev => ({
            ...prev,
            category: selectedCategories
        }));
        setError('');
    };

    const handleDateChange = (newDate) => {
        setInputState(prev => ({
            ...prev,
            date: newDate
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!title || category.length === 0) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await addExpense({
                title,
                category,
                description,
                date: date.toISOString()
            });

            // Reset form after successful submission
            setInputState({
                title: '',
                category: [],
                description: '',
                date: new Date()
            });
        } catch (err) {
            setError(err.message || 'Failed to add expense category');
        }
    };

    const categoryOptions = [
        "Fees",
        "SalaryInvestments",
        "Subscriptions",
        "Rent",
        "Clothing",
        "Grocery",
        "Other"
    ];

    return (
        <ExpenseCategoryFormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            
            <div className='calendar-container'>
                <h4>Select Date/Month/Year:</h4>
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    className="custom-calendar"
                />
            </div>

            <div className="input-control">
                <input 
                    type="text" 
                    value={title}
                    name={'title'} 
                    placeholder="Expense Category Title"
                    onChange={handleInput('title')}
                    required
                />
            </div>
            
            <div className="selects input-control">
                <MultiSelectDropdown
                    options={categoryOptions}
                    selectedOptions={category}
                    onChange={handleCategoryChange}
                />
            </div>

            <div className="input-control">
                <textarea 
                    name="description" 
                    value={description} 
                    placeholder='Add A Reference' 
                    id="description" 
                    cols="30" 
                    rows="4" 
                    onChange={handleInput('description')}
                />
            </div>

            <div className="submit-btn">
                <Button 
                    name={'Add Expense Category'}
                    icon={plus}
                    onClick={handleSubmit}
                    bg={'var(--color-orange)'}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    color={'#fff'}
                    hColor={'var(--color-red)'}
                />
            </div>
        </ExpenseCategoryFormStyled>
    );
}

const ExpenseCategoryFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    background: #FCF6F9;
    border-radius: 20px;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

    .error {
        color: red;
        background: rgba(255, 0, 0, 0.1);
        padding: 0.5rem;
        border-radius: 5px;
        text-align: center;
    }

    .calendar-container {
        h4 {
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        .custom-calendar {
            width: 100%;
            border: none;
            border-radius: 10px;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        }
    }

    .input-control {
        input, textarea {
            width: 100%;
            font-family: inherit;
            font-size: inherit;
            outline: none;
            border: none;
            padding: .8rem 1rem;
            border-radius: 5px;
            border: 2px solid #fff;
            background: #fff;
            resize: none;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            color: rgba(34, 34, 96, 0.9);
            
            &::placeholder {
                color: rgba(34, 34, 96, 0.4);
            }
        }
    }

    .selects {
        width: 100%;
        margin-bottom: 1rem;
    }

    .submit-btn {
        display: flex;
        justify-content: center;
        
        button {
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        }
    }
`;

export default ExpenseCategoryForm;