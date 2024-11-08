// // import React from 'react';
// // import styled from 'styled-components';
// // import { dateFormat } from '../../utils/dateFormat';
// // import { getCategoryLabel } from '../../config/categories';
// // import {
// //     bitcoin, book, calender, card, circle, clothing,
// //     comment, dollar, food, freelance, medical, money,
// //     piggy, stocks, takeaway, trash, tv, users, yt
// // } from '../../utils/icon';
// // import Button from '../Button/Button';

// // const IncomeItem = ({
// //     id,
// //     title,
// //     amount,
// //     date,
// //     category,
// //     categories,
// //     description,
// //     deleteItem,
// //     indicatorColor,
// //     type
// // }) => {
// //     const categoryIcon = () => {
// //         switch(category) {
// //             case 'salary':
// //                 return money;
// //             case 'freelancing':
// //                 return freelance;
// //             case 'investments':
// //                 return stocks;
// //             case 'stocks':
// //                 return users;
// //             case 'bitcoin':
// //                 return bitcoin;
// //             case 'bank':
// //                 return card;
// //             case 'youtube':
// //                 return yt;
// //             case 'other':
// //                 return piggy;
// //             default:
// //                 return '';
// //         }
// //     };

// //     const expenseCatIcon = () => {
// //         switch (category) {
// //             case 'education':
// //                 return book;
// //             case 'groceries':
// //                 return food;
// //             case 'health':
// //                 return medical;
// //             case 'subscriptions':
// //                 return tv;
// //             case 'takeaways':
// //                 return takeaway;
// //             case 'clothing':
// //                 return clothing;
// //             case 'travelling':
// //                 return freelance;
// //             case 'other':
// //                 return circle;
// //             default:
// //                 return '';
// //         }
// //     };

// //     return (
// //         <IncomeItemStyled $indicatorColor={indicatorColor}>
// //             <div className="icon">
// //                 {type === 'expense' ? expenseCatIcon() : categoryIcon()}
// //             </div>
// //             <div className="content">
// //                 <h5>{title}</h5>
// //                 <div className="inner-content">
// //                     <div className="text">
// //                         <p>{dollar} {amount}</p>
// //                         <p>{calender} {dateFormat(date)}</p>
// //                         <p>
// //                             {comment}
// //                             {description}
// //                         </p>
// //                     </div>
// //                     <div className="btn-con">
// //                         <Button
// //                             icon={trash}
// //                             onClick={() => deleteItem(id)}
// //                             bg={'#ff000d'}
// //                             bPad={'.4rem'}
// //                             bRad={'50%'}
// //                             color={'#fff'}
// //                             iColor={'#fff'}
// //                             hColor={'var(--color-green)'}
// //                         />
// //                     </div>
// //                     <div className="category">
// //                         {categories ? (
// //                             Array.isArray(categories)
// //                                 ? categories.map((cat, index) => (
// //                                     <span key={index}>
// //                                         {getCategoryLabel(cat)}
// //                                         {index < categories.length - 1 ? ', ' : ''}
// //                                     </span>
// //                                 ))
// //                                 : getCategoryLabel(category)
// //                         ) : getCategoryLabel(category)}
// //                     </div>
// //                 </div>
// //             </div>
// //         </IncomeItemStyled>
// //     );
// // };

// // const IncomeItemStyled = styled.div`
// //     background: #FCF6F9;
// //     border: 2px solid #FFFFFF;
// //     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
// //     border-radius: 20px;
// //     padding: 1rem;
// //     margin-bottom: 1rem;
// //     display: flex;
// //     align-items: center;
// //     gap: 1rem;
// //     width: 100%;
// //     color: #222260;
// //     border-left: 5px solid ${props => props.$indicatorColor};
    
// //     .icon {
// //         width: 80px;
// //         height: 80px;
// //         border-radius: 20px;
// //         background: #F5F5F5;
// //         display: flex;
// //         align-items: center;
// //         justify-content: center;
// //         border: 2px solid #FFFFFF;
// //         i {
// //             font-size: 2.6rem;
// //         }
// //     }

// //     .content {
// //         flex: 1;
// //         display: flex;
// //         flex-direction: column;
// //         gap: .2rem;
        
// //         h5 {
// //             font-size: 1.3rem;
// //             padding-left: 2rem;
// //             position: relative;
// //             &::before {
// //                 content: '';
// //                 position: absolute;
// //                 left: 0;
// //                 top: 50%;
// //                 transform: translateY(-50%);
// //                 width: .8rem;
// //                 height: .8rem;
// //                 border-radius: 50%;
// //                 background: ${props => props.$indicatorColor};
// //             }
// //         }

// //         .inner-content {
// //             display: flex;
// //             justify-content: space-between;
// //             align-items: center;
            
// //             .text {
// //                 display: flex;
// //                 align-items: center;
// //                 gap: 1.5rem;
// //                 p {
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 0.5rem;
// //                     color: var(--primary-color);
// //                     opacity: 0.8;
// //                 }
// //             }
// //         }
// //     }
// // `;

// // export default IncomeItem;




// import React, { useState } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   Box, 
//   Typography, 
//   IconButton,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DownloadIcon from '@mui/icons-material/Download';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import ImageIcon from '@mui/icons-material/Image';
// import CloseIcon from '@mui/icons-material/Close';

// const IncomeItems = ({ 
//   id, 
//   title, 
//   amount, 
//   date, 
//   category, 
//   description, 
//   deleteItem,
//   fileUrl,
//   fileName,
//   fileType 
// }) => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const formattedDate = new Date(date).toLocaleDateString();
//   const isImage = fileType?.startsWith('image/');

//   const handlePreviewOpen = () => {
//     setPreviewOpen(true);
//   };

//   const handlePreviewClose = () => {
//     setPreviewOpen(false);
//   };
// const handleDownload = async () => {
//   if (isDownloading) return;
//   setIsDownloading(true);

//   try {
//       if (!id || !fileName) {
//           throw new Error('File information is missing');
//       }

//       // First check if the file exists
//       const checkUrl = `/api/v1/files/check/${id}`;
//       const checkResponse = await fetch(checkUrl, {
//           headers: {
//               'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//           credentials: 'include',
//       });

//       const checkResult = await checkResponse.json();
      
//       if (!checkResult.success || !checkResult.fileExists) {
//           throw new Error(checkResult.error || 'File not found');
//       }

//       // Proceed with download
//       const downloadUrl = `/api/v1/files/download/${id}`;
//       console.log('Starting download:', {
//           url: downloadUrl,
//           fileName,
//           fileType
//       });

//       const response = await fetch(downloadUrl, {
//           method: 'GET',
//           headers: {
//               'Authorization': `Bearer ${localStorage.getItem('token')}`,
//               'Accept': '*/*'
//           },
//           credentials: 'include'
//       });

//       if (!response.ok) {
//           throw new Error(`Download failed: ${response.statusText}`);
//       }

//       const contentType = response.headers.get('content-type');
//       const blob = await response.blob();
//       console.log('Download response:', {
//           contentType,
//           size: blob.size
//       });

//       // Create download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.style.display = 'none';
//       link.href = url;
//       link.download = fileName;

//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       setTimeout(() => {
//           document.body.removeChild(link);
//           window.URL.revokeObjectURL(url);
//       }, 100);

//   } catch (error) {
//       console.error('Download error:', error);
//       setError(error.message || 'Failed to download file');
//   } finally {
//       setIsDownloading(false);
//   }
// };


//   // Helper function to get file icon
//   const getFileIcon = () => {
//     if (isImage) return <ImageIcon />;
//     return <AttachFileIcon />;
//   };

//   return (
//     <>
//       <Card sx={{ 
//         backgroundColor: '#FCF6F9',
//         borderRadius: '15px',
//         marginBottom: 1,
//         boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)'
//       }}>
//         <CardContent sx={{ padding: 1.5, '&:last-child': { paddingBottom: 1.5 } }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Box>
//               <Typography 
//                 variant="subtitle1" 
//                 component="div" 
//                 color="primary" 
//                 sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
//               >
//                 {title}
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 color="text.secondary" 
//                 sx={{ fontSize: '0.8rem', fontFamily: 'Roboto, sans-serif' }}
//               >
//                 {category} • {formattedDate}
//               </Typography>
//               {fileName && (
//                 <Typography 
//                   variant="caption" 
//                   color="text.secondary" 
//                   sx={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: 0.5,
//                     marginTop: 0.5 
//                   }}
//                 >
//                   {getFileIcon()}
//                   {fileName}
//                 </Typography>
//               )}
//             </Box>
//             <Box display="flex" alignItems="center" gap={1}>
//               <Typography 
//                 variant="subtitle1" 
//                 color="success.main" 
//                 sx={{ fontFamily: 'Roboto, sans-serif' }}
//               >
//                 ₹{amount.toLocaleString()}
//               </Typography>
//               {fileName && (
//                 <IconButton
//                   onClick={handleDownload}
//                   color="primary"
//                   size="small"
//                   disabled={isDownloading}
//                   title="Download File"
//                 >
//                   <DownloadIcon fontSize="small" />
//                 </IconButton>
//               )}
//               <IconButton
//                 onClick={() => deleteItem(id)}
//                 color="error"
//                 size="small"
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>

//       <Snackbar 
//         open={!!error} 
//         autoHideDuration={6000} 
//         onClose={() => setError(null)}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//       >
//         <Alert 
//           onClose={() => setError(null)} 
//           severity="error" 
//           variant="filled"
//           sx={{ width: '100%' }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>

//       <Dialog
//         open={previewOpen}
//         onClose={handlePreviewClose}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center' 
//         }}>
//           <Typography variant="h6">{fileName || 'Attachment'}</Typography>
//           <IconButton onClick={handlePreviewClose} size="small">
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ 
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           gap: 2
//         }}>
//           {isImage ? (
//             <Box
//               component="img"
//               src={`/api/income/get-file/${id}`}
//               alt={fileName}
//               sx={{ 
//                 maxWidth: '100%',
//                 maxHeight: '70vh',
//                 objectFit: 'contain'
//               }}
//             />
//           ) : (
//             <Box sx={{ textAlign: 'center' }}>
//               <AttachFileIcon sx={{ fontSize: 60, color: 'primary.main' }} />
//               <Typography sx={{ mt: 2 }}>
//                 {fileName}
//               </Typography>
//             </Box>
//           )}
//           <Button
//             variant="contained"
//             startIcon={<DownloadIcon />}
//             onClick={handleDownload}
//             disabled={isDownloading}
//             sx={{ mt: 2, bgcolor: 'primary.main' }}
//           >
//             {isDownloading ? 'Downloading...' : 'Download'}
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default IncomeItems;


import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';

const IncomeItems = ({ 
  id, 
  title, 
  amount, 
  date, 
  category, 
  description, 
  deleteItem,
  fileUrl,
  fileName,
  fileType 
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString();
  const isImage = fileType?.startsWith('image/');

  // Add console.log to debug props
  console.log('Income Item Props:', { id, fileUrl, fileName, fileType });

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handleDownload = async () => {
    if (!fileUrl) return;
    
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <>
      <Card sx={{ 
        backgroundColor: '#FCF6F9',
        borderRadius: '15px',
        marginBottom: 1,
        boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.06)'
      }}>
        <CardContent sx={{ padding: 1.5, '&:last-child': { paddingBottom: 1.5 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography 
                variant="subtitle1" 
                component="div" 
                color="primary" 
                sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
              >
                {title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: '0.8rem', fontFamily: 'Roboto, sans-serif' }}
              >
                {category} • {formattedDate}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography 
                variant="subtitle1" 
                color="success.main" 
                sx={{ fontFamily: 'Roboto, sans-serif' }}
              >
                ₹{amount.toLocaleString()}
              </Typography>
              {/* Always show download button for testing */}
              <IconButton
                onClick={handleDownload}
                color="primary"
                size="small"
                title="Download File"
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
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
      </Card>

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
          gap: 2
        }}>
          {isImage ? (
            <Box
              component="img"
              src={fileUrl}
              alt={fileName}
              sx={{ 
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain'
              }}
            />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <AttachFileIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              <Typography sx={{ mt: 2 }}>
                {fileName}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ mt: 2, bgcolor: 'primary.main' }}
          >
            Download
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncomeItems;