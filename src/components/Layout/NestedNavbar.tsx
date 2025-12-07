import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
  Typography,
  ListItemIcon,
} from '@mui/material'
import { Person, Language, Logout } from '@mui/icons-material'
import authService, { User } from '../../services/authService'

interface MenuItem {
  label: string
  path?: string
  submenu?: MenuItem[]
}

const MENU_DATA: MenuItem[] = [
  {
    label: 'Common',
    submenu: [
      {
        label: 'Administration',
        submenu: [
          { label: 'Structure', path: '/common/structure' },
          { label: 'Job', path: '/common/job' },
          { label: 'Person', path: '/common/person' },
          { label: 'Employee', path: '/common/employee' },
        ],
      },
      {
        label: 'Documents',
        submenu: [
          { label: 'ArchiveBox', path: '/common/archivebox' },
          { label: 'Folder', path: '/common/folder' },
          { label: 'Document', path: '/common/document' },
        ],
      },
      {
        label: 'Communication',
        submenu: [{ label: 'Mail', path: '/common/mail' }],
      },
    ],
  },
  {
    label: 'Business',
    submenu: [
      {
        label: 'Providers',
        submenu: [
          { label: 'Provider', path: '/business/provider' },
          { label: 'ProviderRepresentator', path: '/business/representator' },
          { label: 'Clearance', path: '/business/clearance' },
          { label: 'ProviderExclusion', path: '/business/exclusion' },
        ],
      },
      {
        label: 'Financial',
        submenu: [
          { label: 'FinancialOperation', path: '/business/financial' },
          { label: 'BudgetModification', path: '/business/budget' },
          { label: 'PlannedItem', path: '/business/planned' },
          { label: 'ItemDistribution', path: '/business/distribution' },
        ],
      },
      {
        label: 'Procurement',
        submenu: [
          { label: 'Consultation', path: '/business/consultation' },
          { label: 'Submission', path: '/business/submission' },
          { label: 'Contract', path: '/business/contract' },
          { label: 'ContractItem', path: '/business/contractitem' },
          { label: 'Amendment', path: '/business/amendment' },
        ],
      },
    ],
  },
  {
    label: 'Security',
    submenu: [
      { label: 'Users', path: '/security/users' },
      { label: 'Roles', path: '/security/roles' },
      { label: 'Permissions', path: '/security/permissions' },
      { label: 'LoginSettings', path: '/security/login-settings' },
      { label: 'TwoFactorAuth', path: '/security/2fa' },
      { label: 'SessionManagement', path: '/security/sessions' },
    ],
  },
]

function NestedNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  )
  const [user, setUser] = useState<User | null>(null)
  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({})

  // Initialize on mount and when location changes (after login redirect)
  useEffect(() => {
    const updateAuthState = () => {
      const isAuth = authService.isAuthenticated()
      setIsAuthenticated(isAuth)

      if (isAuth) {
        setUser({ username: 'User' })
      } else {
        setUser(null)
      }
    }

    updateAuthState()
  }, [location])

  // Listen for storage changes (logout from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = authService.getStoredToken()

      if (token && !authService.isTokenExpired()) {
        setIsAuthenticated(true)
        setUser({ username: 'User' })
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleMenuOpen = (menuLabel: string) => (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl((prev) => ({ ...prev, [menuLabel]: event.currentTarget }))
  }

  const handleMenuClose = (menuLabel: string) => () => {
    setAnchorEl((prev) => ({ ...prev, [menuLabel]: null }))
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    setAnchorEl({}) // Close all menus
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    setAnchorEl({})
    navigate('/')
  }

  const renderSubmenu = (items: MenuItem[], level: number = 1) => {
    return items.map((item) => (
      <Box key={item.label}>
        {item.path ? (
          <MenuItem
            onClick={() => handleNavigate(item.path!)}
            sx={{
              fontSize: '0.95rem',
              py: 1,
              '&:hover': {
                backgroundColor: '#e8f5e9',
              },
            }}
          >
            {item.label}
          </MenuItem>
        ) : (
          <>
            <MenuItem
              onMouseEnter={handleMenuOpen(item.label)}
              onClick={handleMenuOpen(item.label)}
              sx={{
                fontSize: '0.9rem',
                fontWeight: 500,
                backgroundColor: '#f5f5f5',
                py: 1,
                '&:hover': {
                  backgroundColor: '#eeeeee',
                },
              }}
            >
              <Typography variant="inherit" sx={{ flex: 1 }}>
                {item.label}
              </Typography>
              {item.submenu && item.submenu.length > 0 && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  ›
                </Typography>
              )}
            </MenuItem>
            {item.submenu && item.submenu.length > 0 && (
              <Menu
                anchorEl={anchorEl[item.label]}
                open={Boolean(anchorEl[item.label])}
                onClose={handleMenuClose(item.label)}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{
                  ml: 1,
                }}
              >
                {renderSubmenu(item.submenu, level + 1)}
              </Menu>
            )}
          </>
        )}
      </Box>
    ))
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#2e7d32',
        zIndex: 1400,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo and Title */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'white',
              color: '#2e7d32',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem',
            }}
          >
            R
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'white',
              whiteSpace: 'nowrap',
            }}
          >
            RAAS
          </Typography>
        </Box>

        {/* Menus - Only show if authenticated */}
        {isAuthenticated && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {MENU_DATA.map((menu) => (
              <Box key={menu.label}>
                <Button
                  color="inherit"
                  onMouseEnter={handleMenuOpen(menu.label)}
                  onClick={handleMenuOpen(menu.label)}
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  {menu.label}
                </Button>
                {menu.submenu && (
                  <Menu
                    anchorEl={anchorEl[menu.label]}
                    open={Boolean(anchorEl[menu.label])}
                    onClose={handleMenuClose(menu.label)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    sx={{
                      mt: 1,
                    }}
                  >
                    {renderSubmenu(menu.submenu)}
                  </Menu>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* User Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isAuthenticated ? (
            <Button
              color="inherit"
              onClick={handleLogin}
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                py: 1,
                px: 2,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              Login
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                onMouseEnter={handleMenuOpen('user')}
                onClick={handleMenuOpen('user')}
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 1,
                  px: 2,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                {user?.username || 'User'}
              </Button>
              <Menu
                anchorEl={anchorEl['user']}
                open={Boolean(anchorEl['user'])}
                onClose={handleMenuClose('user')}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem
                  onClick={() => handleNavigate('/profile')}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#e8f5e9',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleNavigate('/language')}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#e8f5e9',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Language fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Language</Typography>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: '#c41c47',
                    '&:hover': {
                      backgroundColor: '#ffebee',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default NestedNavbar
