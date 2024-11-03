import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  styled,
  useTheme
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import avatar from '../../img/avatar.png';

// You can adjust this value to change the navbar height
const NAVBAR_HEIGHT = '50px';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(252, 246, 249, 0.78)',
  backdropFilter: 'blur(4.5px)',
  boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.06)',
  position: 'sticky',
  top: 0,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  minHeight: NAVBAR_HEIGHT + '!important',
  padding: theme.spacing(0, 3),
}));

const CompanyLogo = styled(Typography)(({ theme }) => ({
  color: 'rgba(34, 34, 96, 1)',
  fontWeight: 700,
  fontSize: '1.5rem',
  letterSpacing: '1px',
  cursor: 'pointer',
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));


const UserDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
}));

const UserName = styled(Typography)(({ theme }) => ({
  color: 'rgba(34, 34, 96, 1)',
  fontWeight: 500,
  fontSize: '0.7rem',
}));

const UserEmail = styled(Typography)(({ theme }) => ({
  color: 'rgba(34, 34, 96, 0.6)',
  fontSize: '0.6rem',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 35,
  height: 35,
  border: '2px solid #FFFFFF',
  background: '#fcf6f9',
  boxShadow: '0px 1px 17px rgba(0, 0, 0, 0.06)',
}));

function TopNavbar() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <StyledAppBar>
      <StyledToolbar>
        {/* Company Logo/Name */}
        <CompanyLogo variant="h6">
          Juntrax
        </CompanyLogo>

        {/* User Information */}
        <UserInfo>

          <StyledAvatar src={avatar}>
            {!user?.avatar && (user?.name?.charAt(0).toUpperCase() || 'U')}
          </StyledAvatar>

          <UserDetails>
            <UserName>
              {user?.name || 'User Name'}
            </UserName>
            <UserEmail>
              {user?.email || 'user@example.com'}
            </UserEmail>
          </UserDetails>
          
        </UserInfo>
      </StyledToolbar>
    </StyledAppBar>
  );
}

export default TopNavbar;