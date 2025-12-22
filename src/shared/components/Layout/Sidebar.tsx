/**
 * Sidebar Component
 * Side navigation menu with collapsible icon-only mode
 * Expands on hover to show text labels
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
  title: string;
  icon: React.ReactElement;
  path?: string;
  children?: MenuItem[];
}

// Menu structure aligned with IAAS backend: system -> audit, auth, security, utility
const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    title: 'System',
    icon: <SettingsIcon />,
    children: [
      {
        title: 'Security',
        icon: <SecurityIcon />,
        children: [
          {
            title: 'Users',
            icon: <PeopleIcon />,
            path: '/security/users',
          },
          {
            title: 'Roles',
            icon: <VpnKeyIcon />,
            path: '/security/roles',
          },
          {
            title: 'Groups',
            icon: <GroupIcon />,
            path: '/security/groups',
          },
          {
            title: 'Permissions',
            icon: <LockPersonIcon />,
            path: '/security/permissions',
          },
        ],
      },
      {
        title: 'Auth',
        icon: <AdminPanelSettingsIcon />,
        children: [
          {
            title: 'Sessions',
            icon: <AssignmentIcon />,
            path: '/auth/sessions',
          },
        ],
      },
      {
        title: 'Audit',
        icon: <AssignmentIcon />,
        children: [
          {
            title: 'Logs',
            icon: <AssignmentIcon />,
            path: '/audit/logs',
          },
        ],
      },
    ],
  },
  {
    title: 'Business',
    icon: <BusinessIcon />,
    children: [
      {
        title: 'Overview',
        icon: <BusinessIcon />,
        path: '/business/overview',
      },
    ],
  },
  {
    title: 'Network',
    icon: <NetworkCheckIcon />,
    children: [
      {
        title: 'Overview',
        icon: <NetworkCheckIcon />,
        path: '/network/overview',
      },
    ],
  },
  {
    title: 'Common',
    icon: <SettingsIcon />,
    children: [
      {
        title: 'Settings',
        icon: <SettingsIcon />,
        path: '/common/settings',
      },
    ],
  },
];

const Sidebar = ({ open }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['System']);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = open || isHovered;
  const drawerWidth = isExpanded ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED;

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setExpandedItems((prev) =>
        prev.includes(item.title)
          ? prev.filter((i) => i !== item.title)
          : [...prev, item.title]
      );
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isExpandedItem = expandedItems.includes(item.title);
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
              primary={item.title}
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
      <Box key={item.title}>
        <ListItem disablePadding>
          {!isExpanded && hasChildren ? (
            <Tooltip title={item.title} placement="right">
              {listItemButton}
            </Tooltip>
          ) : !isExpanded ? (
            <Tooltip title={item.title} placement="right">
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
