/**
 * User List Page
 * Simple version with DataGrid, search, and filters (no export for now)
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { userService } from '../services';
import { UserDTO } from '../dto';

const UserList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Data state
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setError('');
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const searchLower = searchText.toLowerCase();
      const matchesSearch = !searchText || 
        user.username.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'enabled' && user.enabled) ||
        (statusFilter === 'disabled' && !user.enabled);

      // Role filter
      const matchesRole = roleFilter === 'all' ||
        user.roles?.some(role => role.name === roleFilter);

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchText, statusFilter, roleFilter]);

  // Get unique roles for filter dropdown
  const availableRoles = useMemo(() => {
    const roles = new Set<string>();
    users.forEach(user => {
      user.roles?.forEach(role => roles.add(role.name));
    });
    return Array.from(roles).sort();
  }, [users]);

  // DataGrid columns
  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70,
    },
    { 
      field: 'username', 
      headerName: t('user.username'), 
      width: 150,
      flex: 1,
    },
    { 
      field: 'email', 
      headerName: t('user.email'), 
      width: 200,
      flex: 1,
    },
    { 
      field: 'firstName', 
      headerName: t('user.firstName'), 
      width: 130,
    },
    { 
      field: 'lastName', 
      headerName: t('user.lastName'), 
      width: 130,
    },
    {
      field: 'enabled',
      headerName: t('user.status'),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? t('user.enabled') : t('user.disabled')}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'roles',
      headerName: t('user.roles'),
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {params.value?.map((role: any) => (
            <Chip
              key={role.id}
              label={role.name}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row.id)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleCreate = () => {
    navigate('/security/users/create');
  };

  const handleEdit = (userId: number) => {
    navigate(`/security/users/${userId}/edit`);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm(t('user.deleteUser') + '?')) {
      try {
        await userService.delete(userId);
        loadUsers();
      } catch (err: any) {
        console.error('Failed to delete user:', err);
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setRoleFilter('all');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          {t('user.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          {t('user.createUser')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            {/* Search */}
            <TextField
              fullWidth
              placeholder={t('user.searchUsers')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { md: 400 } }}
            />

            {/* Status Filter */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>{t('user.filterByStatus')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('user.filterByStatus')}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">{t('user.allStatuses')}</MenuItem>
                <MenuItem value="enabled">{t('user.enabled')}</MenuItem>
                <MenuItem value="disabled">{t('user.disabled')}</MenuItem>
              </Select>
            </FormControl>

            {/* Role Filter */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>{t('user.filterByRole')}</InputLabel>
              <Select
                value={roleFilter}
                label={t('user.filterByRole')}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">{t('user.allRoles')}</MenuItem>
                {availableRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Clear Filters */}
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleClearFilters}
              sx={{ minWidth: 150 }}
            >
              {t('common.clearFilters')}
            </Button>
          </Stack>

          {/* Results count */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {filteredUsers.length} {t('common.results')}
          </Typography>
        </CardContent>
      </Card>

      {/* DataGrid */}
      <Card>
        <CardContent sx={{ height: 600 }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserList;
