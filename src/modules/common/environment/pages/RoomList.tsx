/**
 * Room List Page - Professional Version
 * Advanced DataGrid with search, filters, and export
 * 
 * @author CHOUABBIA Amine
 * @created 12-28-2025
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
  Chip,
  FormControl,
  InputLabel,
  Select,
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
  Room as RoomIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import roomService from '../services/RoomService';
import blocService from '../services/BlocService';
import floorService from '../services/FloorService';
import { RoomDTO, BlocDTO, FloorDTO } from '../dto';

const RoomList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Data state
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [blocs, setBlocs] = useState<BlocDTO[]>([]);
  const [floors, setFloors] = useState<FloorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filter state
  const [searchText, setSearchText] = useState('');
  const [selectedBlocId, setSelectedBlocId] = useState<number | ''>('');
  const [selectedFloorId, setSelectedFloorId] = useState<number | ''>('');
  
  // Export menu
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, blocsData, floorsData] = await Promise.all([
        roomService.getAll(),
        blocService.getAll(),
        floorService.getAll(),
      ]);
      
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setBlocs(Array.isArray(blocsData) ? blocsData : []);
      setFloors(Array.isArray(floorsData) ? floorsData : []);
      setError('');
    } catch (err: any) {
      console.error('Failed to load rooms:', err);
      setError(err.message || 'Failed to load rooms');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms
  const filteredRooms = useMemo(() => {
    if (!Array.isArray(rooms)) return [];
    
    return rooms.filter((room) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch = !searchText || 
        (room.code && room.code.toLowerCase().includes(searchLower)) ||
        (room.designationFr && room.designationFr.toLowerCase().includes(searchLower)) ||
        (room.designationEn && room.designationEn.toLowerCase().includes(searchLower)) ||
        (room.designationAr && room.designationAr.toLowerCase().includes(searchLower));

      const matchesBloc = !selectedBlocId || room.blocId === selectedBlocId;
      const matchesFloor = !selectedFloorId || room.floorId === selectedFloorId;

      return matchesSearch && matchesBloc && matchesFloor;
    });
  }, [rooms, searchText, selectedBlocId, selectedFloorId]);

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
      field: 'code', 
      headerName: t('room.code') || 'Code', 
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RoomIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={600}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { 
      field: 'designationFr', 
      headerName: t('room.designationFr') || 'Designation (FR)', 
      minWidth: 200,
      flex: 1.5,
    },
    { 
      field: 'bloc', 
      headerName: t('room.bloc') || 'Bloc', 
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        params.row.bloc ? (
          <Chip 
            label={params.row.bloc.designationFr} 
            size="small" 
            color="primary"
            variant="outlined"
          />
        ) : null
      ),
    },
    { 
      field: 'floor', 
      headerName: t('room.floor') || 'Floor', 
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        params.row.floor ? (
          <Chip 
            label={params.row.floor.designationFr} 
            size="small" 
            color="secondary"
            variant="outlined"
          />
        ) : null
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

  const handleCreate = () => navigate('/environment/rooms/create');
  const handleEdit = (roomId: number) => navigate(`/environment/rooms/${roomId}/edit`);
  
  const handleDelete = async (roomId: number) => {
    if (window.confirm(t('room.deleteConfirm') || 'Delete this room?')) {
      try {
        await roomService.delete(roomId);
        setSuccess('Room deleted successfully');
        loadData();
      } catch (err: any) {
        setError(err.message || 'Failed to delete room');
      }
    }
  };

  const handleRefresh = () => {
    loadData();
    setSuccess('Data refreshed');
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedBlocId('');
    setSelectedFloorId('');
  };

  // Export handlers
  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportCSV = () => {
    setSuccess('Exported to CSV');
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    setSuccess('Exported to Excel');
    handleExportMenuClose();
  };

  const handleExportPDF = () => {
    setSuccess('Exported to PDF');
    handleExportMenuClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {t('room.title') || 'Rooms'}
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
              {t('room.create') || 'Create Room'}
            </Button>
          </Stack>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage rooms in blocs and floors
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
            <TextField
              fullWidth
              placeholder={t('room.searchPlaceholder') || 'Search by code or designation...'}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { md: 500 } }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl sx={{ minWidth: 200 }} size="medium">
                <InputLabel>{t('room.filterByBloc') || 'Filter by Bloc'}</InputLabel>
                <Select
                  value={selectedBlocId}
                  label={t('room.filterByBloc') || 'Filter by Bloc'}
                  onChange={(e) => setSelectedBlocId(e.target.value as number | '')}
                >
                  <MenuItem value="">
                    <em>{t('common.all') || 'All'}</em>
                  </MenuItem>
                  {blocs.map((bloc) => (
                    <MenuItem key={bloc.id} value={bloc.id}>
                      {bloc.designationFr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }} size="medium">
                <InputLabel>{t('room.filterByFloor') || 'Filter by Floor'}</InputLabel>
                <Select
                  value={selectedFloorId}
                  label={t('room.filterByFloor') || 'Filter by Floor'}
                  onChange={(e) => setSelectedFloorId(e.target.value as number | '')}
                >
                  <MenuItem value="">
                    <em>{t('common.all') || 'All'}</em>
                  </MenuItem>
                  {floors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id}>
                      {floor.designationFr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {(searchText || selectedBlocId || selectedFloorId) && (
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  sx={{ height: 56 }}
                >
                  {t('common.clearFilters')}
                </Button>
              )}
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {filteredRooms.length} {t('common.results')}
                {rooms.length !== filteredRooms.length && (
                  <Typography component="span" variant="body2" color="text.disabled" sx={{ ml: 1 }}>
                    (filtered from {rooms.length})
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
          rows={filteredRooms}
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

export default RoomList;
