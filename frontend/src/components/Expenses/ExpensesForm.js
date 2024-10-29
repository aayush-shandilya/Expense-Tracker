// // // ExpenseForm.js
// // import React, { useState } from 'react'
// // import styled from 'styled-components'
// // import DatePicker from 'react-datepicker'
// // import "react-datepicker/dist/react-datepicker.css";
// // import { useGlobalContext } from '../../context/globalContext';
// // import Button from '../Button/Button';
// // import { plus } from '../../utils/icon';
// // import { EXPENSE_CATEGORIES } from '../../config/categories';
// // import { useEffect } from 'react';
// // import { updateCategories, getAllCategories, getCategoryLabel } from '../../config/categories';

// // function ExpenseForm() {
// //     const {
// //         addExpense, 
// //         error, 
// //         setError, 
// //         user,
// //         getCategories,
// //         customCategories
// //     } = useGlobalContext();

// //      // Declare inputState and setInputState
// //      const [inputState, setInputState] = useState({
// //         title: '',
// //         amount: '',
// //         date: '',
// //         category: '',
// //         description: ''
// //     });

// //     const [categories, setCategories] = useState([]);

// //     // Fetch categories when component mounts
// //     useEffect(() => {
// //         if (user) {
// //             getCategories();
// //         }
// //     }, [user]);

// //     // Update categories when customCategories change
// //     useEffect(() => {
// //         const updatedCategories = updateCategories(customCategories);
// //         setCategories(getAllCategories());
// //     }, [customCategories]);

// //     const { title, amount, date, category, description } = inputState;

// //     const handleInput = name => e => {
// //         setInputState({...inputState, [name]: e.target.value})
// //         setError('')
// //     }


// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
        
// //         if (!user) {
// //             setError('Please log in to add expenses');
// //             return;
// //         }

// //         // Validate inputs
// //         if (!title || !category || !description || !date) {
// //             setError('All fields are required!');
// //             return;
// //         }

// //         const numericAmount = parseFloat(amount);
// //         if (isNaN(numericAmount) || numericAmount <= 0) {
// //             setError('Please enter a valid positive amount');
// //             return;
// //         }

// //         const formData = {
// //             title,
// //             amount: numericAmount,
// //             date,
// //             category,
// //             description,
// //             type: 'expense',
// //             user: user._id  // Include user ID here
// //         };

// //         try {
// //             console.log('Submitting expense:', formData);
// //             const response = await addExpense(formData);
            
// //             if (response.success) {
// //                 setInputState({
// //                     title: '',
// //                     amount: '',
// //                     date: '',
// //                     category: '',
// //                     description: '',
// //                 });
// //             } else {
// //                 setError(response.error || 'Failed to add expense');
// //             }
// //         } catch (err) {
// //             console.error('Error submitting expense:', err);
// //             setError('Failed to add expense. Please try again.');
// //         }
// //     }

// //     return (
// //         <ExpenseFormStyled onSubmit={handleSubmit}>
// //             {error && <p className='error'>{error}</p>}
// //             <div className="input-control">
// //                 <input 
// //                     type="text" 
// //                     value={title}
// //                     name={'title'} 
// //                     placeholder="Expense Title"
// //                     onChange={handleInput('title')}
// //                     required
// //                 />
// //             </div>
// //             <div className="input-control">
// //                 <input 
// //                     value={amount}  
// //                     type="number" 
// //                     name={'amount'}  
// //                     placeholder={'Expense Amount'}
// //                     onChange={handleInput('amount')} 
// //                     step="0.01" 
// //                     min="0"
// //                     required
// //                 />
// //             </div>
// //             <div className="input-control">
// //                 <DatePicker 
// //                     id='date'
// //                     placeholderText='Enter A Date'
// //                     selected={date}
// //                     dateFormat="dd/MM/yyyy"
// //                     onChange={(date) => {
// //                         setInputState({...inputState, date: date})
// //                     }}
// //                     required
// //                 />
// //             </div>
// //             <div className="selects input-control">
// //                 <select 
// //                     required 
// //                     value={category} 
// //                     name="category" 
// //                     id="category" 
// //                     onChange={handleInput('category')}
// //                 >
// //                     <option value="" disabled>Select Option</option>
// //                     {categories.map(category => (
// //                         <option key={category} value={category}>
// //                             {getCategoryLabel(category)}
// //                         </option>
// //                     ))}
// //                 </select>
// //             </div>
// //             <div className="input-control">
// //                 <textarea 
// //                     name="description" 
// //                     value={description} 
// //                     placeholder='Add A Reference' 
// //                     id="description" 
// //                     cols="30" 
// //                     rows="4" 
// //                     onChange={handleInput('description')}
// //                     required
// //                 ></textarea>
// //             </div>
// //             <div className="submit-btn">
// //                 <Button 
// //                     name={'Add Expense'}
// //                     icon={plus}
// //                     bPad={'.8rem 1.6rem'}
// //                     bRad={'30px'}
// //                     bg={'var(--color-accent'}
// //                     color={'#fff'}
// //                     type="submit" // Explicitly set type to 'submit'
// //                     hColor={'var(--color-green)'}
// //                 />
// //             </div>
// //         </ExpenseFormStyled>
// //     )
// // }
// // const ExpenseFormStyled = styled.form`
// //     display: flex;
// //     flex-direction: column;
// //     gap: 2rem;

// //     .error {
// //         color: var(--color-red);
// //         font-size: 0.9rem;
// //         padding: 0.5rem;
// //         border-radius: 0.5rem;
// //         background: rgba(255, 0, 0, 0.1);
// //         text-align: center;
// //     }

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

// // export default ExpenseForm;




// // Import dependencies
// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
// import { useGlobalContext } from '../../context/globalContext';
// import Button from '../Button/Button';
// import { plus } from '../../utils/icon';
// import { updateCategories, getAllCategories, getCategoryLabel } from '../../config/categories';

// function ExpenseForm() {
//     const {
//         addExpense, 
//         error, 
//         setError, 
//         user,
//         getCategories,
//         customCategories
//     } = useGlobalContext();

//     const [inputState, setInputState] = useState({
//         title: '',
//         amount: '',
//         date: '',
//         category: [],
//         description: ''
//     });

//     const [categories, setCategories] = useState([]);
//     const [dropdownOpen, setDropdownOpen] = useState(false);

//     useEffect(() => {
//         if (user) {
//             getCategories();
//         }
//     }, [user]);

//     useEffect(() => {
//         const updatedCategories = updateCategories(customCategories);
//         setCategories(getAllCategories());
//     }, [customCategories]);

//     const { title, amount, date, category, description } = inputState;

//     const handleInput = name => e => {
//         setInputState({...inputState, [name]: e.target.value});
//         setError('');
//     };

//     const handleCategoryChange = (selectedCategory) => {
//         const isSelected = category.includes(selectedCategory);
//         const newCategories = isSelected 
//             ? category.filter(cat => cat !== selectedCategory)
//             : [...category, selectedCategory];

//         setInputState({...inputState, category: newCategories});
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!user) {
//             setError('Please log in to add expenses');
//             return;
//         }

//         // Validate inputs
//         if (!title || category.length === 0 || !description || !date) {
//             setError('All fields are required!');
//             return;
//         }

//         const numericAmount = parseFloat(amount);
//         if (isNaN(numericAmount) || numericAmount <= 0) {
//             setError('Please enter a valid positive amount');
//             return;
//         }

//         const formData = {
//             title,
//             amount: numericAmount,
//             date,
//             category,
//             description,
//             type: 'expense',
//             user: user._id
//         };

//         try {
//             console.log('Submitting expense:', formData);
//             const response = await addExpense(formData);
            
//             if (response.success) {
//                 setInputState({
//                     title: '',
//                     amount: '',
//                     date: '',
//                     category: [],
//                     description: ''
//                 });
//             } else {
//                 setError(response.error || 'Failed to add expense');
//             }
//         } catch (err) {
//             console.error('Error submitting expense:', err);
//             setError('Failed to add expense. Please try again.');
//         }
//     };

//     return (
//         <ExpenseFormStyled onSubmit={handleSubmit}>
//             {error && <p className='error'>{error}</p>}
//             <div className="input-control">
//                 <input 
//                     type="text" 
//                     value={title}
//                     name={'title'} 
//                     placeholder="Expense Title"
//                     onChange={handleInput('title')}
//                     required
//                 />
//             </div>
//             <div className="input-control">
//                 <input 
//                     value={amount}  
//                     type="number" 
//                     name={'amount'}  
//                     placeholder={'Expense Amount'}
//                     onChange={handleInput('amount')} 
//                     step="0.01" 
//                     min="0"
//                     required
//                 />
//             </div>
//             <div className="input-control">
//                 <DatePicker 
//                     id='date'
//                     placeholderText='Enter A Date'
//                     selected={date}
//                     dateFormat="dd/MM/yyyy"
//                     onChange={(date) => {
//                         setInputState({...inputState, date: date})
//                     }}
//                     required
//                 />
//             </div>
                    

//             <div className="selects input-control">
//                 <div className="dropdown">
//                     <button 
//                         type="button" 
//                         className="dropdown-btn"
//                         onClick={() => setDropdownOpen(!dropdownOpen)}
//                     >
//                         {category.length > 0 ? `Selected (${category.length})` : 'Select Categories'}
//                     </button>
//                     {dropdownOpen && (
//                         <div className="dropdown-menu">
//                             {categories.map(cat => (
//                                 <label key={cat} className="dropdown-item">
//                                     <input 
//                                         type="checkbox"
//                                         checked={category.includes(cat)}
//                                         onChange={() => handleCategoryChange(cat)}
//                                     />
//                                     {getCategoryLabel(cat)}
//                                 </label>
//                             ))}
//                         </div>
//                     )}
//                 </div>
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
//                     required
//                 ></textarea>
//             </div>
//             <div className="submit-btn">
//                 <Button 
//                     name={'Add Expense'}
//                     icon={plus}
//                     bPad={'.8rem 1.6rem'}
//                     bRad={'30px'}
//                     bg={'var(--color-accent'}
//                     color={'#fff'}
//                     type="submit"
//                     hColor={'var(--color-green)'}
//                 />
//             </div>
//         </ExpenseFormStyled>
//     );
// }

// const ExpenseFormStyled = styled.form`
//     display: flex;
//     flex-direction: column;
//     gap: 2rem;

//     .error {
//         color: var(--color-red);
//         font-size: 0.9rem;
//         padding: 0.5rem;
//         border-radius: 0.5rem;
//         background: rgba(255, 0, 0, 0.1);
//         text-align: center;
//     }

//     input, textarea, select{
//         font-family: inherit;
//         font-size: inherit;
//         outline: none;
//         border: none;
//         padding: .5rem 1rem;
//         border-radius: 5px;
//         border: 2px solid #fff;
//         background: transparent;
//         resize: none;
//         box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//         color: rgba(34, 34, 96, 0.9);
//         &::placeholder{
//             color: rgba(34, 34, 96, 0.4);
//         }
//     }
    
//     .input-control{
//         input{
//             width: 100%;
//         }
//     }

//     .selects{
//         display: flex;
//         justify-content: flex-end;
//         select{
//             color: rgba(34, 34, 96, 0.4);
//             &:focus, &:active{
//                 color: rgba(34, 34, 96, 1);
//             }
//         }
//     }

//     .submit-btn{
//         button{
//             box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//             &:hover{
//                 background: var(--color-green) !important;
//             }
//         }
//     }
// `;

// export default ExpenseForm;


// // const ExpenseFormStyled = styled.form`
// //     display: flex;
// //     flex-direction: column;
// //     gap: 2rem;

// //     .error {
// //         color: var(--color-red);
// //         font-size: 0.9rem;
// //         padding: 0.5rem;
// //         border-radius: 0.5rem;
// //         background: rgba(255, 0, 0, 0.1);
// //         text-align: center;
// //     }

// //     .dropdown {
// //         position: relative;

// //         .dropdown-btn {
// //             padding: .5rem 1rem;
// //             border: 2px solid #fff;
// //             background: transparent;
// //             cursor: pointer;
// //             border-radius: 5px;
// //             width: 100%;
// //         }

// //         .dropdown-menu {
// //             position: absolute;
// //             top: 100%;
// //             left: 0;
// //             right: 0;
// //             max-height: 150px;
// //             overflow-y: auto;
// //             background: #fff;
// //             border: 1px solid #ccc;
// //             border-radius: 5px;
// //             z-index: 100;
// //             box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
// //         }

// //         .dropdown-item {
// //             padding: 0.5rem;
// //             display: flex;
// //             align-items: center;
// //             gap: 0.5rem;
// //             cursor: pointer;
// //             &:hover {
// //                 background: rgba(0, 0, 0, 0.05);
// //             }
// //         }
// //     }


// //     input, textarea {
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
// //         &::placeholder {
// //             color: rgba(34, 34, 96, 0.4);
// //         }
// //     }
// //         .selects{
// //             display: flex;
// //             justify-content: flex-end;
// //             select{
// //                 color: rgba(34, 34, 96, 0.4);
// //                 &:focus, &:active{
// //                     color: rgba(34, 34, 96, 1);
// //                 }
// //             }
// //         }

// //     .submit-btn {
// //         button {
// //             box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
// //             &:hover {
// //                 background: var(--color-green) !important;
// //             }
// //         }
// //     }
// // `;

// // export default ExpenseForm;




// //ExpensesForm.js
// import React, { useState, useRef, useEffect } from 'react';
// import styled from 'styled-components';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
// import { useGlobalContext } from '../../context/globalContext';
// import Button from '../Button/Button';
// import { plus } from '../../utils/icon';
// import { updateCategories, getAllCategories, getCategoryLabel } from '../../config/categories';

// // Custom MultiSelect component
// // const MultiSelect = ({ options, value, onChange }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const dropdownRef = useRef(null);
// //   const [selectedCategories, setSelectedCategories] = useState(value ? [value] : []);

// const MultiSelect = ({ options, value, onChange }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef(null);
//     const [selectedCategories, setSelectedCategories] = useState(value ? [value] : []);


//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

// //   const handleToggleOption = (option) => {
// //     let newSelected;
// //     if (selectedCategories.includes(option)) {
// //       newSelected = selectedCategories.filter(item => item !== option);
// //     } else {
// //       newSelected = [...selectedCategories, option];
// //     }
// //     setSelectedCategories(newSelected);
// //     onChange(newSelected.length === 1 ? newSelected[0] : '');
// //   };

// const handleToggleOption = (option) => {
//     let newSelected;
//     if (selectedCategories.includes(option)) {
//       newSelected = selectedCategories.filter(item => item !== option);
//     } else {
//       newSelected = [...selectedCategories, option];
//     }
//     setSelectedCategories(newSelected);
//     onChange(newSelected); // Now passing the full array
//   };

//   return (
//     <MultiSelectWrapper ref={dropdownRef}>
//       <div 
//         className="select-header"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {selectedCategories.length > 0 
//           ? selectedCategories.map(cat => getCategoryLabel(cat)).join(', ')
//           : 'Select Categories'}
//       </div>
//       {isOpen && (
//         <div className="options-container">
//           {options.map(option => (
//             <label key={option} className="option">
//               <input
//                 type="checkbox"
//                 checked={selectedCategories.includes(option)}
//                 onChange={() => handleToggleOption(option)}
//               />
//               <span className="option-label">{getCategoryLabel(option)}</span>
//             </label>
//           ))}
//         </div>
//       )}
//     </MultiSelectWrapper>
//   );
// };

// function ExpenseForm() {
//     const {
//         addExpense, 
//         error, 
//         setError, 
//         user,
//         getCategories,
//         customCategories
//     } = useGlobalContext();

//     const [inputState, setInputState] = useState({
//         title: '',
//         amount: '',
//         date: '',
//         category: '',
//         description: ''
//     });

// function ExpenseForm() {
//     const {
//         addExpense, 
//         error, 
//         setError, 
//         user,
//         getCategories,
//         customCategories
//     } = useGlobalContext();

//     const [inputState, setInputState] = useState({
//         title: '',
//         amount: '',
//         date: '',
//         categories: [], // Changed from category to categories
//         description: ''
//     });

//     const [categories, setCategories] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]); // Add this line

//     //const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         if (user) {
//             getCategories();
//         }
//     }, [user]);

//     useEffect(() => {
//         const updatedCategories = updateCategories(customCategories);
//         setCategories(getAllCategories());
//     }, [customCategories]);

    // const { title, amount, date, category, description } = inputState;

    // const handleInput = name => e => {
    //     setInputState({...inputState, [name]: e.target.value});
    //     setError('');
    // };

    // const handleCategoryChange = (selectedCategory) => {
    //     setInputState({...inputState, category: selectedCategory});
    //     setError('');
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
        
    //     if (!user) {
    //         setError('Please log in to add expenses');
    //         return;
    //     }

    //     if (!title || !category || !description || !date) {
    //         setError('All fields are required!');
    //         return;
    //     }

    //     const numericAmount = parseFloat(amount);
    //     if (isNaN(numericAmount) || numericAmount <= 0) {
    //         setError('Please enter a valid positive amount');
    //         return;
    //     }

    //     const formData = {
    //         title,
    //         amount: numericAmount,
    //         date,
    //         category,
    //         description,
    //         type: 'expense',
    //         user: user._id
    //     };

    //     try {
    //         const response = await addExpense(formData);
            
    //         if (response.success) {
    //             setInputState({
    //                 title: '',
    //                 amount: '',
    //                 date: '',
    //                 category: '',
    //                 description: '',
    //             });
    //         } else {
    //             setError(response.error || 'Failed to add expense');
    //         }
    //     } catch (err) {
    //         console.error('Error submitting expense:', err);
    //         setError('Failed to add expense. Please try again.');
    //     }
    // };




    // const handleSubmit = async (e) => {
    //     e.preventDefault();
        
    //     if (!user) {
    //         setError('Please log in to add expenses');
    //         return;
    //     }
    
    //     // Validate inputs
    //     if (!title || selectedCategories.length === 0 || !description || !date) {
    //         setError('All fields are required! Please select at least one category.');
    //         return;
    //     }
    
    //     const numericAmount = parseFloat(amount);
    //     if (isNaN(numericAmount) || numericAmount <= 0) {
    //         setError('Please enter a valid positive amount');
    //         return;
    //     }
    
    //     const formData = {
    //         title,
    //         amount: numericAmount,
    //         date,
    //         categories: selectedCategories, // Send array of categories
    //         description,
    //         type: 'expense',
    //         user: user._id
    //     };
    
    //     try {
    //         console.log('Submitting expense:', formData);
    //         const response = await addExpense(formData);
            
    //         if (response.success) {
    //             setInputState({
    //                 title: '',
    //                 amount: '',
    //                 date: '',
    //                 categories: [], // Reset to empty array
    //                 description: '',
    //             });
    //         } else {
    //             setError(response.error || 'Failed to add expense');
    //         }
    //     } catch (err) {
    //         console.error('Error submitting expense:', err);
    //         setError('Failed to add expense. Please try again.');
    //     }
    // };
//     const { title, amount, date, description } = inputState;

//     const handleInput = name => e => {
//         setInputState({...inputState, [name]: e.target.value});
//         setError('');
//     };

//     const handleCategoryChange = (selected) => {
//         setSelectedCategories(selected); // Update selectedCategories
//         setError('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!user) {
//             setError('Please log in to add expenses');
//             return;
//         }
    
//         if (!title || selectedCategories.length === 0 || !description || !date) {
//             setError('All fields are required! Please select at least one category.');
//             return;
//         }
    
//         const numericAmount = parseFloat(amount);
//         if (isNaN(numericAmount) || numericAmount <= 0) {
//             setError('Please enter a valid positive amount');
//             return;
//         }
    
//         const formData = {
//             title,
//             amount: numericAmount,
//             date,
//             categories: selectedCategories,
//             description,
//             type: 'expense',
//             user: user._id
//         };
    
//         try {
//             console.log('Submitting expense:', formData);
//             const response = await addExpense(formData);
            
//             if (response.success) {
//                 setInputState({
//                     title: '',
//                     amount: '',
//                     date: '',
//                     categories: [],
//                     description: '',
//                 });
//                 setSelectedCategories([]); // Reset selected categories
//             } else {
//                 setError(response.error || 'Failed to add expense');
//             }
//         } catch (err) {
//             console.error('Error submitting expense:', err);
//             setError('Failed to add expense. Please try again.');
//         }
//     };

//     return (
//         <ExpenseFormStyled onSubmit={handleSubmit}>
//             {error && <p className='error'>{error}</p>}
//             <div className="input-control">
//                 <input 
//                     type="text" 
//                     value={title}
//                     name={'title'} 
//                     placeholder="Expense Title"
//                     onChange={handleInput('title')}
//                     required
//                 />
//             </div>
//             <div className="input-control">
//                 <input 
//                     value={amount}  
//                     type="number" 
//                     name={'amount'}  
//                     placeholder={'Expense Amount'}
//                     onChange={handleInput('amount')} 
//                     step="0.01" 
//                     min="0"
//                     required
//                 />
//             </div>
//             <div className="input-control">
//                 <DatePicker 
//                     id='date'
//                     placeholderText='Enter A Date'
//                     selected={date}
//                     dateFormat="dd/MM/yyyy"
//                     onChange={(date) => {
//                         setInputState({...inputState, date: date})
//                     }}
//                     required
//                 />
//             </div>
//             <div className="selects input-control">
//                 <MultiSelect
//                     options={categories}
//                     value={category}
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
//                     required
//                 ></textarea>
//             </div>
//             <div className="submit-btn">
//                 <Button 
//                     name={'Add Expense'}
//                     icon={plus}
//                     bPad={'.8rem 1.6rem'}
//                     bRad={'30px'}
//                     bg={'var(--color-accent'}
//                     color={'#fff'}
//                     type="submit"
//                     hColor={'var(--color-green)'}
//                 />
//             </div>
//         </ExpenseFormStyled>
//     );
// }


import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import ButtonExpense from '../Button/ButtonExpense';
import { plus } from '../../utils/icon';
import { updateCategories, getAllCategories, getCategoryLabel } from '../../config/categories';

// Custom MultiSelect component
const MultiSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedCategories, setSelectedCategories] = useState(value || []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedCategories(value || []);
  }, [value]);

  const handleToggleOption = (option) => {
    let newSelected;
    if (selectedCategories.includes(option)) {
      newSelected = selectedCategories.filter(item => item !== option);
    } else {
      newSelected = [...selectedCategories, option];
    }
    setSelectedCategories(newSelected);
    onChange(newSelected); // Pass the full array to parent
  };

  return (
    <MultiSelectWrapper ref={dropdownRef}>
      <div 
        className="select-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCategories.length > 0 
          ? selectedCategories.map(cat => getCategoryLabel(cat)).join(', ')
          : 'Select Categories'}
      </div>
      {isOpen && (
        <div className="options-container">
          {options.map(option => (
            <label key={option} className="option">
              <input
                type="checkbox"
                checked={selectedCategories.includes(option)}
                onChange={() => handleToggleOption(option)}
              />
              <span className="option-label">{getCategoryLabel(option)}</span>
            </label>
          ))}
        </div>
      )}
    </MultiSelectWrapper>
  );
};

function ExpenseForm() {
    const {
        addExpense, 
        error, 
        setError, 
        user,
        getCategories,
        customCategories
    } = useGlobalContext();

    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        description: ''
    });

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        if (user) {
            getCategories();
        }
    }, [user]);

    useEffect(() => {
        const updatedCategories = updateCategories(customCategories);
        setCategories(getAllCategories());
    }, [customCategories]);

    const { title, amount, date, description } = inputState;

    const handleInput = name => e => {
        setInputState({...inputState, [name]: e.target.value});
        setError('');
    };

    const handleCategoryChange = (selected) => {
        setSelectedCategories(selected);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setError('Please log in to add expenses');
            return;
        }
    
        if (!title || selectedCategories.length === 0 || !description || !date) {
            setError('All fields are required! Please select at least one category.');
            return;
        }
    
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Please enter a valid positive amount');
            return;
        }
    
        const formData = {
            title,
            amount: numericAmount,
            date,
            categories: selectedCategories,
            description,
            type: 'expense',
            user: user._id
        };
    
        try {
            console.log('Submitting expense:', formData);
            const response = await addExpense(formData);
            
            if (response.success) {
                setInputState({
                    title: '',
                    amount: '',
                    date: '',
                    description: '',
                });
                setSelectedCategories([]); // Reset selected categories
            } else {
                setError(response.error || 'Failed to add expense');
            }
        } catch (err) {
            console.error('Error submitting expense:', err);
            setError('Failed to add expense. Please try again.');
        }
    };

    return (
        <ExpenseFormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input 
                    type="text" 
                    value={title}
                    name={'title'} 
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                    required
                />
            </div>
            <div className="input-control">
                <input 
                    value={amount}  
                    type="number" 
                    name={'amount'}  
                    placeholder={'Expense Amount'}
                    onChange={handleInput('amount')} 
                    step="0.01" 
                    min="0"
                    required
                />
            </div>
            <div className="input-control">
                <DatePicker 
                    id='date'
                    placeholderText='Enter A Date'
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setInputState({...inputState, date: date})
                    }}
                    required
                />
            </div>
            <div className="selects input-control">
                <MultiSelect
                    options={categories}
                    value={selectedCategories}
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
                    required
                ></textarea>
            </div>
            <div className="submit-btn">
                {/* <Button 
                    name={'Add Expense'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent'}
                    color={'#fff'}
                    type="submit"
                    hColor={'var(--color-green)'}
                /> */}
                <ButtonExpense
                name={'Add Expense'}
                icon={plus}
                bPad={'.8rem 1.6rem'}
                bRad={'30px'}
                bg={'#FF8C00'}  // Direct color value
                color={'#fff'}
                type="submit"
                hColor={'var(--color-green)'}
            />
            </div>
        </ExpenseFormStyled>
    );
}


const MultiSelectWrapper = styled.div`
  position: relative;
  width: 100%;

  .select-header {
    width: 200px;
    padding: 10px;
    left: 150px;
    border: 2px solid #fff;
    border-radius: 5px;
    background: transparent;
    position: relative;
    margin: 0 auto;
    user-select: none;
    cursor: pointer;
    color: rgba(34, 34, 96, 0.9);
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    max-weight: 100px;
  }

  .options-container {
    width: 200px;
    position: absolute;
    
    top: 100%;
    left: 300px;
    right: 0;
    max-height: 200px;
    // max-weight: 100px;
    overflow-y: auto;
    background: transparent;
    border-radius: 5px;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    z-index: 1000;
    margin-top: 4px;
  }

  .option {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(34, 34, 96, 0.05);
    }

    input[type="checkbox"] {
      margin-right: 8px;
    }

    .option-label {
      color: rgba(34, 34, 96, 0.9);
    }
  }
`;

const ExpenseFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .error {
        color: var(--color-red);
        font-size: 0.9rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background: rgba(255, 0, 0, 0.1);
        text-align: center;
    }

    input, textarea, select{
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder{
            color: rgba(34, 34, 96, 0.4);
        }
    }
    
    .input-control{
        input{
            width: 100%;
        }
    }

    .selects{
        display: flex;
        justify-content: flex-end;
    }

    
    .submit-btn{
        button{
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover{
                background: var(--color-green);
            }
        }
    }
`;

export default ExpenseForm;