import React, { useEffect, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  styled,
  Pagination,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGlobalContext } from '../../context/globalContext';
import ExpensesForm from './ExpensesForm';

import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';

// Styled components
const ContentContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 100px)',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#FCF6F9',
  borderRadius: '15px',
  boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
}));

const ExpenseItemCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#FCF6F9',
  borderRadius: '15px',
  marginBottom: theme.spacing(1),
  boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)',
  '& .MuiCardContent-root': {
    padding: theme.spacing(1.5),
    '&:last-child': {
      paddingBottom: theme.spacing(1.5),
    },
  },
}));

const ExpenseItem = ({ 
  id, 
  title, 
  amount, 
  date, 
  category, 
  categories, 
  description, 
  deleteItem,
  fileUrl,
  fileName,
  fileType 
}) => {

  const { downloadExpenseFile } = useGlobalContext();
  const [previewOpen, setPreviewOpen] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString();
  const categoryDisplay = categories ? categories.join(', ') : category;
  const isImage = fileType?.startsWith('image/');
  const hasFile = Boolean(fileName && fileType);

  const handleDownload = async () => {
    if (!hasFile) return;
    
    try {
      await downloadExpenseFile(id, fileName, fileType);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handlePreviewOpen = () => {
    if (isImage) {
      setPreviewOpen(true);
    } else {
      handleDownload();
    }
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };
  
  return (
    <>
    <ExpenseItemCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography 
                variant="subtitle1" 
                component="div" 
                color="error" 
                sx={{ 
                  fontWeight: 'bold', 
                  fontFamily: 'Roboto, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {title}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', fontFamily: 'Roboto, sans-serif', mt: 0.5 }}>
              {categoryDisplay} • {formattedDate}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 0.5, fontFamily: 'Roboto, sans-serif' }}>
                {description}
              </Typography>
            )}
            {hasFile && (
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    mt: 0.5,
                    cursor: 'pointer'
                  }}
                  onClick={handlePreviewOpen}
                >
                  {isImage ? <ImageIcon fontSize="small" /> : <AttachFileIcon fontSize="small" />}
                  {fileName}
                </Typography>
              )}
          </Box>
          <Box display="flex" alignItems="center" gap={1} ml={2}>
            <Typography variant="subtitle1" color="error" sx={{ fontFamily: 'Roboto, sans-serif' }}>
              ₹{amount.toLocaleString()}
            </Typography>
            
            {hasFile && (
                <IconButton
                  onClick={handleDownload}
                  color="primary"
                  size="small"
                  title="Download File"
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                onClick={() => deleteItem(id)}
                color="error"
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
          </Box>
        </Box>
      </CardContent>
    </ExpenseItemCard>


      {isImage && (
        <Dialog
          open={previewOpen}
          onClose={handlePreviewClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Typography variant="h6">{fileName || 'Attachment'}</Typography>
            <IconButton onClick={handlePreviewClose} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: 2
          }}>
            <Box
              component="img"
              src={fileUrl}
              alt={fileName}
              sx={{ 
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 1
              }}
            />
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{ mt: 2 }}
            >
              Download
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

function Expenses() {
  const {
    expenses,
    getExpenses,
    deleteExpense,
    totalExpense,
    loading,
    error,
    setError,
    user,
    totalExpenseAmount,
    getTotalExpense
  } = useGlobalContext();

  const [displayedExpenses, setDisplayedExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 4;

  // // Initial load
  // useEffect(() => {
  //   if (user) {
  //     loadInitialExpenses();
  //   }
  // }, [user]);

  useEffect(() => {
    if (user) {
      getTotalExpense(); // Get total amount immediately
      getExpenses(1, 4); // Get first page of transactions
    }
  }, [user]);

  const loadInitialExpenses = async () => {
    setPage(1);
    await getExpenses(1, itemsPerPage);
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await getExpenses(nextPage, itemsPerPage);
      
      if (response?.success) {
        setPage(nextPage);
        setHasMore(response.hasMore);
      }
    } catch (err) {
      console.error('Error loading more expenses:', err);
      setError('Failed to load more expenses');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    try {
      const result = await deleteExpense(id);
      if (result.success) {
        loadInitialExpenses(); // Reload from first page after deletion
      } else {
        setError(result.error || 'Failed to delete expense');
      }
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
    }
  }, [deleteExpense, setError]);

  const memoizedTotalExpense = useMemo(() => totalExpense(), [expenses]);

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">
          Please log in to view your expense data.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <ContentContainer>
        {/* Header Section */}
        <Box sx={{ mb: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" component="h1" />
            <Typography
              variant="h5"
              color="error"
              sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
            >
              Total: ₹{totalExpenseAmount.toLocaleString()}
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
        </Box>

        {/* Main Content */}
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          {/* Form Section */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <StyledPaper>
              <ContentWrapper>
                <ExpensesForm />
              </ContentWrapper>
            </StyledPaper>
          </Grid>
          
          {/* Expense List Section */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <StyledPaper>
              <ContentWrapper>
                {/* Transactions info Header */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Recent Transactions
                  </Typography>
                </Box>

                {/* Scrollable Content Area */}
                <Box sx={{ 
                  overflowY: 'auto', 
                  flexGrow: 1,
                  mb: 2
                }}>
                  {loading && !loadingMore ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : expenses && expenses.length > 0 ? (
                    <>
                      {expenses.map((expense) => (
                        <ExpenseItem
                          key={expense._id}
                          id={expense._id}
                          title={expense.title}
                          description={expense.description}
                          amount={expense.amount}
                          date={expense.date}
                          type={expense.type}
                          category={expense.category}
                          categories={expense.categories}
                          deleteItem={handleDelete}
                          fileUrl={expense.fileId ? `/api/expenses/get-file/${expense._id}` : null}
                          fileName={expense.fileName}
                          fileType={expense.fileType}
                        />
                      ))}
                      
                      {/* Load More Button */}
                      {hasMore && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            sx={{ minWidth: 200 }}
                          >
                            {loadingMore ? (
                              <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Loading...
                              </>
                            ) : 'Load More'}
                          </Button>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Alert severity="info">
                      No expense records found.
                    </Alert>
                  )}
                </Box>
              </ContentWrapper>
            </StyledPaper>
          </Grid>
        </Grid>
      </ContentContainer>
    </Container>
  );
}

export default Expenses;

// function Expenses() {
//   const {
//     expenses,
//     getExpenses,
//     deleteExpense,
//     totalExpense,
//     loading,
//     error,
//     setError,
//     user
//   } = useGlobalContext();

//   const [page, setPage] = useState(1);
//   const itemPerPage = 4;

//   useEffect(() => {
//     if (user) {
//       getExpenses();
//     }
//   }, [user]);

//   const handleDelete = useCallback(async (id) => {
//     try {
//       const result = await deleteExpense(id);
//       if (result.success) {
//         getExpenses();
//       } else {
//         setError(result.error || 'Failed to delete expense');
//       }
//     } catch (err) {
//       setError('Failed to delete expense. Please try again.');
//     }
//   }, [deleteExpense, setError, getExpenses]);

//   const memoizedTotalExpense = useMemo(() => totalExpense(), [expenses]);

//   const totalPages = Math.ceil((expenses?.length || 0) / itemPerPage);
//   const startIndex = (page - 1) * itemPerPage;
//   const endIndex = startIndex + itemPerPage;
//   const currentExpenses = expenses?.slice(startIndex, endIndex) || [];

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };

//   if (!user) {
//     return (
//       <Container>
//         <Alert severity="warning">
//           Please log in to view your expense data.
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg">
//       <ContentContainer>
//         {/* Header Section */}
//         <Box sx={{ mb: 2, mt: 1 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//             <Typography variant="h5" component="h1">
//             </Typography>
//             <Typography
//               variant="h5"
//               color="error"
//               sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
//             >
//               Total: ₹{memoizedTotalExpense.toLocaleString()}
//             </Typography>
//           </Box>
          
//           {error && (
//             <Alert severity="error" sx={{ mb: 1 }}>
//               {error}
//             </Alert>
//           )}
//         </Box>

//         {/* Main Content */}
//         <Grid container spacing={3} sx={{ flexGrow: 1 }}>
//           {/* Form Section */}
//           <Grid item xs={12} md={6} sx={{ height: '100%' }}>
//             <StyledPaper>
//               <ContentWrapper>
//                 <ExpensesForm />
//               </ContentWrapper>
//             </StyledPaper>
//           </Grid>
          
//           {/* Expense List Section */}
//           <Grid item xs={12} md={6} sx={{ height: '100%' }}>
//             <StyledPaper>
//               <ContentWrapper>
//                 {/* Transactions info Header */}
//                 <Box 
//                   sx={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center',
//                     mb: 2,
//                     pb: 2,
//                     borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
//                   }}
//                 >
//                   <Typography variant="subtitle1" color="text.secondary">
//                     Total Transactions: {expenses?.length || 0}
//                   </Typography>
//                   <Typography variant="subtitle1" color="text.secondary">
//                     Showing {startIndex + 1}-{Math.min(endIndex, expenses?.length || 0)} of {expenses?.length || 0}
//                   </Typography>
//                 </Box>

//                 {/* Scrollable Content Area */}
//                 <Box sx={{ 
//                   overflowY: 'auto', 
//                   flexGrow: 1,
//                   mb: 2
//                 }}>


//               {loading ? (
//                   <Box display="flex" justifyContent="center" p={2}>
//                     <CircularProgress size={24} />
//                   </Box>
//                 ) : currentExpenses && currentExpenses.length > 0 ? (
//                   currentExpenses.map((expense) => (
//                     <ExpenseItem
//                       key={expense._id}
//                       id={expense._id}
//                       title={expense.title}
//                       description={expense.description}
//                       amount={expense.amount}
//                       date={expense.date}
//                       type={expense.type}
//                       category={expense.category}
//                       categories={expense.categories}
//                       deleteItem={handleDelete}
//                       fileUrl={expense.fileId ? `/api/expenses/get-file/${expense._id}` : null}
//                       fileName={expense.fileName}
//                       fileType={expense.fileType}
//                     />
//                   ))
//                 ) : (
//                   <Alert severity="info">
//                     No expense records found.
//                   </Alert>
//                 )}
//                 </Box>

//                 {/* Fixed Pagination at Bottom */}
//                 {currentExpenses && currentExpenses.length > 0 && (
//                   <Box sx={{ 
//                     mt: 'auto',
//                     pt: 2,
//                     borderTop: '1px solid rgba(0, 0, 0, 0.1)'
//                   }}>
//                     <Stack spacing={2}>
//                       <Box display="flex" justifyContent="center">
//                         <Pagination
//                           count={totalPages}
//                           page={page}
//                           onChange={handlePageChange}
//                           color="primary"
//                           shape="rounded"
//                           size="medium"
//                         />
//                       </Box>
//                     </Stack>
//                   </Box>
//                 )}
//               </ContentWrapper>
//             </StyledPaper>
//           </Grid>
//         </Grid>
//       </ContentContainer>
//     </Container>
//   );
// }

// export default Expenses;