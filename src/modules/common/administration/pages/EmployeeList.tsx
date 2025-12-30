/**
 * Employee List Page
 * Displays paginated list of employees with search and CRUD operations
 * 
 * @author CHOUABBIA Amine
 * @created 12-30-2025
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Paper,
  Stack,
  Alert,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { employeeService } from '../services';
import { EmployeeDTO } from '../dto';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog';

const EmployeeList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalElements, setTotalElements] = useState(0);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getAll(page, rowsPerPage);
      setEmployees(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchEmployees();
      return;
    }
    try {
      setLoading(true);
      const response = await employeeService.search(searchQuery, page, rowsPerPage);
      setEmployees(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Error searching employees:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await employeeService.delete(employeeToDelete);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Failed to delete employee');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch {
      return '-';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1">
              {t('employees.title', 'Employees')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/common/administration/employee/new')}
            >
              {t('employees.add', 'Add Employee')}
            </Button>
          </Stack>

          {/* Search Bar */}
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              fullWidth
              placeholder={t('employees.search', 'Search employees...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
            <Button
              variant="outlined"
              onClick={handleSearch}
              sx={{ minWidth: '120px' }}
            >
              {t('common.search', 'Search')}
            </Button>
            <Tooltip title={t('common.refresh', 'Refresh')}>
              <IconButton onClick={fetchEmployees}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{t('employees.registrationNumber', 'Registration #')}</TableCell>
                  <TableCell>{t('employees.fullNameAr', 'Full Name (Arabic)')}</TableCell>
                  <TableCell>{t('employees.fullNameLt', 'Full Name (Latin)')}</TableCell>
                  <TableCell>{t('employees.birthDate', 'Birth Date')}</TableCell>
                  <TableCell align="right">{t('common.actions', 'Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {t('common.loading', 'Loading...')}
                    </TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {t('employees.noData', 'No employees found')}
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id} hover>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>
                        {employee.registrationNumber || '-'}
                      </TableCell>
                      <TableCell>
                        {`${employee.lastNameAr} ${employee.firstNameAr}`}
                      </TableCell>
                      <TableCell>
                        {`${employee.lastNameLt} ${employee.firstNameLt}`}
                      </TableCell>
                      <TableCell>{formatDate(employee.birthDate)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('common.edit', 'Edit')}>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/common/administration/employee/${employee.id}`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete', 'Delete')}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setEmployeeToDelete(employee.id!);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('employees.deleteTitle', 'Delete Employee')}
        message={t('employees.deleteMessage', 'Are you sure you want to delete this employee?')}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setEmployeeToDelete(null);
        }}
      />
    </Box>
  );
};

export default EmployeeList;
