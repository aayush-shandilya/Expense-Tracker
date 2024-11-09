import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  styled,
  FormControl,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  ListItemText,
  Checkbox,
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
import { updateCategories, getAllCategories, getCategoryLabel } from '../../config/categories';

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

const StyledSelect = styled(FormControl)(({ theme }) => ({
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

function ExpenseForm() {
  const {
    addExpense,
    error,
    setError,
    user,
    getCategories,
    customCategories
  } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [inputState, setInputState] = useState({
    title: '',
    amount: '',
    date: null,
    description: '',
    file: null,
  });
  const [filePreview, setFilePreview] = useState(null);
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

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(value);
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

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    setError('Please log in to add expenses');
    return;
  }

  // Validate required fields
  if (!inputState.title || selectedCategories.length === 0 || !inputState.description || !inputState.date) {
    setError('All fields are required! Please select at least one category.');
    return;
  }

  const numericAmount = parseFloat(inputState.amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    setError('Please enter a valid positive amount');
    return;
  }

  try {
    setLoading(true);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', inputState.title);
    formData.append('amount', numericAmount);
    formData.append('description', inputState.description);
    formData.append('date', dayjs(inputState.date).format('YYYY-MM-DD'));
    formData.append('type', 'expense');
    formData.append('user', user._id);
    
    // Append all selected categories
    selectedCategories.forEach(category => {
      formData.append('categories', category);
    });

    // Add file if exists
    if (inputState.file) {
      formData.append('file', inputState.file);
      // Log file details for debugging
      console.log('File being uploaded:', {
        name: inputState.file.name,
        type: inputState.file.type,
        size: inputState.file.size
      });
    }

    const response = await addExpense(formData);

    if (response.success) {
      setInputState({
        title: '',
        amount: '',
        date: null,
        description: '',
        file: null,
      });
      setSelectedCategories([]);
      setFilePreview(null);
    } else {
      setError(response.error || 'Failed to add expense');
    }
  } catch (err) {
    setError('Failed to add expense. Please try again.');
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
          label="Expense Title"
          value={inputState.title}
          onChange={handleInput('title')}
          placeholder="e.g., Groceries"
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

        <StyledSelect size="small" fullWidth>
          <InputLabel id="category-select-label">Categories</InputLabel>
          <Select
            fullWidth
            labelId="category-select-label"
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Categories" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip 
                    key={value} 
                    label={getCategoryLabel(value)}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255, 140, 0, 0.1)',
                      '& .MuiChip-label': { color: 'rgb(255, 140, 0)' }
                    }}
                  />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 224,
                  marginTop: 8,
                },
              },
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                <Checkbox checked={selectedCategories.indexOf(category) > -1} />
                <ListItemText primary={getCategoryLabel(category)} />
              </MenuItem>
            ))}
          </Select>
        </StyledSelect>

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
            backgroundColor: (theme) => theme.palette.error.main,
            '&:hover': {
              backgroundColor: (theme) => theme.palette.error.dark,
            },
            textTransform: 'none',
            alignSelf: 'flex-start',
            mt: 1
          }}
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </Button>
      </StyledForm>
    </LocalizationProvider>
  );
}

export default ExpenseForm;