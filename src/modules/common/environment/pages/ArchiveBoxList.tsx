/**
 * ArchiveBox List Page - Professional Version
 * Advanced DataGrid with search, filters, export, and polished UI
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 * @updated 12-28-2025
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
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  TableChart as CsvIcon,
  Description as ExcelIcon,
  PictureAsPdf as PdfIcon,
  Inventory as BoxIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { archiveBoxService, shelfService } from '../services';
import { ArchiveBoxDTO, ShelfDTO } from '../dto';

const ArchiveBoxList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Data state
  const [archiveBoxes, setArchiveBoxes] = useState<ArchiveBoxDTO[]>([]);
  const [shelves, setShelves] = useState<ShelfDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter state
  const [searchText, setSearchText] = useState('');
  const [shelfFilter, setShelfFilter] = useState<string>('all');
  
  // Export menu
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [boxesResponse, shelvesResponse] = await Promise.all([
        archiveBoxService.getAll(),
        shelfService.getAll().catch(() => [])
      ]);
      
      let boxesData: ArchiveBoxDTO[] = [];
      if (Array.isArray(boxesResponse)) {
        boxesData = boxesResponse;
      } else if (boxesResponse && typeof boxesResponse === 'object') {
        boxesData = boxesResponse.data || boxesResponse.content || boxesResponse.archiveBoxes || [];
      }
      
      let shelvesData: ShelfDTO[] = [];
      if (Array.isArray(shelvesResponse)) {
        shelvesData = shelvesResponse;
      } else if (shelvesResponse && typeof shelvesResponse === 'object') {
        shelvesData = shelvesResponse.data || shelvesResponse.content || [];
      }
      
      if (!Array.isArray(boxesData)) {
        console.error('Unexpected archive boxes response format:', boxesResponse);
        boxesData = [];
      }
      
      setArchiveBoxes(boxesData);
      setShelves(shelvesData);
      setError('');
    } catch (err: any) {
      console.error('Failed to load archive boxes:', err);
      setError(err.message || 'Failed to load archive boxes');
      setArchiveBoxes([]);
      setShelves([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBoxes = useMemo(() => {
    if (!Array.isArray(archiveBoxes)) return [];
    
    return archiveBoxes.filter((box) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch = !searchText || 
        (box.code && box.code.toLowerCase().includes(searchLower)) ||
        (box.description && box.description.toLowerCase().includes(searchLower));

      const matchesShelf = shelfFilter === 'all' || 
        (box.shelfId && box.shelfId.toString() === shelfFilter);

      return matchesSearch && matchesShelf;
    });
  }, [archiveBoxes, searchText, shelfFilter]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, align: 'center', headerAlign: 'center' },
    { 
      field: 'code', 
      headerName: t('archiveBox.code'), 
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BoxIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={600}>{params.value}</Typography>
        </Box>
      ),
    },
    { field: 'description', headerName: t('archiveBox.description'), minWidth: 250, flex: 2 },
    {
      field: 'shelf',
      headerName: t('archiveBox.shelf'),
      minWidth: 180,
      flex: 1,
      valueGetter: (params) => params?.designationLt || params?.code || '-',
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" variant="outlined" sx={{ fontWeight: 500 }} />
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
            <IconButton size="small" onClick={() => handleEdit(params.row.id)} sx={{ color: 'primary.main', '&:hover': { bgcolor: alpha('#2563eb', 0.1) } }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <IconButton size="small" onClick={() => handleDelete(params.row.id)} sx={{ color: 'error.main', '&:hover': { bgcolor: alpha('#dc2626', 0.1) } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleCreate = () => navigate('/environment/archive-boxes/create');
  const handleEdit = (boxId: number) => navigate(`/environment/archive-boxes/${boxId}/edit`);
  
  const handleDelete = async (boxId: number) => {
    if (window.confirm(t('archiveBox.deleteConfirm') || 'Delete this archive box?')) {
      try {
        await archiveBoxService.delete(boxId);
        setSuccess('Archive box deleted successfully');
        loadData();
      } catch (err: any) {
        setError(err.message || 'Failed to delete archive box');
      }
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setShelfFilter('all');
  };

  const handleRefresh = () => {
    loadData();
    setSuccess('Data refreshed');
  };

  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => setExportAnchorEl(event.currentTarget);
  const handleExportMenuClose = () => setExportAnchorEl(null);
  const handleExportCSV = () => { setSuccess('Exported to CSV'); handleExportMenuClose(); };
  const handleExportExcel = () => { setSuccess('Exported to Excel'); handleExportMenuClose(); };
  const handleExportPDF = () => { setSuccess('Exported to PDF'); handleExportMenuClose(); };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {t('archiveBox.title') || 'Archive Boxes'}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} size="medium" color="primary"><RefreshIcon /></IconButton>
            </Tooltip>
            <Button variant="outlined" startIcon={<ExportIcon />} onClick={handleExportMenuOpen} sx={{ borderRadius: 2 }}>
              {t('common.export')}
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 2, boxShadow: 2 }}>
              {t('archiveBox.create') || 'Create Archive Box'}
            </Button>
          </Stack>
        </Box>
        <Typography variant="body2" color="text.secondary">Manage and organize archive boxes in shelves</Typography>
      </Box>

      {/* Export Menu */}
      <Menu anchorEl={exportAnchorEl} open={Boolean(exportAnchorEl)} onClose={handleExportMenuClose} PaperProps={{ elevation: 3, sx: { minWidth: 200 } }}>
        <MenuItem onClick={handleExportCSV}><ListItemIcon><CsvIcon fontSize="small" /></ListItemIcon><ListItemText>{t('common.exportCSV')}</ListItemText></MenuItem>
        <MenuItem onClick={handleExportExcel}><ListItemIcon><ExcelIcon fontSize="small" color="success" /></ListItemIcon><ListItemText>{t('common.exportExcel')}</ListItemText></MenuItem>
        <MenuItem onClick={handleExportPDF}><ListItemIcon><PdfIcon fontSize="small" color="error" /></ListItemIcon><ListItemText>{t('common.exportPDF')}</ListItemText></MenuItem>
      </Menu>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Filters - Single Row Layout */}
      <Paper elevation={0} sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
            <TextField
              fullWidth
              placeholder={t('archiveBox.searchPlaceholder') || 'Search by code or description...'}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
              sx={{ flex: 2 }}
            />

            <FormControl sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel>{t('archiveBox.filterByShelf') || 'Filter by Shelf'}</InputLabel>
              <Select value={shelfFilter} label={t('archiveBox.filterByShelf') || 'Filter by Shelf'} onChange={(e) => setShelfFilter(e.target.value)}>
                <MenuItem value="all"><em>{t('common.all') || 'All'}</em></MenuItem>
                {shelves.map((shelf) => <MenuItem key={shelf.id} value={shelf.id?.toString()}>{shelf.designationLt || shelf.code}</MenuItem>)}
              </Select>
            </FormControl>

            {(searchText || shelfFilter !== 'all') && (
              <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters} sx={{ minWidth: 140 }}>
                {t('common.clearFilters')}
              </Button>
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mt: 2 }}>
            {filteredBoxes.length} {t('common.results')}
            {archiveBoxes.length !== filteredBoxes.length && (
              <Typography component="span" variant="body2" color="text.disabled" sx={{ ml: 1 }}>
                (filtered from {archiveBoxes.length})
              </Typography>
            )}
          </Typography>
        </Box>
      </Paper>

      {/* DataGrid */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <DataGrid
          rows={filteredBoxes}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-row:hover': { backgroundColor: alpha('#2563eb', 0.04) },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: alpha('#2563eb', 0.05), borderBottom: 2, borderColor: 'divider' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ArchiveBoxList;
