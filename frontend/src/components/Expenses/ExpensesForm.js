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