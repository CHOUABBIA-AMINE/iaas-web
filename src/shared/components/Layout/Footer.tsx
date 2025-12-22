/**
 * Footer Component
 * Thin footer with copyright information
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '0.75rem' }}
      >
        © {currentYear}{' '}
        <Link
          href="#"
          underline="hover"
          color="inherit"
          sx={{ fontWeight: 500 }}
        >
          IAAS Platform
        </Link>
        . All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
