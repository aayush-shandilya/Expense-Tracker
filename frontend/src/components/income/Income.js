// import React, { useEffect, useCallback, useMemo, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Container,
//   Grid,
//   CircularProgress,
//   Alert,
//   IconButton,
//   Card,
//   CardContent,
//   styled,
//   Pagination,
//   Stack
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useGlobalContext } from '../../context/globalContext';
// import Form from '../Form/Form';

// // Styled components
// const ContentContainer = styled(Box)(({ theme }) => ({
//   height: 'calc(100vh - 100px)',
//   display: 'flex',
//   flexDirection: 'column',
// }));

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   height: '100%',
//   backgroundColor: '#FCF6F9',
//   borderRadius: '15px',
//   boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)',
//   display: 'flex',
//   flexDirection: 'column',
// }));

// const ContentWrapper = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   flexGrow: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   minHeight: 0,
//   '&::-webkit-scrollbar': {
//     width: '8px',
//   },
//   '&::-webkit-scrollbar-track': {
//     background: '#f1f1f1',
//     borderRadius: '4px',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     background: '#888',
//     borderRadius: '4px',
//   },
//   '&::-webkit-scrollbar-thumb:hover': {
//     background: '#555',
//   },
// }));

// const IncomeItemCard = styled(Card)(({ theme }) => ({
//   backgroundColor: '#FCF6F9',
//   borderRadius: '15px',
//   marginBottom: theme.spacing(1),
//   boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)',
//   '& .MuiCardContent-root': {
//     padding: theme.spacing(1.5),
//     '&:last-child': {
//       paddingBottom: theme.spacing(1.5),
//     },
//   },
// }));

// // Income Item Component
// const IncomeItem = ({ id, title, amount, date, category, description, deleteItem }) => {
//   const formattedDate = new Date(date).toLocaleDateString();
  
//   return (
//     <IncomeItemCard>
//       <CardContent>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Box>
//             <Typography 
//               variant="subtitle1" 
//               component="div" 
//               color="primary" 
//               sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
//             >
//               {title}
//             </Typography>
//             <Typography 
//               variant="body2" 
//               color="text.secondary" 
//               sx={{ fontSize: '0.8rem', fontFamily: 'Roboto, sans-serif' }}
//             >
//               {category} • {formattedDate}
//             </Typography>
//           </Box>
//           <Box display="flex" alignItems="center">
//             <Typography 
//               variant="subtitle1" 
//               color="success.main" 
//               sx={{ mr: 1, fontFamily: 'Roboto, sans-serif' }}
//             >
//               ₹{amount.toLocaleString()}
//             </Typography>
//             <IconButton
//               onClick={() => deleteItem(id)}
//               color="error"
//               size="small"
//             >
//               <DeleteIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         </Box>
//       </CardContent>
//     </IncomeItemCard>
//   );
// };

// // Main Income Component
// function Income() {
//   const {
//     addIncome,
//     incomes,
//     getIncomes,
//     deleteIncome,
//     totalIncome,
//     loading,
//     error,
//     user
//   } = useGlobalContext();

//   const [page, setPage] = useState(1);
//   const itemPerPage = 5;

//   useEffect(() => {
//     if (user) {
//       getIncomes();
//     }
//   }, [user]);

//   const handleDelete = useCallback(async (id) => {
//     await deleteIncome(id);
//     getIncomes();
//   }, [deleteIncome, getIncomes]);

//   const memoizedTotalIncome = useMemo(() => totalIncome(), [incomes]);

//   // Pagination calculations
//   const totalPages = Math.ceil((incomes?.length || 0) / itemPerPage);
//   const startIndex = (page - 1) * itemPerPage;
//   const endIndex = startIndex + itemPerPage;
//   const currentIncomes = incomes?.slice(startIndex, endIndex) || [];

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };

//   if (!user) {
//     return (
//       <Container>
//         <Alert severity="warning">
//           Please login to view your income data.
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg">
//       <ContentContainer>
//         {/* Header Section */}
//         <Box sx={{ mb: 2, mt: 1 }}>
//           <Box sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center', 
//             mb: 1 
//           }}>
//             <Typography variant="h5" component="h1" />
//             <Typography
//               variant="h5"
//               color="primary.main"
//               sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
//             >
//               Total Income: ₹{memoizedTotalIncome.toLocaleString()}
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
//                 <Form />
//               </ContentWrapper>
//             </StyledPaper>
//           </Grid>
          
//           {/* Income List Section */}
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
//                     Total Transactions: {incomes?.length || 0}
//                   </Typography>
//                   <Typography variant="subtitle1" color="text.secondary">
//                     Showing {startIndex + 1}-{Math.min(endIndex, incomes?.length || 0)} of {incomes?.length || 0}
//                   </Typography>
//                 </Box>

//                 {/* Scrollable Content Area */}
//                 <Box sx={{ 
//                   overflowY: 'auto', 
//                   flexGrow: 1,
//                   mb: 2
//                 }}>
//                   {loading ? (
//                     <Box display="flex" justifyContent="center" p={2}>
//                       <CircularProgress size={24} />
//                     </Box>
//                   ) : currentIncomes && currentIncomes.length > 0 ? (
//                     currentIncomes.map((income) => (
//                       <IncomeItem
//                         key={income._id}
//                         id={income._id}
//                         title={income.title}
//                         description={income.description}
//                         amount={income.amount}
//                         date={income.date}
//                         type={income.type}
//                         category={income.category}
//                         deleteItem={handleDelete}
//                       />
//                     ))
//                   ) : (
//                     <Alert severity="info">
//                       No income records found.
//                     </Alert>
//                   )}
//                 </Box>

//                 {/* Fixed Pagination at Bottom */}
//                 {currentIncomes && currentIncomes.length > 0 && (
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

// export default Income;


import React, { useEffect, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  styled,
  Pagination,
  Stack
} from '@mui/material';
import { useGlobalContext } from '../../context/globalContext';
import Form from '../Form/Form';
// Import the IncomeItem component from its own file
import IncomeItems from '../IncomeItems/IncomeItems';

// Styled components remain the same
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

// Main Income Component
function Income() {
  const {
    addIncome,
    incomes,
    getIncomes,
    deleteIncome,
    totalIncome,
    loading,
    error,
    user
  } = useGlobalContext();

  const [page, setPage] = useState(1);
  const itemPerPage = 5;

  useEffect(() => {
    if (user) {
      getIncomes();
    }
  }, [user]);

  const handleDelete = useCallback(async (id) => {
    await deleteIncome(id);
    getIncomes();
  }, [deleteIncome, getIncomes]);

  const memoizedTotalIncome = useMemo(() => totalIncome(), [incomes]);

  // Pagination calculations
  const totalPages = Math.ceil((incomes?.length || 0) / itemPerPage);
  const startIndex = (page - 1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;
  const currentIncomes = incomes?.slice(startIndex, endIndex) || [];

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">
          Please login to view your income data.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <ContentContainer>
        {/* Header Section */}
        <Box sx={{ mb: 2, mt: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 1 
          }}>
            <Typography variant="h5" component="h1" />
            <Typography
              variant="h5"
              color="primary.main"
              sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
            >
              Total Income: ₹{memoizedTotalIncome.toLocaleString()}
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
                <Form />
              </ContentWrapper>
            </StyledPaper>
          </Grid>
          
          {/* Income List Section */}
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
                    Total Transactions: {incomes?.length || 0}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Showing {startIndex + 1}-{Math.min(endIndex, incomes?.length || 0)} of {incomes?.length || 0}
                  </Typography>
                </Box>

                {/* Scrollable Content Area */}
                <Box sx={{ 
                  overflowY: 'auto', 
                  flexGrow: 1,
                  mb: 2
                }}>
                  {loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : currentIncomes && currentIncomes.length > 0 ? (
                    currentIncomes.map((income) => (
                      <IncomeItems
                        key={income._id}
                        id={income._id}
                        title={income.title}
                        description={income.description}
                        amount={income.amount}
                        date={income.date}
                        type={income.type}
                        category={income.category}
                        deleteItem={handleDelete}
                        fileUrl={income.fileId ? `/api/income/get-file/${income._id}` : null}
                        fileName={income.fileName}
                        fileType={income.fileType}
                      />
                    ))
                  ) : (
                    <Alert severity="info">
                      No income records found.
                    </Alert>
                  )}
                </Box>

                {/* Pagination */}
                {currentIncomes && currentIncomes.length > 0 && (
                  <Box sx={{ 
                    mt: 'auto',
                    pt: 2,
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <Stack spacing={2}>
                      <Box display="flex" justifyContent="center">
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          shape="rounded"
                          size="medium"
                        />
                      </Box>
                    </Stack>
                  </Box>
                )}
              </ContentWrapper>
            </StyledPaper>
          </Grid>
        </Grid>
      </ContentContainer>
    </Container>
  );
}

export default Income;