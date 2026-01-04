/**
 * Structure List Page
 * Hierarchical organizational structures with search and filters
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
 * @updated 01-04-2026 - Server-side pagination and filtering
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Alert,
  TextField,
  InputAdornment,
  Stack,
  Paper,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  MenuItem,
  alpha,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Chip,
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
  AccountTree as StructureIcon,
  Business as OrganizationIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import structureService from '../services/StructureService';
import structureTypeService from '../services/StructureTypeService';
import { StructureDTO } from '../dto/StructureDTO';
import { StructureTypeDTO } from '../dto/StructureTypeDTO';

const StructureList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLanguage = useMemo(() => {
    const lang = i18n.language || 'fr';
    return lang.split('-')[0]; // 'en-US' -> 'en'
  }, [i18n.language]);

  const getStructureDesignation = (s?: Partial<StructureDTO> | null): string => {
    if (!s) return '-';
    if (currentLanguage === 'ar') return s.designationAr || s.designationFr || s.designationEn || '-';
    if (currentLanguage === 'en') return s.designationEn || s.designationFr || s.designationAr || '-';
    return s.designationFr || s.designationEn || s.designationAr || '-';
  };

  const getStructureTypeLabel = (type?: any): string => {
    if (!type) return '-';
    if (currentLanguage === 'ar') return type.designationAr || type.designationFr || type.designationEn || type.label || type.code || '-';
    if (currentLanguage === 'en') return type.designationEn || type.designationFr || type.designationAr || type.label || type.code || '-';
    return type.designationFr || type.designationEn || type.designationAr || type.label || type.code || '-';
  };

  // Data state
  const [structures, setStructures] = useState<StructureDTO[]>([]);
  const [structureTypes, setStructureTypes] = useState<StructureTypeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination state
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [totalElements, setTotalElements] = useState(0);
  const [rowCountState, setRowCountState] = useState(totalElements);

  // Filter state
  const [searchText, setSearchText] = useState('');
  const [searchInput, setSearchInput] = useState(''); // For debouncing
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');

  // Export menu
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadStructureTypes();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchText) {
        setSearchText(searchInput);
        setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadStructures();
  }, [paginationModel.page, paginationModel.pageSize, searchText, selectedTypeId]);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      totalElements !== undefined ? totalElements : prevRowCountState,
    );
  }, [totalElements]);

  const loadStructureTypes = async () => {
    try {
      const typesData = await structureTypeService.getAll();
      let typesList: StructureTypeDTO[] = [];
      if (Array.isArray(typesData)) {
        typesList = typesData;
      } else if (typesData && typeof typesData === 'object') {
        typesList = (typesData as any).data || (typesData as any).content || [];
      }
      setStructureTypes(typesList);
    } catch (err: any) {
      console.error('Failed to load structure types:', err);
    }
  };

  const loadStructures = async () => {
    try {
      setLoading(true);
      
      // Build sort parameter
      const sort = 'code,asc';

      // Use pageable endpoint with server-side filtering
      const response = await structureService.getPageable({
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sort: sort,
        search: searchText || undefined,
        structureTypeId: selectedTypeId ? Number(selectedTypeId) : undefined,
      });

      setStructures(response.content || []);
      setTotalElements(response.totalElements);
      setError('');
    } catch (err: any) {
      console.error('Failed to load structures:', err);
      setError(err.message || t('common.error'));
      setStructures([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // DataGrid columns with language-aware headers
  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'code',
      headerName: t('common.code'),
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StructureIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={600}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'designation',
      headerName: t('common.designation'),
      minWidth: 260,
      flex: 2,
      valueGetter: (params) => getStructureDesignation(params.row as StructureDTO),
    },
    {
      field: 'structureType',
      headerName: t('common.type'),
      width: 170,
      renderCell: (params) => {
        const row = params.row as any;
        const typeObj = row.structureType || row.type;
        return typeObj ? (
          <Chip label={getStructureTypeLabel(typeObj)} size="small" color="primary" variant="outlined" />
        ) : (
          <Chip label={t('common.notAvailable')} size="small" variant="outlined" />
        );
      },
    },
    {
      field: 'parentStructure',
      headerName: t('administration.organization'),
      width: 200,
      renderCell: (params) => {
        const parent = (params.row as any).parentStructure as StructureDTO | undefined;
        return parent ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <OrganizationIcon fontSize="small" color="action" />
            <Typography variant="body2" noWrap>
              {getStructureDesignation(parent) || parent.code}
            </Typography>
          </Box>
        ) : (
          <Chip label={t('common.root')} size="small" color="success" variant="outlined" />
        );
      },
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
                '&:hover': { bgcolor: alpha('#2563eb', 0.1) },
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
                '&:hover': { bgcolor: alpha('#dc2626', 0.1) },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [t, currentLanguage]);

  const handleCreate = () => navigate('/administration/structures/create');
  const handleEdit = (structureId: number) => navigate(`/administration/structures/${structureId}/edit`);

  const handleDelete = async (structureId: number) => {
    if (window.confirm(t('common.delete') + '?')) {
      try {
        await structureService.delete(structureId);
        setSuccess(t('common.deleted'));
        loadStructures();
      } catch (err: any) {
        setError(err.message || t('common.error'));
      }
    }
  };

  const handleRefresh = () => {
    loadStructures();
    setSuccess(t('common.refreshed'));
  };

  const handleTypeFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedTypeId(event.target.value);
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchText('');
    setSelectedTypeId('');
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  // Export handlers
  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportCSV = () => {
    setSuccess(t('common.exportedCSV'));
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    setSuccess(t('common.exportedExcel'));
    handleExportMenuClose();
  };

  const handleExportPDF = () => {
    setSuccess(t('common.exportedPDF'));
    handleExportMenuClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {t('administration.structures')}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Tooltip title={t('common.refresh')}>
              <IconButton onClick={handleRefresh} size="medium" color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button variant="outlined" startIcon={<ExportIcon />} onClick={handleExportMenuOpen} sx={{ borderRadius: 2 }}>
              {t('common.export')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ borderRadius: 2, boxShadow: 2 }}
            >
              {t('administration.createStructure')}
            </Button>
          </Stack>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t('administration.structuresSubtitle')}
        </Typography>
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleExportMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200 },
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
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder={t('common.searchByCodeOrDesignation')}
                value={searchInput}
                onChange={handleSearchInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1, minWidth: 300 }}
              />

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>{t('administration.structureType')}</InputLabel>
                <Select
                  value={selectedTypeId}
                  onChange={handleTypeFilterChange}
                  label={t('administration.structureType')}
                >
                  <MenuItem value="">
                    <em>{t('common.allTypes')}</em>
                  </MenuItem>
                  {structureTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id.toString()}>
                      {getStructureTypeLabel(type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {(searchInput || selectedTypeId) && (
                <Button variant="outlined" onClick={handleClearFilters} sx={{ minWidth: 120 }}>
                  {t('common.clearFilters')}
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {totalElements} {t('common.results')}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* DataGrid */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <DataGrid
          rows={structures}
          columns={columns}
          loading={loading}
          rowCount={rowCountState}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
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

export default StructureList;
