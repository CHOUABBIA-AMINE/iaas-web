/**
 * Layout Component
 * Main layout wrapper with navbar, sidebar, footer, and content area
 * No scrollbar on main body - fixed positioning for all elements
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const NAVBAR_HEIGHT = 64;
const FOOTER_HEIGHT = 40;
const DRAWER_WIDTH = 260;

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isAuthenticated = true; // TODO: Get from auth context

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Navbar */}
      <Navbar
        onMenuClick={handleMenuClick}
        isAuthenticated={isAuthenticated}
      />

      {/* Sidebar */}
      {isAuthenticated && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Content with padding for navbar and footer */}
        <Box
          sx={{
            flexGrow: 1,
            mt: `${NAVBAR_HEIGHT}px`,
            mb: `${FOOTER_HEIGHT}px`,
            ml: isAuthenticated ? `${DRAWER_WIDTH}px` : 0,
            overflow: 'auto',
            bgcolor: 'background.default',
            p: 3,
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
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
