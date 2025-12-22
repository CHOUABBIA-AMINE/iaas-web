/**
 * Sidebar Component
 * Side navigation menu
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
  Divider,
  Box,
  Collapse,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

const DRAWER_WIDTH = 260;

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

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    title: 'System',
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
        title: 'Audit Logs',
        icon: <AssignmentIcon />,
        path: '/system/audit',
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
];

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['System']);

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
    const isExpanded = expandedItems.includes(item.title);
    const isActive = item.path === location.pathname;

    return (
      <Box key={item.title}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              pl: 2 + depth * 2,
              py: 1,
              bgcolor: isActive ? 'primary.main' : 'transparent',
              color: isActive ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                bgcolor: isActive ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActive ? 'primary.contrastText' : 'text.secondary',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
              }}
            />
            {item.children &&
              (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {item.children && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: 64,
          height: 'calc(100% - 64px - 40px)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
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
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => renderMenuItem(item))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;
