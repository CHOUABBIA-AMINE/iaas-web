/**
 * Terminal List Page - Professional Version
 * Advanced DataGrid with search, filters, export, and polished UI
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-24-2025
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  Divider,
  Tooltip,
  Menu,
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
import { getLocalizedName } from '../utils/localizationUtils';

const TerminalList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = i18n.language || 'en';
  
  // Data state
  const [terminals, setTerminals] = useState<TerminalDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  
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

  // Get unique values for filters
  const availableStatuses = useMemo(() => {
    if (!Array.isArray(terminals)) return [];
    const statuses = new Set<string>();
    terminals.forEach(terminal => {
      if (terminal.operationalStatus) {
        const statusName = getLocalizedName(terminal.operationalStatus, currentLanguage);
        statuses.add(statusName);
      } else if (terminal.operationalStatusName) {
        statuses.add(terminal.operationalStatusName);
      }
    });
    return Array.from(statuses).sort();
  }, [terminals, currentLanguage]);

  const availableTypes = useMemo(() => {
    if (!Array.isArray(terminals)) return [];
    const types = new Set<string>();
    terminals.forEach(terminal => {
      if (terminal.terminalType) {
        const typeName = getLocalizedName(terminal.terminalType, currentLanguage);
        types.add(typeName);
      } else if (terminal.terminalTypeName) {
        types.add(terminal.terminalTypeName);
      }
    });
    return Array.from(types).sort();
  }, [terminals, currentLanguage]);

  const availableVendors = useMemo(() => {
    if (!Array.isArray(terminals)) return [];
    const vendors = new Set<string>();
    terminals.forEach(terminal => {
      const vendorName = terminal.vendor?.name || terminal.vendorName;
      if (vendorName) {
        vendors.add(vendorName);
      }
    });
    return Array.from(vendors).sort();
  }, [terminals]);

  // Filter terminals
  const filteredTerminals = useMemo(() => {
    if (!Array.isArray(terminals)) return [];
    
    return terminals.filter((terminal) => {
      const searchLower = searchText.toLowerCase();
      
      // Get vendor name from nested object or fallback
      const vendorName = terminal.vendor?.name || terminal.vendorName || '';
      
      // Get operational status name from nested object or fallback
      const statusName = terminal.operationalStatus 
        ? getLocalizedName(terminal.operationalStatus, currentLanguage)
        : (terminal.operationalStatusName || '');
      
      // Get terminal type name from nested object or fallback
      const typeName = terminal.terminalType 
        ? getLocalizedName(terminal.terminalType, currentLanguage)
        : (terminal.terminalTypeName || '');
      
      const matchesSearch = !searchText || 
        (terminal.name && terminal.name.toLowerCase().includes(searchLower)) ||
        (terminal.code && terminal.code.toLowerCase().includes(searchLower)) ||
        (terminal.placeName && terminal.placeName.toLowerCase().includes(searchLower)) ||
        typeName.toLowerCase().includes(searchLower) ||
        vendorName.toLowerCase().includes(searchLower) ||
        statusName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || statusName === statusFilter;
      const matchesType = typeFilter === 'all' || typeName === typeFilter;
      const matchesVendor = vendorFilter === 'all' || vendorName === vendorFilter;

      return matchesSearch && matchesStatus && matchesType && matchesVendor;
    });
  }, [terminals, searchText, statusFilter, typeFilter, vendorFilter, currentLanguage]);

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
      field: 'terminalType', 
      headerName: 'Type', 
      width: 150,
      valueGetter: (params) => {
        const terminal = params.row as TerminalDTO;
        return terminal.terminalType 
          ? getLocalizedName(terminal.terminalType, currentLanguage)
          : (terminal.terminalTypeName || 'N/A');
      },
      renderCell: (params) => (
        <Chip
          label={params.value}
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
      field: 'vendor', 
      headerName: 'Vendor', 
      width: 150,
      valueGetter: (params) => {
        const terminal = params.row as TerminalDTO;
        return terminal.vendor?.name || terminal.vendorName || '-';
      },
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'operationalStatus', 
      headerName: 'Status', 
      width: 140,
      valueGetter: (params) => {
        const terminal = params.row as TerminalDTO;
        return terminal.operationalStatus 
          ? getLocalizedName(terminal.operationalStatus, currentLanguage)
          : (terminal.operationalStatusName || 'Unknown');
      },
      renderCell: (params) => (
        <Chip
          label={params.value}
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
    setStatusFilter('all');
    setTypeFilter('all');
    setVendorFilter('all');
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
                placeholder="Search terminals by name, code, type, vendor, or place..."
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

              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Filter by Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {availableStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Filter by Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {availableTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Filter by Vendor</InputLabel>
                <Select
                  value={vendorFilter}
                  label="Filter by Vendor"
                  onChange={(e) => setVendorFilter(e.target.value)}
                >
                  <MenuItem value="all">All Vendors</MenuItem>
                  {availableVendors.map((vendor) => (
                    <MenuItem key={vendor} value={vendor}>{vendor}</MenuItem>
                  ))}
                </Select>
              </FormControl>

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
