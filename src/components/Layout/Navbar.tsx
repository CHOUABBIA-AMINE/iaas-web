import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
} from '@mui/material'
import { KeyboardArrowDown } from '@mui/icons-material'

function Navbar() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({})
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('auth_token')
  )

  const handleMenuOpen = (menuId: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl({ ...anchorEl, [menuId]: event.currentTarget })
  }

  const handleMenuClose = (menuId: string) => {
    setAnchorEl({ ...anchorEl, [menuId]: null })
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    setAnchorEl({})
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigate('/')
    setAnchorEl({})
  }

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#2e7d32', zIndex: 1300 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'white',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#2e7d32',
              fontSize: 20,
            }}
          >
            R
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            RAAS
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, ml: 4, display: 'flex', gap: 1 }}>
          {/* Common Menu */}
          <Button
            color="inherit"
            endIcon={<KeyboardArrowDown />}
            onClick={(e) => handleMenuOpen('common', e)}
            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Common
          </Button>
          <Menu
            anchorEl={anchorEl['common']}
            open={Boolean(anchorEl['common'])}
            onClose={() => handleMenuClose('common')}
            PaperProps={{
              sx: { minWidth: 200 }
            }}
          >
            <MenuItem onClick={() => handleNavigate('/common/structure')}>Structure</MenuItem>
            <MenuItem onClick={() => handleNavigate('/common/job')}>Job</MenuItem>
            <MenuItem onClick={() => handleNavigate('/common/person')}>Person</MenuItem>
            <MenuItem onClick={() => handleNavigate('/common/employee')}>Employee</MenuItem>
            <MenuItem onClick={() => handleNavigate('/common/archivebox')}>Archive Box</MenuItem>
            <MenuItem onClick={() => handleNavigate('/common/folder')}>Folder</MenuItem>
            <MenuItem onClick={() => handleNavigate('/common/mail')}>Mail</MenuItem>
            <MenuItem onClick={() => handleNavigate('/common/document')}>Document</MenuItem>
          </Menu>

          {/* Business Menu */}
          <Button
            color="inherit"
            endIcon={<KeyboardArrowDown />}
            onClick={(e) => handleMenuOpen('business', e)}
            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Business
          </Button>
          <Menu
            anchorEl={anchorEl['business']}
            open={Boolean(anchorEl['business'])}
            onClose={() => handleMenuClose('business')}
            PaperProps={{
              sx: { minWidth: 200 }
            }}
          >
            <MenuItem onClick={() => handleNavigate('/business/provider')}>Provider</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/representator')}>Provider Representator</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/clearance')}>Clearance</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/exclusion')}>Provider Exclusion</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/financial')}>Financial Operation</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/budget')}>Budget Modification</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/planned')}>Planned Item</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/distribution')}>Item Distribution</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/consultation')}>Consultation</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/submission')}>Submission</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/contract')}>Contract</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/contractitem')}>Contract Item</MenuItem>
            <MenuItem onClick={() => handleNavigate('/business/amendment')}>Amendment</MenuItem>
          </Menu>

          {/* Security Menu */}
          <Button
            color="inherit"
            endIcon={<KeyboardArrowDown />}
            onClick={(e) => handleMenuOpen('security', e)}
            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Security
          </Button>
          <Menu
            anchorEl={anchorEl['security']}
            open={Boolean(anchorEl['security'])}
            onClose={() => handleMenuClose('security')}
            PaperProps={{
              sx: { minWidth: 200 }
            }}
          >
            <MenuItem onClick={() => handleNavigate('/security/users')}>Users</MenuItem>
            <MenuItem onClick={() => handleNavigate('/security/roles')}>Roles</MenuItem>
            <MenuItem onClick={() => handleNavigate('/security/permissions')}>Permissions</MenuItem>
            <MenuItem onClick={() => handleNavigate('/security/login-settings')}>Login Settings</MenuItem>
            <MenuItem onClick={() => handleNavigate('/security/2fa')}>Two-Factor Auth</MenuItem>
            <MenuItem onClick={() => handleNavigate('/security/sessions')}>Session Management</MenuItem>
          </Menu>
        </Box>

        {/* User Menu */}
        {isAuthenticated ? (
          <>
            <Button
              color="inherit"
              endIcon={<KeyboardArrowDown />}
              onClick={(e) => handleMenuOpen('user', e)}
              sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Admin
            </Button>
            <Menu
              anchorEl={anchorEl['user']}
              open={Boolean(anchorEl['user'])}
              onClose={() => handleMenuClose('user')}
            >
              <MenuItem onClick={() => handleNavigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => handleNavigate('/language')}>Language</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: 'white', 
              color: '#2e7d32',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
