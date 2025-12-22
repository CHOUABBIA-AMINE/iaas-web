/**
 * Navbar Component
 * Top navigation bar with logo, app name, and user actions
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

interface NavbarProps {
  onMenuClick: () => void;
  isAuthenticated?: boolean;
}

const Navbar = ({ onMenuClick, isAuthenticated = false }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {isAuthenticated && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo and App Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="IAAS Logo"
            sx={{
              height: 32,
              width: 32,
              display: 'block',
            }}
            onError={(e: any) => {
              e.target.style.display = 'none';
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: '1.25rem',
              letterSpacing: '-0.01em',
            }}
          >
            IAAS Platform
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* User Actions */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" size="small">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <AccountCircleIcon sx={{ fontSize: 20 }} />
              </Avatar>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              size="small"
              sx={{ ml: 1 }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            startIcon={<AccountCircleIcon />}
            sx={{ ml: 2 }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
