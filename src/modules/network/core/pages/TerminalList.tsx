/**
 * Terminal List Page - Professional Version
 * Advanced DataGrid with search, filters, export, and polished UI
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Alert,
  TextField,
  InputAdornment,
  Stack,
  Paper,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  TableChart as CsvIcon,
  Description as ExcelIcon,
  PictureAsPdf as PdfIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { terminalService } from '../services';
import { TerminalDTO } from '../dto';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';

const TerminalList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Data state
  const [terminals, setTerminals] = useState<TerminalDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter state
  const [searchText, setSearchText] = useState('');
  
  // Export menu
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadTerminals();
  }, []);

  const loadTerminals = async () => {
    try {
      setLoading(true);
      const response = await terminalService.getAll();
      
      // Handle different response formats
      let terminalData: TerminalDTO[] = [];
      if (Array.isArray(response)) {
        terminalData = response;
      } else if (response && typeof response === 'object') {
        terminalData = response.data || response.content || response.terminals || [];
      }
      
      if (!Array.isArray(terminalData)) {
        console.error('Unexpected response format:', response);
        terminalData = [];
      }
      
      setTerminals(terminalData);
      setError('');
    } catch (err: any) {
      console.error('Failed to load terminals:', err);
      setError(err.message || 'Failed to load terminals');
      setTerminals([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter terminals
  const filteredTerminals = useMemo(() => {
    if (!Array.isArray(terminals)) return [];
    
    return terminals.filter((terminal) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch = !searchText || 
        (terminal.name && terminal.name.toLowerCase().includes(searchLower)) ||
        (terminal.code && terminal.code.toLowerCase().includes(searchLower)) ||
        (terminal.placeName && terminal.placeName.toLowerCase().includes(searchLower)) ||
        (terminal.terminalTypeName && terminal.terminalTypeName.toLowerCase().includes(searchLower));

      return matchesSearch;
    });
  }, [terminals, searchText]);

  // DataGrid columns
  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      align: 'center',
      headerAlign: 'center',
    },
    { 
      field: 'name', 
      headerName: 'Terminal Name', 
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'code', 
      headerName: 'Code', 
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
        />
      ),
    },
    { 
      field: 'terminalTypeName', 
      headerName: 'Type', 
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value || 'N/A'}
          size="small"
          color="secondary"
          variant="outlined"
        />
      ),
    },
    { 
      field: 'placeName', 
      headerName: 'Place', 
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { 
      field: 'vendorName', 
      headerName: 'Vendor', 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '-'}
        </Typography>
      ),
    },
    { 
      field: 'operationalStatusName', 
      headerName: 'Status', 
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Unknown'}
          size="small"
          color="success"
          variant="filled"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 130,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={t('common.edit')}>
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row.id)}
              sx={{
                color: 'primary.main',
                '&:hover': { bgcolor: alpha('#2563eb', 0.1) }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
              sx={{
                color: 'error.main',
                '&:hover': { bgcolor: alpha('#dc2626', 0.1) }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleCreate = () => navigate('/network/core/terminals/create');
  const handleEdit = (terminalId: number) => navigate(`/network/core/terminals/${terminalId}/edit`);
  
  const handleDelete = async (terminalId: number) => {
    if (window.confirm('Delete this terminal?')) {
      try {
        await terminalService.delete(terminalId);
        setSuccess('Terminal deleted successfully');
        loadTerminals();
      } catch (err: any) {
        setError(err.message || 'Failed to delete terminal');
      }
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
  };

  const handleRefresh = () => {
    loadTerminals();
    setSuccess('Data refreshed');
  };

  // Export handlers
  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredTerminals, 'terminals');
    setSuccess('Exported to CSV');
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    exportToExcel(filteredTerminals, 'terminals');
    setSuccess('Exported to Excel');
    handleExportMenuClose();
  };

  const handleExportPDF = () => {
    exportToPDF(filteredTerminals, 'terminals', t);
    setSuccess('Exported to PDF');
    handleExportMenuClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Terminals
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} size="medium" color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportMenuOpen}
              sx={{ borderRadius: 2 }}
            >
              {t('common.export')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ borderRadius: 2, boxShadow: 2 }}
            >
              Create Terminal
            </Button>
          </Stack>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage pipeline terminals and export facilities
        </Typography>
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleExportMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon>
            <CsvIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('common.exportCSV')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon>
            <ExcelIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>{t('common.exportExcel')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          <ListItemIcon>
            <PdfIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{t('common.exportPDF')}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Filters */}
      <Paper elevation={0} sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 2.5 }}>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                fullWidth
                placeholder="Search terminals by name, code, or place..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: { md: 400 } }}
              />

              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleClearFilters}
                sx={{ minWidth: 150 }}
              >
                {t('common.clearFilters')}
              </Button>
            </Stack>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {filteredTerminals.length} {t('common.results')}
                {terminals.length !== filteredTerminals.length && (
                  <Typography component="span" variant="body2" color="text.disabled" sx={{ ml: 1 }}>
                    (filtered from {terminals.length})
                  </Typography>
                )}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* DataGrid */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <DataGrid
          rows={filteredTerminals}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: alpha('#2563eb', 0.04),
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: alpha('#2563eb', 0.05),
              borderBottom: 2,
              borderColor: 'divider',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default TerminalList;
