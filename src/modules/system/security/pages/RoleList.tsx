/**
 * Role List Page - Professional Version
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
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { roleService } from '../services';
import { RoleDTO } from '../dto';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';

const RoleList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Data state
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter state
  const [searchText, setSearchText] = useState('');
  
  // Export menu
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getAll();
      
      // Handle different response formats
      let roleData: RoleDTO[] = [];
      if (Array.isArray(response)) {
        roleData = response;
      } else if (response && typeof response === 'object') {
        roleData = response.data || response.content || response.roles || [];
      }
      
      if (!Array.isArray(roleData)) {
        console.error('Unexpected response format:', response);
        roleData = [];
      }
      
      setRoles(roleData);
      setError('');
    } catch (err: any) {
      console.error('Failed to load roles:', err);
      setError(err.message || 'Failed to load roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter roles
  const filteredRoles = useMemo(() => {
    if (!Array.isArray(roles)) return [];
    
    return roles.filter((role) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch = !searchText || 
        (role.name && role.name.toLowerCase().includes(searchLower)) ||
        (role.description && role.description.toLowerCase().includes(searchLower));

      return matchesSearch;
    });
  }, [roles, searchText]);

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
      headerName: t('role.name'), 
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'description', 
      headerName: t('role.description'), 
      minWidth: 300,
      flex: 2,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'permissions',
      headerName: t('role.permissions'),
      minWidth: 180,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', py: 0.5 }}>
          {params.value && Array.isArray(params.value) ? (
            <Chip
              label={`${params.value.length} permissions`}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ fontSize: '0.75rem' }}
            />
          ) : (
            <Typography variant="caption" color="text.disabled">No permissions</Typography>
          )}
        </Box>
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

  const handleCreate = () => navigate('/security/roles/create');
  const handleEdit = (roleId: number) => navigate(`/security/roles/${roleId}/edit`);
  
  const handleDelete = async (roleId: number) => {
    if (window.confirm(t('role.deleteRole') + '?')) {
      try {
        await roleService.delete(roleId);
        setSuccess('Role deleted successfully');
        loadRoles();
      } catch (err: any) {
        setError(err.message || 'Failed to delete role');
      }
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
  };

  const handleRefresh = () => {
    loadRoles();
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
    exportToCSV(filteredRoles, 'roles');
    setSuccess('Exported to CSV');
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    exportToExcel(filteredRoles, 'roles');
    setSuccess('Exported to Excel');
    handleExportMenuClose();
  };

  const handleExportPDF = () => {
    exportToPDF(filteredRoles, 'roles', t);
    setSuccess('Exported to PDF');
    handleExportMenuClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {t('role.title')}
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
              {t('role.createRole')}
            </Button>
          </Stack>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage roles and permissions
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
                placeholder={t('role.searchRoles')}
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
                {filteredRoles.length} {t('common.results')}
                {roles.length !== filteredRoles.length && (
                  <Typography component="span" variant="body2" color="text.disabled" sx={{ ml: 1 }}>
                    (filtered from {roles.length})
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
          rows={filteredRoles}
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

export default RoleList;
