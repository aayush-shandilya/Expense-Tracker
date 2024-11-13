// // //frontend/income/Income.js
// // import React, { useEffect, useCallback, useMemo, useState } from 'react';
// // import {
// //   Box,
// //   Typography,
// //   Paper,
// //   Container,
// //   Grid,
// //   CircularProgress,
// //   Alert,
// //   Card,
// //   CardContent,
// //   styled,
// //   Pagination,
// //   Stack
// // } from '@mui/material';
// // import { useGlobalContext } from '../../context/globalContext';
// // import Form from '../Form/Form';
// // // Import the IncomeItem component from its own file
// // import IncomeItems from '../IncomeItems/IncomeItems';

// // // Styled components remain the same
// // const ContentContainer = styled(Box)(({ theme }) => ({
// //   height: 'calc(100vh - 100px)',
// //   display: 'flex',
// //   flexDirection: 'column',
// // }));

// // const StyledPaper = styled(Paper)(({ theme }) => ({
// //   height: '100%',
// //   backgroundColor: '#FCF6F9',
// //   borderRadius: '15px',
// //   boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)',
// //   display: 'flex',
// //   flexDirection: 'column',
// // }));

// // const ContentWrapper = styled(Box)(({ theme }) => ({
// //   padding: theme.spacing(2),
// //   flexGrow: 1,
// //   display: 'flex',
// //   flexDirection: 'column',
// //   minHeight: 0,
// //   '&::-webkit-scrollbar': {
// //     width: '8px',
// //   },
// //   '&::-webkit-scrollbar-track': {
// //     background: '#f1f1f1',
// //     borderRadius: '4px',
// //   },
// //   '&::-webkit-scrollbar-thumb': {
// //     background: '#888',
// //     borderRadius: '4px',
// //   },
// //   '&::-webkit-scrollbar-thumb:hover': {
// //     background: '#555',
// //   },
// // }));

// // // Main Income Component
// // function Income() {
// //   const {
// //     addIncome,
// //     incomes,
// //     getIncomes,
// //     deleteIncome,
// //     totalIncome,
// //     loading,
// //     error,
// //     user
// //   } = useGlobalContext();

// //   const [page, setPage] = useState(1);
// //   const itemPerPage = 5;

// //   useEffect(() => {
// //     if (user) {
// //       getIncomes();
// //     }
// //   }, [user]);

// //   const handleDelete = useCallback(async (id) => {
// //     await deleteIncome(id);
// //     getIncomes();
// //   }, [deleteIncome, getIncomes]);

// //   const memoizedTotalIncome = useMemo(() => totalIncome(), [incomes]);

// //   // Pagination calculations
// //   const totalPages = Math.ceil((incomes?.length || 0) / itemPerPage);
// //   const startIndex = (page - 1) * itemPerPage;
// //   const endIndex = startIndex + itemPerPage;
// //   const currentIncomes = incomes?.slice(startIndex, endIndex) || [];

  
// //   const handlePageChange = (event, newPage) => {
// //     setPage(newPage);
// //   };

// //   if (!user) {
// //     return (
// //       <Container>
// //         <Alert severity="warning">
// //           Please login to view your income data.
// //         </Alert>
// //       </Container>
// //     );
// //   }

// //   return (
// //     <Container maxWidth="lg">
// //       <ContentContainer>
// //         {/* Header Section */}
// //         <Box sx={{ mb: 2, mt: 1 }}>
// //           <Box sx={{ 
// //             display: 'flex', 
// //             justifyContent: 'space-between', 
// //             alignItems: 'center', 
// //             mb: 1 
// //           }}>
// //             <Typography variant="h5" component="h1" />
// //             <Typography
// //               variant="h5"
// //               color="primary.main"
// //               sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
// //             >
// //               Total Income: ₹{memoizedTotalIncome.toLocaleString()}
// //             </Typography>
// //           </Box>
          
// //           {error && (
// //             <Alert severity="error" sx={{ mb: 1 }}>
// //               {error}
// //             </Alert>
// //           )}
// //         </Box>

// //         {/* Main Content */}
// //         <Grid container spacing={3} sx={{ flexGrow: 1 }}>
// //           {/* Form Section */}
// //           <Grid item xs={12} md={6} sx={{ height: '100%' }}>
// //             <StyledPaper>
// //               <ContentWrapper>
// //                 <Form />
// //               </ContentWrapper>
// //             </StyledPaper>
// //           </Grid>
          
// //           {/* Income List Section */}
// //           <Grid item xs={12} md={6} sx={{ height: '100%' }}>
// //             <StyledPaper>
// //               <ContentWrapper>
// //                 {/* Transactions info Header */}
// //                 <Box 
// //                   sx={{ 
// //                     display: 'flex', 
// //                     justifyContent: 'space-between', 
// //                     alignItems: 'center',
// //                     mb: 2,
// //                     pb: 2,
// //                     borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
// //                   }}
// //                 >
// //                   <Typography variant="subtitle1" color="text.secondary">
// //                     Total Transactions: {incomes?.length || 0}
// //                   </Typography>
// //                   <Typography variant="subtitle1" color="text.secondary">
// //                     Showing {startIndex + 1}-{Math.min(endIndex, incomes?.length || 0)} of {incomes?.length || 0}
// //                   </Typography>
// //                 </Box>

// //                 {/* Scrollable Content Area */}
// //                 <Box sx={{ 
// //                   overflowY: 'auto', 
// //                   flexGrow: 1,
// //                   mb: 2
// //                 }}>
// //                   {loading ? (
// //                     <Box display="flex" justifyContent="center" p={2}>
// //                       <CircularProgress size={24} />
// //                     </Box>
// //                   ) : currentIncomes && currentIncomes.length > 0 ? (
// //                     currentIncomes.map((income) => (
// //                       <IncomeItems
// //                         key={income._id}
// //                         id={income._id}
// //                         title={income.title}
// //                         description={income.description}
// //                         amount={income.amount}
// //                         date={income.date}
// //                         type={income.type}
// //                         category={income.category}
// //                         deleteItem={handleDelete}
// //                         fileUrl={income.fileId ? `/api/income/get-file/${income._id}` : null}
// //                         fileName={income.fileName}
// //                         fileType={income.fileType}
// //                       />
// //                     ))
// //                   ) : (
// //                     <Alert severity="info">
// //                       No income records found.
// //                     </Alert>
// //                   )}
// //                 </Box>

// //                 {/* Pagination */}
// //                 {currentIncomes && currentIncomes.length > 0 && (
// //                   <Box sx={{ 
// //                     mt: 'auto',
// //                     pt: 2,
// //                     borderTop: '1px solid rgba(0, 0, 0, 0.1)'
// //                   }}>
// //                     <Stack spacing={2}>
// //                       <Box display="flex" justifyContent="center">
// //                         <Pagination
// //                           count={totalPages}
// //                           page={page}
// //                           onChange={handlePageChange}
// //                           color="primary"
// //                           shape="rounded"
// //                           size="medium"
// //                         />
// //                       </Box>
// //                     </Stack>
// //                   </Box>
// //                 )}
// //               </ContentWrapper>
// //             </StyledPaper>
// //           </Grid>
// //         </Grid>
// //       </ContentContainer>
// //     </Container>
// //   );
// // }

// // export default Income;



// import React, { useEffect, useCallback, useMemo, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Container,
//   Grid,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   styled,
//   Pagination,
//   Stack
// } from '@mui/material';
// import { useGlobalContext } from '../../context/globalContext';
// import Form from '../Form/Form';
// import IncomeItems from '../IncomeItems/IncomeItems';

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
//   const itemsPerPage = 5;

//   useEffect(() => {
//     if (user) {
//       getIncomes(page, itemsPerPage);
//     }
//   }, [user, page]); // Added page to dependencies

//   const handleDelete = useCallback(async (id) => {
//     await deleteIncome(id);
//     // Refresh data for current page
//     getIncomes(page, itemsPerPage);
//   }, [deleteIncome, getIncomes, page]);

//   const memoizedTotalIncome = useMemo(() => totalIncome(), [incomes]);

//   // Get the records for current page
//   const currentPageIncomes = useMemo(() => {
//     if (!incomes?.length) return [];
//     const startIndex = (page - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return incomes.slice(startIndex, endIndex);
//   }, [incomes, page, itemsPerPage]);

//   // Calculate total pages based on total records
//   const totalPages = Math.ceil((incomes?.length || 0) / itemsPerPage);

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
//                     Showing {((page - 1) * itemsPerPage) + 1}-{Math.min(page * itemsPerPage, incomes?.length || 0)} of {incomes?.length || 0}
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
//                   ) : currentPageIncomes && currentPageIncomes.length > 0 ? (
//                     currentPageIncomes.map((income) => (
//                       <IncomeItems
//                         key={income._id}
//                         id={income._id}
//                         title={income.title}
//                         description={income.description}
//                         amount={income.amount}
//                         date={income.date}
//                         type={income.type}
//                         category={income.category}
//                         deleteItem={handleDelete}
//                         fileUrl={income.fileId ? `/api/income/get-file/${income._id}` : null}
//                         fileName={income.fileName}
//                         fileType={income.fileType}
//                       />
//                     ))
//                   ) : (
//                     <Alert severity="info">
//                       No income records found.
//                     </Alert>
//                   )}
//                 </Box>

//                 {/* Pagination */}
//                 {currentPageIncomes && currentPageIncomes.length > 0 && (
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
  Button,
  styled,
} from '@mui/material';
import { useGlobalContext } from '../../context/globalContext';
import Form from '../Form/Form';
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

function Income() {
  const {
    addIncome,
    incomes,
    getIncomes,
    deleteIncome,
    totalIncome,
    loading,
    error,
    user,
    totalIncomeAmount,
    getTotalIncome
  } = useGlobalContext();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 5;

  // // Initial load
  // useEffect(() => {
  //   if (user) {
  //     loadInitialIncomes();
  //   }
  // }, [user]);

  useEffect(() => {
    if (user) {
      getTotalIncome(); // Get total amount immediately
      getIncomes(1, 5); // Get first page of transactions
    }
  }, [user]);

  const loadInitialIncomes = async () => {
    setPage(1);
    await getIncomes(1, itemsPerPage);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const response = await getIncomes(nextPage, itemsPerPage);
      if (response?.data?.length < itemsPerPage) {
        setHasMore(false);
      }
      setPage(nextPage);
    } catch (err) {
      console.error('Error loading more incomes:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    await deleteIncome(id);
    loadInitialIncomes(); // Reload from first page after deletion
  }, [deleteIncome]);

  const memoizedTotalIncome = useMemo(() => totalIncome(), [incomes]);

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
              Total Income: ₹{totalIncomeAmount.toLocaleString()}
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
                    Showing Recent Transactions
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
                  ) : incomes && incomes.length > 0 ? (
                    <>
                      {incomes.map((income) => (
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
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                            ) : null}
                            {loadingMore ? 'Loading...' : 'Load More'}
                          </Button>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Alert severity="info">
                      No income records found.
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

export default Income;