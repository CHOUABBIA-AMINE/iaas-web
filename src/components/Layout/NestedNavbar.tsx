import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import authService, { User } from '../../services/authService'
import './NestedNavbar.css'

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

interface SubmenuProps {
  items: MenuItem[]
  onNavigate: (path: string) => void
  level?: number
  onHoverStart?: () => void
  onHoverEnd?: () => void
}

function Submenu({
  items,
  onNavigate,
  level = 1,
  onHoverStart,
  onHoverEnd,
}: SubmenuProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  const handleItemHoverEnter = (item: MenuItem) => {
    if (item.submenu && item.submenu.length > 0) {
      setActiveSubmenu(item.label)
    }
  }

  const handleItemHoverLeave = () => {
    setActiveSubmenu(null)
  }

  return (
    <div
      className="navbar-submenu"
      data-level={level}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="navbar-submenu-item"
          onMouseEnter={() => handleItemHoverEnter(item)}
          onMouseLeave={handleItemHoverLeave}
        >
          {item.path ? (
            <button
              onClick={() => onNavigate(item.path!)}
              className="navbar-submenu-link"
            >
              {item.label}
            </button>
          ) : (
            <span className="navbar-submenu-label">
              {item.label}
              {item.submenu && item.submenu.length > 0 && (
                <span className="arrow">›</span>
              )}
            </span>
          )}
          {item.submenu &&
            item.submenu.length > 0 &&
            activeSubmenu === item.label && (
              <Submenu
                items={item.submenu}
                onNavigate={onNavigate}
                level={level + 1}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
              />
            )}
        </div>
      ))}
    </div>
  )
}

function NestedNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  )
  const [user, setUser] = useState<User | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize on mount and when location changes (after login redirect)
  useEffect(() => {
    const updateAuthState = () => {
      const isAuth = authService.isAuthenticated()
      setIsAuthenticated(isAuth)

      if (isAuth) {
        // User data is optional now - we don't require it
        // Just use username from auth or 'User' as default
        setUser({ username: 'User' })
      } else {
        setUser(null)
      }
    }

    updateAuthState()
  }, [location]) // Re-check auth state when location changes (after login redirect)

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

  const handleMenuHoverEnter = (menuLabel: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setActiveMenu(menuLabel)
  }

  const handleMenuHoverLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  const handleSubmenuHoverEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  const handleSubmenuHoverLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    setActiveMenu(null)
  }

  const handleLogin = () => {
    navigate('/login')
    setActiveMenu(null)
  }

  const handleLogout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    setActiveMenu(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">R</div>
      <div className="navbar-title">RAAS</div>

      {/* Only show menus if user is authenticated */}
      {isAuthenticated && (
        <div className="navbar-menus">
          {MENU_DATA.map((menu) => (
            <div
              key={menu.label}
              className="navbar-menu-item"
              onMouseEnter={() => handleMenuHoverEnter(menu.label)}
              onMouseLeave={handleMenuHoverLeave}
            >
              <button className="navbar-menu-button">{menu.label}</button>
              {activeMenu === menu.label && menu.submenu && (
                <Submenu
                  items={menu.submenu}
                  onNavigate={handleNavigate}
                  onHoverStart={handleSubmenuHoverEnter}
                  onHoverEnd={handleSubmenuHoverLeave}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* User section - show Login or Username depending on auth state */}
      <div className="navbar-user">
        {!isAuthenticated ? (
          <div className="navbar-menu-item">
            <button className="navbar-menu-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        ) : (
          <div
            className="navbar-menu-item"
            onMouseEnter={() => handleMenuHoverEnter('user')}
            onMouseLeave={handleMenuHoverLeave}
          >
            <button className="navbar-menu-button">
              {user?.username || 'User'}
            </button>
            {activeMenu === 'user' && (
              <div
                className="navbar-submenu user-submenu"
                data-level="1"
                onMouseEnter={handleSubmenuHoverEnter}
                onMouseLeave={handleSubmenuHoverLeave}
              >
                <div className="navbar-submenu-item">
                  <button
                    onClick={() => handleNavigate('/profile')}
                    className="navbar-submenu-link"
                  >
                    Profile
                  </button>
                </div>
                <div className="navbar-submenu-item">
                  <button
                    onClick={() => handleNavigate('/language')}
                    className="navbar-submenu-link"
                  >
                    Language
                  </button>
                </div>
                <div className="navbar-submenu-item">
                  <button
                    onClick={handleLogout}
                    className="navbar-submenu-link logout"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default NestedNavbar
