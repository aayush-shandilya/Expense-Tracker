// import React, { useState } from 'react';
// import {
//     Box,
//     TextField,
//     MenuItem,
//     Button,
//     Alert,
//     styled,
// } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { useGlobalContext } from '../../context/globalContext';
// import dayjs from 'dayjs';

// // Styled components with reduced spacing
// const StyledForm = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     gap: theme.spacing(2),
// }));

// const StyledTextField = styled(TextField)(({ theme }) => ({
//     '& .MuiOutlinedInput-root': {
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         borderRadius: '10px',
//         '& fieldset': {
//             borderWidth: '2px',
//             borderColor: theme.palette.grey[200],
//         },
//         '&:hover fieldset': {
//             borderColor: theme.palette.primary.main,
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: theme.palette.primary.main,
//         },
//     },
//     '& .MuiOutlinedInput-input': {
//         padding: '10px 14px',
//     },
//     '& .MuiInputLabel-root': {
//         color: theme.palette.text.secondary,
//         transform: 'translate(14px, 11px) scale(1)',
//         fontFamily: 'Roboto, sans-serif',
//         '&.Mui-focused, &.MuiFormLabel-filled': {
//             transform: 'translate(14px, -9px) scale(0.75)',
//         },
//     },
// }));

// const categories = [
//     { value: 'salary', label: 'Salary' },
//     { value: 'freelancing', label: 'Freelancing' },
//     { value: 'investments', label: 'Investments' },
//     { value: 'stocks', label: 'Stocks' },
//     { value: 'bitcoin', label: 'Bitcoin' },
//     { value: 'bank', label: 'Bank Transfer' },
//     { value: 'youtube', label: 'Youtube' },
//     { value: 'other', label: 'Other' },
// ];

// function Form() {
//     const { addIncome, getIncomes, error, setError } = useGlobalContext();
//     const [loading, setLoading] = useState(false);
//     const [inputState, setInputState] = useState({
//         title: '',
//         amount: '',
//         date: null,
//         category: '',
//         description: '',
//     });

//     const handleInput = (name) => (event) => {
//         let value = event.target.value;
//         if (name === 'amount') {
//             value = value.replace(/[^0-9.]/g, '');
//             const parts = value.split('.');
//             if (parts.length > 2) {
//                 value = parts[0] + '.' + parts.slice(1).join('');
//             }
//         }
//         setInputState({ ...inputState, [name]: value });
//         setError('');
//     };

//     const handleDateChange = (newDate) => {
//         setInputState({ ...inputState, date: newDate });
//         setError('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!inputState.title || !inputState.amount || !inputState.date || !inputState.category) {
//             setError('Please fill in all required fields');
//             return;
//         }

//         try {
//             setLoading(true);
//             await addIncome({
//                 ...inputState,
//                 amount: parseFloat(inputState.amount) || 0,
//                 date: dayjs(inputState.date).toDate()
//             });
            
//             setInputState({
//                 title: '',
//                 amount: '',
//                 date: null,
//                 category: '',
//                 description: '',
//             });
            
//             await getIncomes();
//         } catch (err) {
//             setError(err.message || 'Failed to add income');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <StyledForm component="form" onSubmit={handleSubmit}>
//                 {error && (
//                     <Alert 
//                         severity="error" 
//                         onClose={() => setError('')}
//                         sx={{ py: 0, borderRadius: '10px' }}
//                     >
//                         {error}
//                     </Alert>
//                 )}

//                 <StyledTextField
//                     fullWidth
//                     label="Income Title"
//                     value={inputState.title}
//                     onChange={handleInput('title')}
//                     placeholder="e.g., Salary"
//                     required
//                     size="small"
//                 />

//                 <StyledTextField
//                     fullWidth
//                     label="Amount"
//                     type="number"
//                     value={inputState.amount}
//                     onChange={handleInput('amount')}
//                     required
//                     size="small"
                    
//                 />

//                 <DatePicker
//                     label="Select Date"
//                     value={inputState.date}
//                     onChange={handleDateChange}
//                     renderInput={(params) => (
//                         <StyledTextField
//                             {...params}
//                             fullWidth
//                             required
//                             size="small"
//                         />
//                     )}
//                 />

//                 <StyledTextField
//                     fullWidth
//                     select
//                     label="Category"
//                     value={inputState.category}
//                     onChange={handleInput('category')}
//                     required
//                     size="small"
//                 >
//                     <MenuItem value="" disabled>
//                         Select a category
//                     </MenuItem>
//                     {categories.map((category) => (
//                         <MenuItem key={category.value} value={category.value}>
//                             {category.label}
//                         </MenuItem>
//                     ))}
//                 </StyledTextField>

//                 <StyledTextField
//                     fullWidth
//                     label="Description"
//                     value={inputState.description}
//                     onChange={handleInput('description')}
//                     placeholder="Add a reference note"
//                     multiline
//                     rows={3}
//                     size="small"
//                 />

//                 <Button
//                     type="submit"
//                     variant="contained"
//                     disabled={loading}
//                     startIcon={<AddCircleOutlineIcon />}
//                     sx={{
//                         borderRadius: '20px',
//                         padding: '8px 16px',
//                         backgroundColor: (theme) => theme.palette.success.main,
//                         '&:hover': {
//                             backgroundColor: (theme) => theme.palette.success.dark,
//                         },
//                         textTransform: 'none',
//                     }}
//                 >
//                     {loading ? 'Adding...' : 'Add Income'}
//                 </Button>
//             </StyledForm>
//         </LocalizationProvider>
//     );
// }

// export default Form;


//Form/Form.js
import React, { useState } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Alert,
    styled,
    IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import { useGlobalContext } from '../../context/globalContext';
import dayjs from 'dayjs';

// Styled components
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

const FilePreview = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '10px',
    marginTop: theme.spacing(1),
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
        file: null,
    });
    const [filePreview, setFilePreview] = useState(null);

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check if file is an image
            const isImage = file.type.startsWith('image/');
            // Limit file size to 5MB
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes

            if (file.size > maxSize) {
                setError('File size should not exceed 5MB');
                return;
            }

            setInputState({ ...inputState, file });
            
            // Create preview for images
            if (isImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const removeFile = () => {
        setInputState({ ...inputState, file: null });
        setFilePreview(null);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
        
    //     if (!inputState.title || !inputState.amount || !inputState.date || !inputState.category) {
    //         setError('Please fill in all required fields');
    //         return;
    //     }

    //     try {
    //         setLoading(true);
    //         const formData = new FormData();
            
    //         // Add basic fields
    //         formData.append('title', inputState.title);
    //         formData.append('amount', inputState.amount);
    //         formData.append('category', inputState.category);
    //         formData.append('description', inputState.description);
            
    //         // Format and add date
    //         if (inputState.date) {
    //             const formattedDate = dayjs(inputState.date).format('YYYY-MM-DD');
    //             formData.append('date', formattedDate);
    //         }

    //         // Add file if exists
    //         if (inputState.file) {
    //             formData.append('file', inputState.file);
    //         }

    //         // Debug log
    //         console.log('Sending form data:');
    //         for (let pair of formData.entries()) {
    //             console.log(pair[0] + ': ' + pair[1]);
    //         }

    //         await addIncome(formData);
            
    //         setInputState({
    //             title: '',
    //             amount: '',
    //             date: null,
    //             category: '',
    //             description: '',
    //             file: null,
    //         });
    //         setFilePreview(null);
            
    //         await getIncomes();
    //     } catch (err) {
    //         console.error('Error submitting form:', err);
    //         setError(err.message || 'Failed to add income');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputState.title || !inputState.amount || !inputState.date || !inputState.category) {
            setError('Please fill in all required fields');
            return;
        }
    
        const numericAmount = parseFloat(inputState.amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Please enter a valid positive amount');
            return;
        }
    
        try {
            setLoading(true);
            
            // Create regular object instead of FormData
            const incomeData = {
                title: inputState.title,
                amount: numericAmount,
                category: inputState.category,
                description: inputState.description || '',
                date: dayjs(inputState.date).format('YYYY-MM-DD'),
                type: 'income'
            };
    
            await addIncome(incomeData);
            
            // Reset form on success
            setInputState({
                title: '',
                amount: '',
                date: null,
                category: '',
                description: '',
                file: null,
            });
            setFilePreview(null);
            
            await getIncomes();
        } catch (err) {
            console.error('Error submitting form:', err);
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

                <Box>
                    <input
                        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                        <Button
                            component="span"
                            variant="outlined"
                            startIcon={<AttachFileIcon />}
                            sx={{ borderRadius: '10px', textTransform: 'none' }}
                        >
                            Attach File/Image
                        </Button>
                    </label>

                    {inputState.file && (
                        <FilePreview>
                            {inputState.file.type.startsWith('image/') ? (
                                <ImageIcon color="primary" />
                            ) : (
                                <AttachFileIcon color="primary" />
                            )}
                            <Box sx={{ flex: 1 }}>{inputState.file.name}</Box>
                            <IconButton size="small" onClick={removeFile}>
                                ×
                            </IconButton>
                        </FilePreview>
                    )}
                </Box>

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