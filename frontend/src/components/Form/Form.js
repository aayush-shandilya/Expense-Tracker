import React, { useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/icon';

function Form() {
    const {addIncome, getIncomes, error, setError} = useGlobalContext()
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
    })

    const { title, amount, date, category, description } = inputState;

    const handleInput = name => e => {
        let value = e.target.value;
        
        if (name === 'amount') {
            value = value.replace(/[^0-9.]/g, '');
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
        }

        setInputState({...inputState, [name]: value})
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validation
        if (!title || !amount || !date || !category) {
            setError('Please fill in all required fields');
            return;
        }

        // Create a copy of inputState with amount converted to number
        const formData = {
            ...inputState,
            amount: parseFloat(inputState.amount) || 0
        }

        try {
            await addIncome(formData)
            
            // Reset form only if submission was successful
            setInputState({
                title: '',
                amount: '',
                date: '',
                category: '',
                description: '',
            })
            
            // Refresh the income list
            await getIncomes()
        } catch (err) {
            setError(err.message || 'Failed to add income')
        }
    }

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input 
                    type="text" 
                    value={title}
                    name={'title'} 
                    placeholder="Income Source"
                    onChange={handleInput('title')}
                    required
                />
            </div>
            <div className="input-control">
                <input 
                    value={amount}  
                    type="number" 
                    name={'amount'} 
                    placeholder={'Earned Amount'}
                    onChange={handleInput('amount')}
                    step="1" 
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
                <select 
                    required 
                    value={category} 
                    name="category" 
                    id="category" 
                    onChange={handleInput('category')}
                >
                    <option value="" disabled>Select Option</option>
                    <option value="salary">Salary</option>
                    <option value="freelancing">Freelancing</option>
                    <option value="investments">Investments</option>
                    <option value="stocks">Stocks</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="bank">Bank Transfer</option>  
                    <option value="youtube">Youtube</option>  
                    <option value="other">Other</option>  
                </select>
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
                ></textarea>
            </div>
            <div className="submit-btn">
            <Button
                name={'Add Income'}
                icon={plus}
                onClick={handleSubmit}
                bPad={'.8rem 1.6rem'}
                bRad={'30px'}
                bg={'#FF8C00'}  // Direct color value
                color={'#fff'}
            />
            </div>
        </FormStyled>
    )
}

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    input, textarea, select{
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 10px;
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
        select{
            color: rgba(34, 34, 96, 0.4);
            &:focus, &:active{
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    .submit-btn{
        button{
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover{
                background: var(--color-green) !important;
            }
        }
    }

    .error {
        color: red;
        background: rgba(255, 0, 0, 0.1);
        padding: 0.5rem;
        border-radius: 5px;
        text-align: center;
    }
`;

export default Form;