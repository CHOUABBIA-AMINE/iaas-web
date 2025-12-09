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
  ListItemText,
} from '@mui/material'
import {
  Person,
  Language,
  Logout,
  StorageRounded,
  PersonRounded,
  DocumentScannerRounded,
  MailRounded,
  WorkRounded,
  AssignmentRounded,
  SecurityRounded,
  SettingsRounded,
  GroupRounded,
  LockReset,
} from '@mui/icons-material'
import authService, { User } from '../../services/authService'

interface MenuItem {
  label: string
  path?: string
  group?: string
  icon?: React.ReactNode
}

// Icon mapping for common items
const CommonIcons: Record<string, React.ReactNode> = {
  'Administration': <PersonRounded fontSize="small" />,
  'Documents': <DocumentScannerRounded fontSize="small" />,
  'Communication': <MailRounded fontSize="small" />,
  'Structure': <StorageRounded fontSize="small" />,
  'Job': <WorkRounded fontSize="small" />,
  'Person': <PersonRounded fontSize="small" />,
  'Employee': <PersonRounded fontSize="small" />,
  'ArchiveBox': <StorageRounded fontSize="small" />,
  'Folder': <DocumentScannerRounded fontSize="small" />,
  'Document': <DocumentScannerRounded fontSize="small" />,
  'Mail': <MailRounded fontSize="small" />,
}

const BusinessIcons: Record<string, React.ReactNode> = {
  'Providers': <PersonRounded fontSize="small" />,
  'Provider': <PersonRounded fontSize="small" />,
  'ProviderRepresentator': <PersonRounded fontSize="small" />,
  'Clearance': <SecurityRounded fontSize="small" />,
  'ProviderExclusion': <SecurityRounded fontSize="small" />,
  'Financial': <AssignmentRounded fontSize="small" />,
  'FinancialOperation': <AssignmentRounded fontSize="small" />,
  'BudgetModification': <AssignmentRounded fontSize="small" />,
  'PlannedItem': <AssignmentRounded fontSize="small" />,
  'ItemDistribution': <AssignmentRounded fontSize="small" />,
  'Procurement': <WorkRounded fontSize="small" />,
  'Consultation': <WorkRounded fontSize="small" />,
  'Submission': <WorkRounded fontSize="small" />,
  'Contract': <DocumentScannerRounded fontSize="small" />,
  'ContractItem': <DocumentScannerRounded fontSize="small" />,
  'Amendment': <DocumentScannerRounded fontSize="small" />,
}

const SecurityIcons: Record<string, React.ReactNode> = {
  'Security': <SecurityRounded fontSize="small" />,
  'Users': <PersonRounded fontSize="small" />,
  'Roles': <SecurityRounded fontSize="small" />,
  'Groups': <GroupRounded fontSize="small" />,
  'Settings': <SettingsRounded fontSize="small" />,
  'ResetPassword': <LockReset fontSize="small" />,
  'LoginSettings': <SettingsRounded fontSize="small" />,
  'TwoFactorAuth': <SecurityRounded fontSize="small" />,
  'SessionManagement': <SettingsRounded fontSize="small" />,
}

// Flat structure with grouping
const MENU_DATA: MenuItem[] = [
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
  { label: 'Users', path: '/security/users', group: 'Security' },
  { label: 'Roles', path: '/security/roles', group: 'Security' },
  { label: 'Groups', path: '/security/groups', group: 'Security' },
  { label: 'ResetPassword', path: '/security/reset-password', group: 'Settings' },
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

const getIcon = (label: string, menuType: 'common' | 'business' | 'security'): React.ReactNode => {
  const iconMap = menuType === 'common' ? CommonIcons : menuType === 'business' ? BusinessIcons : SecurityIcons
  return iconMap[label] || <StorageRounded fontSize="small" />
}

interface MenuGroupProps {
  items: MenuItem[]
  menuType: 'common' | 'business' | 'security'
  onNavigate: (path: string) => void
  onClose: () => void
}

function MenuGroup({ items, menuType, onNavigate, onClose }: MenuGroupProps) {
  const grouped = groupMenuItems(items)
  const groupKeys = Object.keys(grouped)

  return (
    <MenuList dense>
      {groupKeys.map((groupKey, groupIndex) => (
        <Box key={groupKey}>
          {groupIndex > 0 && <Divider sx={{ my: 0.5 }} />}
          <ListSubheader
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#2e7d32',
              py: 0.75,
              px: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              lineHeight: '1.2',
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
                py: 0.75,
                px: 1.5,
                minHeight: '32px',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#f0f7f4',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: '32px',
                  color: '#2e7d32',
                  fontSize: '1rem',
                }}
              >
                {getIcon(item.label, menuType)}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
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
    // Instantly open new menu and close any existing one
    setAnchorEl({ [menuLabel]: event.currentTarget })
    setOpenMenu(menuLabel)
  }

  const handleMenuClose = () => {
    setAnchorEl({})
    setOpenMenu(null)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    handleMenuClose()
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    handleMenuClose()
    navigate('/')
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#2e7d32',
        zIndex: 1300,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo and Title - Clickable */}
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 0.8,
            },
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
                onMouseEnter={handleMenuOpen('common')}
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
                onClose={handleMenuClose}
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
                      minWidth: '280px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                      zIndex: 1300,
                      marginTop: 0,
                    },
                  },
                }}
              >
                <MenuGroup
                  items={MENU_DATA}
                  menuType="common"
                  onNavigate={handleNavigate}
                  onClose={handleMenuClose}
                />
              </Menu>
            </Box>

            {/* Business Menu */}
            <Box>
              <Button
                color="inherit"
                onMouseEnter={handleMenuOpen('business')}
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
                onClose={handleMenuClose}
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
                      minWidth: '300px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                      zIndex: 1300,
                      marginTop: 0,
                    },
                  },
                }}
              >
                <MenuGroup
                  items={BUSINESS_MENU_DATA}
                  menuType="business"
                  onNavigate={handleNavigate}
                  onClose={handleMenuClose}
                />
              </Menu>
            </Box>

            {/* Security Menu */}
            <Box>
              <Button
                color="inherit"
                onMouseEnter={handleMenuOpen('security')}
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
                onClose={handleMenuClose}
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
                      minWidth: '280px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                      zIndex: 1300,
                      marginTop: 0,
                    },
                  },
                }}
              >
                <MenuGroup
                  items={SECURITY_MENU_DATA}
                  menuType="security"
                  onNavigate={handleNavigate}
                  onClose={handleMenuClose}
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
                onMouseEnter={handleMenuOpen('user')}
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
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: '220px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                      zIndex: 1300,
                      marginTop: 0,
                    },
                  },
                }}
              >
                <MenuList dense>
                  <MenuItem
                    onClick={() => {
                      handleNavigate('/profile')
                    }}
                    sx={{
                      py: 0.75,
                      px: 1.5,
                      minHeight: '36px',
                      '&:hover': {
                        backgroundColor: '#f0f7f4',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: '32px',
                        color: '#2e7d32',
                      }}
                    >
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile"
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleNavigate('/language')
                    }}
                    sx={{
                      py: 0.75,
                      px: 1.5,
                      minHeight: '36px',
                      '&:hover': {
                        backgroundColor: '#f0f7f4',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: '32px',
                        color: '#2e7d32',
                      }}
                    >
                      <Language fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Language"
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 0.75,
                      px: 1.5,
                      minHeight: '36px',
                      color: '#c41c47',
                      '&:hover': {
                        backgroundColor: '#ffebee',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: '32px',
                        color: 'inherit',
                      }}
                    >
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default NestedNavbar
