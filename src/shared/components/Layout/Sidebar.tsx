/**
 * Sidebar Component
 * Side navigation menu with collapsible icon-only mode and i18n support
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Collapse,
  Tooltip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const DRAWER_WIDTH_EXPANDED = 260;
const DRAWER_WIDTH_COLLAPSED = 64;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  titleKey: string;
  icon: React.ReactElement;
  path?: string;
  children?: MenuItem[];
}

const Sidebar = ({ open }: SidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['System']);
  const [isHovered, setIsHovered] = useState(false);

  // Menu structure with translation keys
  const menuItems: MenuItem[] = [
    {
      titleKey: 'nav.dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      titleKey: 'nav.system',
      icon: <SettingsIcon />,
      children: [
        {
          titleKey: 'nav.security',
          icon: <SecurityIcon />,
          children: [
            {
              titleKey: 'nav.users',
              icon: <PeopleIcon />,
              path: '/security/users',
            },
            {
              titleKey: 'nav.roles',
              icon: <VpnKeyIcon />,
              path: '/security/roles',
            },
            {
              titleKey: 'nav.groups',
              icon: <GroupIcon />,
              path: '/security/groups',
            },
            {
              titleKey: 'nav.permissions',
              icon: <LockPersonIcon />,
              path: '/security/permissions',
            },
          ],
        },
        {
          titleKey: 'nav.auth',
          icon: <AdminPanelSettingsIcon />,
          children: [
            {
              titleKey: 'nav.sessions',
              icon: <AssignmentIcon />,
              path: '/auth/sessions',
            },
          ],
        },
        {
          titleKey: 'nav.audit',
          icon: <AssignmentIcon />,
          children: [
            {
              titleKey: 'nav.logs',
              icon: <AssignmentIcon />,
              path: '/audit/logs',
            },
          ],
        },
      ],
    },
    {
      titleKey: 'nav.business',
      icon: <BusinessIcon />,
      children: [
        {
          titleKey: 'nav.overview',
          icon: <BusinessIcon />,
          path: '/business/overview',
        },
      ],
    },
    {
      titleKey: 'nav.network',
      icon: <NetworkCheckIcon />,
      children: [
        {
          titleKey: 'nav.overview',
          icon: <NetworkCheckIcon />,
          path: '/network/overview',
        },
      ],
    },
    {
      titleKey: 'nav.common',
      icon: <SettingsIcon />,
      children: [
        {
          titleKey: 'nav.settings',
          icon: <SettingsIcon />,
          path: '/common/settings',
        },
      ],
    },
  ];

  const isExpanded = open || isHovered;
  const drawerWidth = isExpanded ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED;

  const handleItemClick = (item: MenuItem) => {
    const title = t(item.titleKey);
    if (item.children) {
      setExpandedItems((prev) =>
        prev.includes(title) ? prev.filter((i) => i !== title) : [...prev, title]
      );
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const title = t(item.titleKey);
    const isExpandedItem = expandedItems.includes(title);
    const isActive = item.path === location.pathname;
    const hasChildren = Boolean(item.children);

    const listItemButton = (
      <ListItemButton
        onClick={() => handleItemClick(item)}
        sx={{
          pl: 2 + depth * 2,
          py: 1.25,
          minHeight: 48,
          justifyContent: isExpanded ? 'initial' : 'center',
          bgcolor: isActive ? 'primary.main' : 'transparent',
          color: isActive ? 'primary.contrastText' : 'text.primary',
          '&:hover': {
            bgcolor: isActive ? 'primary.dark' : 'action.hover',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isExpanded ? 2 : 'auto',
            justifyContent: 'center',
            color: isActive ? 'primary.contrastText' : 'text.secondary',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {isExpanded && (
          <>
            <ListItemText
              primary={title}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
              }}
            />
            {hasChildren && (isExpandedItem ? <ExpandLess /> : <ExpandMore />)}
          </>
        )}
      </ListItemButton>
    );

    return (
      <Box key={item.titleKey}>
        <ListItem disablePadding>
          {!isExpanded ? (
            <Tooltip title={title} placement="right">
              {listItemButton}
            </Tooltip>
          ) : (
            listItemButton
          )}
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpandedItem && isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.2s ease-in-out',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 64,
          height: 'calc(100% - 64px - 40px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          transition: 'width 0.2s ease-in-out',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#e2e8f0',
            borderRadius: '4px',
            '&:hover': {
              background: '#cbd5e1',
            },
          },
        },
      }}
    >
      <List sx={{ pt: 2, px: 1 }}>
        {menuItems.map((item) => renderMenuItem(item))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
