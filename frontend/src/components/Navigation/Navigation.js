import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/globalContext';
import { useAuth } from '../../context/AuthContext';
import { menuItems } from '../../utils/menuItems';
import avatar from '../../img/avatar.png';

const getDrawerWidth = (screenWidth) => {
  if (screenWidth < 600) return '200px';
  if (screenWidth < 960) return '220px';
  return '250px';
};
const StyledDrawer = styled(Drawer)(({ theme, drawerwidth }) => ({
  width: drawerwidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerwidth,
    height: '100%',
    margin:0,
    padding: theme.spacing(2),
    position: 'static',
   
  }
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: '3.5rem',
  height: '3.5rem',
  border: '2px solid #FFFFFF',
  padding: 2,
  background: '#fcf6f9',
  boxShadow: '0px 1px 17px rgba(0, 0, 0, 0.06)',
  [theme.breakpoints.down('sm')]: {
    width: '2.5rem',
    height: '2.5rem',
  }
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  color: active ? 'rgba(34, 34, 96, 1)' : 'rgba(34, 34, 96, 0.6)',
  borderLeft: active ? '4px solid #222260' : '4px solid transparent',
  paddingLeft: theme.spacing(2),
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(34, 34, 96, 0.1)',
    color: 'rgba(34, 34, 96, 1)'
  }
}));

function Navigation({ active, setActive, BaseContainer }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const screenWidth = window.innerWidth;
  const drawerWidth = getDrawerWidth(screenWidth);

  const { totalBalance } = useGlobalContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <BaseContainer>
    <StyledDrawer
      variant="permanent"
      anchor="left"
      drawerwidth={drawerWidth}
    >
      <DrawerContent>
        <UserSection>
          <UserAvatar 
            src={avatar} 
            alt="User Avatar"
            onError={(e) => {
              e.target.src = '';
              return true;
            }}
          >
            <AccountCircleIcon sx={{ width: '60%', height: '60%' }} />
          </UserAvatar>
          <Box sx={{ minWidth: 0 }}> {/* Prevent text overflow */}
            <Typography 
              variant={isMobile ? "body1" : "h6"}
              sx={{ 
                color: 'rgba(34, 34, 96, 1)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {user?.name || 'User'}
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"}
              sx={{ 
                color: 'rgba(34, 34, 96, 0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <span>₹</span> {totalBalance()}
            </Typography>
          </Box>
        </UserSection>

        <Divider sx={{ mb: 1.5 }} />

        <List sx={{ 
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(34, 34, 96, 0.2)',
            borderRadius: '4px'
          }
        }}>
          {menuItems.map((item) => (
            <StyledListItem
              key={item.id}
              onClick={() => setActive(item.id)}
              active={active === item.id}
              button
            >
              <ListItemIcon sx={{ 
                color: active === item.id ? 'rgba(34, 34, 96, 1)' : 'rgba(34, 34, 96, 0.6)',
                minWidth: isMobile ? 32 : 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                primaryTypographyProps={{
                  sx: { 
                    fontWeight: active === item.id ? 500 : 400,
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }
                }}
              />
            </StyledListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Divider />
          <StyledListItem 
            onClick={handleSignOut} 
            button
            sx={{ mt: 1 }}
          >
            <ListItemIcon sx={{ 
              minWidth: isMobile ? 32 : 40,
              color: 'rgba(34, 34, 96, 0.6)'
            }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Sign Out"
              primaryTypographyProps={{
                sx: { 
                  color: 'rgba(34, 34, 96, 0.6)',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }
              }}
            />
          </StyledListItem>
        </Box>
      </DrawerContent>
    </StyledDrawer>
    </BaseContainer>
  );
}

export default Navigation;