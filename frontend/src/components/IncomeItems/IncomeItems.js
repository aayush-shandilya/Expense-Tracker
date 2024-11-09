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
import { useGlobalContext } from '../../context/globalContext'; // Add this import

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
  const { downloadIncomeFile } = useGlobalContext(); // Add this
  const [previewOpen, setPreviewOpen] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString();
  const isImage = fileType?.startsWith('image/');
  const hasFile = Boolean(fileName && fileType); // Add this

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handleDownload = async () => {
    if (!hasFile || !id) return;
    
    try {
      await downloadIncomeFile(id, fileName, fileType);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handlePreview = () => {
    if (isImage) {
      handlePreviewOpen();
    } else {
      handleDownload();
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
                  onClick={handlePreview}
                >
                  {isImage ? <ImageIcon fontSize="small" /> : <AttachFileIcon fontSize="small" />}
                  {fileName}
                </Typography>
              )}
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography 
                variant="subtitle1" 
                color="success.main" 
                sx={{ fontFamily: 'Roboto, sans-serif' }}
              >
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
      </Card>

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

export default IncomeItems;