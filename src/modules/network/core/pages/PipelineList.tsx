/**
 * Pipeline List Page - Professional Version
 * Advanced DataGrid with search, filters, export, and polished UI
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
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
  Timeline as PipelineIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { pipelineService } from '../services/pipelineService';
import { PipelineDTO } from '../dto/PipelineDTO';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';
import { getLocalizedName } from '../utils/localizationUtils';

const PipelineList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = i18n.language || 'en';
  
  // Data state
  const [pipelines, setPipelines] = useState<PipelineDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  
  // Export menu
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadPipelines();
  }, []);

  const loadPipelines = async () => {
    try {
      setLoading(true);
      const response = await pipelineService.getAll();
      
      // Handle different response formats
      let pipelineData: PipelineDTO[] = [];
      if (Array.isArray(response)) {
        pipelineData = response;
      } else if (response && typeof response === 'object') {
        pipelineData = response.data || response.content || response.pipelines || [];
      }
      
      if (!Array.isArray(pipelineData)) {
        console.error('Unexpected response format:', response);
        pipelineData = [];
      }
      
      setPipelines(pipelineData);
      setError('');
    } catch (err: any) {
      console.error('Failed to load pipelines:', err);
      setError(err.message || 'Failed to load pipelines');
      setPipelines([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const availableStatuses = useMemo(() => {
    if (!Array.isArray(pipelines)) return [];
    const statuses = new Set<string>();
    pipelines.forEach(pipeline => {
      if (pipeline.operationalStatus) {
        const statusName = getLocalizedName(pipeline.operationalStatus, currentLanguage);
        statuses.add(statusName);
      } else if (pipeline.operationalStatusName) {
        statuses.add(pipeline.operationalStatusName);
      }
    });
    return Array.from(statuses).sort();
  }, [pipelines, currentLanguage]);

  const availableSystems = useMemo(() => {
    if (!Array.isArray(pipelines)) return [];
    const systems = new Set<string>();
    pipelines.forEach(pipeline => {
      if (pipeline.pipelineSystem) {
        const systemName = getLocalizedName(pipeline.pipelineSystem, currentLanguage);
        systems.add(systemName);
      } else if (pipeline.pipelineSystemName) {
        systems.add(pipeline.pipelineSystemName);
      }
    });
    return Array.from(systems).sort();
  }, [pipelines, currentLanguage]);

  const availableVendors = useMemo(() => {
    if (!Array.isArray(pipelines)) return [];
    const vendors = new Set<string>();
    pipelines.forEach(pipeline => {
      const vendorName = pipeline.vendor?.name || pipeline.vendorName;
      if (vendorName) {
        vendors.add(vendorName);
      }
    });
    return Array.from(vendors).sort();
  }, [pipelines]);

  const availableProducts = useMemo(() => {
    if (!Array.isArray(pipelines)) return [];
    const products = new Set<string>();
    pipelines.forEach(pipeline => {
      if (pipeline.product) {
        const productName = getLocalizedName(pipeline.product, currentLanguage);
        products.add(productName);
      } else if (pipeline.productName) {
        products.add(pipeline.productName);
      }
    });
    return Array.from(products).sort();
  }, [pipelines, currentLanguage]);

  // Filter pipelines
  const filteredPipelines = useMemo(() => {
    if (!Array.isArray(pipelines)) return [];
    
    return pipelines.filter((pipeline) => {
      const searchLower = searchText.toLowerCase();
      
      const vendorName = pipeline.vendor?.name || pipeline.vendorName || '';
      const statusName = pipeline.operationalStatus 
        ? getLocalizedName(pipeline.operationalStatus, currentLanguage)
        : (pipeline.operationalStatusName || '');
      const systemName = pipeline.pipelineSystem 
        ? getLocalizedName(pipeline.pipelineSystem, currentLanguage)
        : (pipeline.pipelineSystemName || '');
      const productName = pipeline.product 
        ? getLocalizedName(pipeline.product, currentLanguage)
        : (pipeline.productName || '');
      
      const matchesSearch = !searchText || 
        (pipeline.name && pipeline.name.toLowerCase().includes(searchLower)) ||
        (pipeline.code && pipeline.code.toLowerCase().includes(searchLower)) ||
        systemName.toLowerCase().includes(searchLower) ||
        vendorName.toLowerCase().includes(searchLower) ||
        statusName.toLowerCase().includes(searchLower) ||
        productName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || statusName === statusFilter;
      const matchesSystem = systemFilter === 'all' || systemName === systemFilter;
      const matchesVendor = vendorFilter === 'all' || vendorName === vendorFilter;
      const matchesProduct = productFilter === 'all' || productName === productFilter;

      return matchesSearch && matchesStatus && matchesSystem && matchesVendor && matchesProduct;
    });
  }, [pipelines, searchText, statusFilter, systemFilter, vendorFilter, productFilter, currentLanguage]);

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
      headerName: 'Pipeline Name', 
      minWidth: 220,
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PipelineIcon fontSize="small" color="primary" />
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
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
      field: 'pipelineSystem', 
      headerName: 'System', 
      width: 180,
      flex: 1,
      valueGetter: (params) => {
        const pipeline = params.row as PipelineDTO;
        return pipeline.pipelineSystem 
          ? getLocalizedName(pipeline.pipelineSystem, currentLanguage)
          : (pipeline.pipelineSystemName || 'N/A');
      },
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    { 
      field: 'diameter', 
      headerName: 'Diameter', 
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? `${params.value}"` : '-'}
        </Typography>
      ),
    },
    { 
      field: 'length', 
      headerName: 'Length (km)', 
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? `${params.value} km` : '-'}
        </Typography>
      ),
    },
    { 
      field: 'product', 
      headerName: 'Product', 
      width: 140,
      valueGetter: (params) => {
        const pipeline = params.row as PipelineDTO;
        return pipeline.product 
          ? getLocalizedName(pipeline.product, currentLanguage)
          : (pipeline.productName || '-');
      },
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'vendor', 
      headerName: 'Vendor', 
      width: 150,
      valueGetter: (params) => {
        const pipeline = params.row as PipelineDTO;
        return pipeline.vendor?.name || pipeline.vendorName || '-';
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
        const pipeline = params.row as PipelineDTO;
        return pipeline.operationalStatus 
          ? getLocalizedName(pipeline.operationalStatus, currentLanguage)
          : (pipeline.operationalStatusName || 'Unknown');
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

  const handleCreate = () => navigate('/network/core/pipelines/create');
  const handleEdit = (pipelineId: number) => navigate(`/network/core/pipelines/${pipelineId}/edit`);
  
  const handleDelete = async (pipelineId: number) => {
    if (window.confirm('Delete this pipeline?')) {
      try {
        await pipelineService.delete(pipelineId);
        setSuccess('Pipeline deleted successfully');
        loadPipelines();
      } catch (err: any) {
        setError(err.message || 'Failed to delete pipeline');
      }
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setSystemFilter('all');
    setVendorFilter('all');
    setProductFilter('all');
  };

  const handleRefresh = () => {
    loadPipelines();
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
    exportToCSV(filteredPipelines, 'pipelines');
    setSuccess('Exported to CSV');
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    exportToExcel(filteredPipelines, 'pipelines');
    setSuccess('Exported to Excel');
    handleExportMenuClose();
  };

  const handleExportPDF = () => {
    exportToPDF(filteredPipelines, 'pipelines', t);
    setSuccess('Exported to PDF');
    handleExportMenuClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Pipelines
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
              Create Pipeline
            </Button>
          </Stack>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage pipeline infrastructure and transport systems
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
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
              <TextField
                fullWidth
                placeholder="Search pipelines by name, code, system, vendor, or product..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: { md: 380 } }}
              />

              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {availableStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>System</InputLabel>
                <Select
                  value={systemFilter}
                  label="System"
                  onChange={(e) => setSystemFilter(e.target.value)}
                >
                  <MenuItem value="all">All Systems</MenuItem>
                  {availableSystems.map((system) => (
                    <MenuItem key={system} value={system}>{system}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Product</InputLabel>
                <Select
                  value={productFilter}
                  label="Product"
                  onChange={(e) => setProductFilter(e.target.value)}
                >
                  <MenuItem value="all">All Products</MenuItem>
                  {availableProducts.map((product) => (
                    <MenuItem key={product} value={product}>{product}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Vendor</InputLabel>
                <Select
                  value={vendorFilter}
                  label="Vendor"
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
                sx={{ minWidth: 130 }}
              >
                Clear
              </Button>
            </Stack>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {filteredPipelines.length} {t('common.results')}
                {pipelines.length !== filteredPipelines.length && (
                  <Typography component="span" variant="body2" color="text.disabled" sx={{ ml: 1 }}>
                    (filtered from {pipelines.length})
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
          rows={filteredPipelines}
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

export default PipelineList;
