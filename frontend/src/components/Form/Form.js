import React, { useState } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Alert,
    styled,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useGlobalContext } from '../../context/globalContext';
import dayjs from 'dayjs';

// Styled components with reduced spacing
const StyledForm = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        '& fieldset': {
            borderWidth: '2px',
            borderColor: theme.palette.grey[200],
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
        transform: 'translate(14px, 11px) scale(1)',
        fontFamily: 'Roboto, sans-serif',
        '&.Mui-focused, &.MuiFormLabel-filled': {
            transform: 'translate(14px, -9px) scale(0.75)',
        },
    },
}));

const categories = [
    { value: 'salary', label: 'Salary' },
    { value: 'freelancing', label: 'Freelancing' },
    { value: 'investments', label: 'Investments' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'bitcoin', label: 'Bitcoin' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'youtube', label: 'Youtube' },
    { value: 'other', label: 'Other' },
];

function Form() {
    const { addIncome, getIncomes, error, setError } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: null,
        category: '',
        description: '',
    });

    const handleInput = (name) => (event) => {
        let value = event.target.value;
        if (name === 'amount') {
            value = value.replace(/[^0-9.]/g, '');
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
        }
        setInputState({ ...inputState, [name]: value });
        setError('');
    };

    const handleDateChange = (newDate) => {
        setInputState({ ...inputState, date: newDate });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputState.title || !inputState.amount || !inputState.date || !inputState.category) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            await addIncome({
                ...inputState,
                amount: parseFloat(inputState.amount) || 0,
                date: dayjs(inputState.date).toDate()
            });
            
            setInputState({
                title: '',
                amount: '',
                date: null,
                category: '',
                description: '',
            });
            
            await getIncomes();
        } catch (err) {
            setError(err.message || 'Failed to add income');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledForm component="form" onSubmit={handleSubmit}>
                {error && (
                    <Alert 
                        severity="error" 
                        onClose={() => setError('')}
                        sx={{ py: 0, borderRadius: '10px' }}
                    >
                        {error}
                    </Alert>
                )}

                <StyledTextField
                    fullWidth
                    label="Income Title"
                    value={inputState.title}
                    onChange={handleInput('title')}
                    placeholder="e.g., Salary"
                    required
                    size="small"
                />

                <StyledTextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={inputState.amount}
                    onChange={handleInput('amount')}
                    required
                    size="small"
                    
                />

                <DatePicker
                    label="Select Date"
                    value={inputState.date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                        <StyledTextField
                            {...params}
                            fullWidth
                            required
                            size="small"
                        />
                    )}
                />

                <StyledTextField
                    fullWidth
                    select
                    label="Category"
                    value={inputState.category}
                    onChange={handleInput('category')}
                    required
                    size="small"
                >
                    <MenuItem value="" disabled>
                        Select a category
                    </MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                            {category.label}
                        </MenuItem>
                    ))}
                </StyledTextField>

                <StyledTextField
                    fullWidth
                    label="Description"
                    value={inputState.description}
                    onChange={handleInput('description')}
                    placeholder="Add a reference note"
                    multiline
                    rows={3}
                    size="small"
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                        borderRadius: '20px',
                        padding: '8px 16px',
                        backgroundColor: (theme) => theme.palette.success.main,
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.success.dark,
                        },
                        textTransform: 'none',
                    }}
                >
                    {loading ? 'Adding...' : 'Add Income'}
                </Button>
            </StyledForm>
        </LocalizationProvider>
    );
}

export default Form;