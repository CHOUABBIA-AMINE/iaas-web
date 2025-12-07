import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  MenuList,
  ListSubheader,
  Divider,
  Typography,
  ListItemIcon,
} from '@mui/material'
import { Person, Language, Logout } from '@mui/icons-material'
import authService, { User } from '../../services/authService'

interface MenuItem {
  label: string
  path?: string
  group?: string
}

// Flat structure with grouping
const MENU_DATA: MenuItem[] = [
  // Common menu items
  { label: 'Structure', path: '/common/structure', group: 'Administration' },
  { label: 'Job', path: '/common/job', group: 'Administration' },
  { label: 'Person', path: '/common/person', group: 'Administration' },
  { label: 'Employee', path: '/common/employee', group: 'Administration' },
  { label: 'ArchiveBox', path: '/common/archivebox', group: 'Documents' },
  { label: 'Folder', path: '/common/folder', group: 'Documents' },
  { label: 'Document', path: '/common/document', group: 'Documents' },
  { label: 'Mail', path: '/common/mail', group: 'Communication' },
]

const BUSINESS_MENU_DATA: MenuItem[] = [
  // Business menu items
  { label: 'Provider', path: '/business/provider', group: 'Providers' },
  { label: 'ProviderRepresentator', path: '/business/representator', group: 'Providers' },
  { label: 'Clearance', path: '/business/clearance', group: 'Providers' },
  { label: 'ProviderExclusion', path: '/business/exclusion', group: 'Providers' },
  { label: 'FinancialOperation', path: '/business/financial', group: 'Financial' },
  { label: 'BudgetModification', path: '/business/budget', group: 'Financial' },
  { label: 'PlannedItem', path: '/business/planned', group: 'Financial' },
  { label: 'ItemDistribution', path: '/business/distribution', group: 'Financial' },
  { label: 'Consultation', path: '/business/consultation', group: 'Procurement' },
  { label: 'Submission', path: '/business/submission', group: 'Procurement' },
  { label: 'Contract', path: '/business/contract', group: 'Procurement' },
  { label: 'ContractItem', path: '/business/contractitem', group: 'Procurement' },
  { label: 'Amendment', path: '/business/amendment', group: 'Procurement' },
]

const SECURITY_MENU_DATA: MenuItem[] = [
  // Security menu items
  { label: 'Users', path: '/security/users', group: 'Security' },
  { label: 'Roles', path: '/security/roles', group: 'Security' },
  { label: 'Permissions', path: '/security/permissions', group: 'Security' },
  { label: 'LoginSettings', path: '/security/login-settings', group: 'Settings' },
  { label: 'TwoFactorAuth', path: '/security/2fa', group: 'Settings' },
  { label: 'SessionManagement', path: '/security/sessions', group: 'Settings' },
]

interface GroupedMenus {
  [key: string]: MenuItem[]
}

const groupMenuItems = (items: MenuItem[]): GroupedMenus => {
  const grouped: GroupedMenus = {}
  items.forEach((item) => {
    const group = item.group || 'Other'
    if (!grouped[group]) {
      grouped[group] = []
    }
    grouped[group].push(item)
  })
  return grouped
}

interface MenuGroupProps {
  items: MenuItem[]
  onNavigate: (path: string) => void
  onClose: () => void
}

function MenuGroup({ items, onNavigate, onClose }: MenuGroupProps) {
  const grouped = groupMenuItems(items)
  const groupKeys = Object.keys(grouped)

  return (
    <MenuList>
      {groupKeys.map((groupKey, groupIndex) => (
        <Box key={groupKey}>
          {groupIndex > 0 && <Divider />}
          <ListSubheader
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#2e7d32',
              py: 1,
              px: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {groupKey}
          </ListSubheader>
          {grouped[groupKey].map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                onNavigate(item.path!)
                onClose()
              }}
              sx={{
                fontSize: '0.95rem',
                py: 1,
                pl: 4,
                '&:hover': {
                  backgroundColor: '#e8f5e9',
                },
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Box>
      ))}
    </MenuList>
  )
}

function NestedNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  )
  const [user, setUser] = useState<User | null>(null)
  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({})
  const [openMenu, setOpenMenu] = useState<string | null>(null)

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
    setOpenMenu(menuLabel)
  }

  const handleMenuClose = (menuLabel?: string) => () => {
    if (menuLabel) {
      setAnchorEl((prev) => ({ ...prev, [menuLabel]: null }))
      if (openMenu === menuLabel) {
        setOpenMenu(null)
      }
    } else {
      setAnchorEl({})
      setOpenMenu(null)
    }
  }

  const handleNavItemHover = (menuLabel: string) => (
    event: React.MouseEvent<HTMLElement>
  ) => {
    // Close any previously open menu
    if (openMenu && openMenu !== menuLabel) {
      setAnchorEl((prev) => ({ ...prev, [openMenu]: null }))
    }
    // Open new menu
    setAnchorEl((prev) => ({ ...prev, [menuLabel]: event.currentTarget }))
    setOpenMenu(menuLabel)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    setAnchorEl({})
    setOpenMenu(null)
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    setAnchorEl({})
    setOpenMenu(null)
    navigate('/')
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
            {/* Common Menu */}
            <Box>
              <Button
                color="inherit"
                onMouseEnter={handleNavItemHover('common')}
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
                Common
              </Button>
              <Menu
                anchorEl={anchorEl['common']}
                open={Boolean(anchorEl['common'])}
                onClose={handleMenuClose('common')}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: '220px',
                    },
                  },
                }}
              >
                <MenuGroup
                  items={MENU_DATA}
                  onNavigate={handleNavigate}
                  onClose={handleMenuClose('common')}
                />
              </Menu>
            </Box>

            {/* Business Menu */}
            <Box>
              <Button
                color="inherit"
                onMouseEnter={handleNavItemHover('business')}
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
                Business
              </Button>
              <Menu
                anchorEl={anchorEl['business']}
                open={Boolean(anchorEl['business'])}
                onClose={handleMenuClose('business')}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: '240px',
                    },
                  },
                }}
              >
                <MenuGroup
                  items={BUSINESS_MENU_DATA}
                  onNavigate={handleNavigate}
                  onClose={handleMenuClose('business')}
                />
              </Menu>
            </Box>

            {/* Security Menu */}
            <Box>
              <Button
                color="inherit"
                onMouseEnter={handleNavItemHover('security')}
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
                Security
              </Button>
              <Menu
                anchorEl={anchorEl['security']}
                open={Boolean(anchorEl['security'])}
                onClose={handleMenuClose('security')}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: '220px',
                    },
                  },
                }}
              >
                <MenuGroup
                  items={SECURITY_MENU_DATA}
                  onNavigate={handleNavigate}
                  onClose={handleMenuClose('security')}
                />
              </Menu>
            </Box>
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
                onMouseEnter={handleNavItemHover('user')}
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
                  onClick={() => {
                    handleNavigate('/profile')
                  }}
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
                  onClick={() => {
                    handleNavigate('/language')
                  }}
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
