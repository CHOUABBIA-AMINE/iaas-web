import { Box, Typography } from '@mui/material'

function Footer() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '56px',
        bgcolor: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        RAAS © 2025
      </Typography>
    </Box>
  )
}

export default Footer
