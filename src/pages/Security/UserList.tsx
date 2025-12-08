import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  TableSortLabel,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Search,
  Download,
} from '@mui/icons-material'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import authService from '../../services/authService'

interface User {
  id: string
  username: string
  email: string
  enabled: boolean
  locked: boolean
  createdAt: string
  lastLogin?: string
}

type SortField = 'username' | 'enabled' | 'locked' | 'createdAt'
type SortOrder = 'asc' | 'desc'

interface SortState {
  field: SortField
  order: SortOrder
}

function UserList() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sort, setSort] = useState<SortState>({
    field: 'username',
    order: 'asc',
  })
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null)

  // Mock data generator
  const generateMockUsers = (): User[] => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@company.com',
        enabled: true,
        locked: false,
        createdAt: '2025-01-15T10:30:00Z',
        lastLogin: '2025-12-08T09:15:00Z',
      },
      {
        id: '2',
        username: 'john_doe',
        email: 'john@company.com',
        enabled: true,
        locked: false,
        createdAt: '2025-02-20T14:45:00Z',
        lastLogin: '2025-12-07T16:20:00Z',
      },
      {
        id: '3',
        username: 'jane_smith',
        email: 'jane@company.com',
        enabled: true,
        locked: false,
        createdAt: '2025-03-10T08:00:00Z',
        lastLogin: '2025-12-08T11:00:00Z',
      },
      {
        id: '4',
        username: 'bob_wilson',
        email: 'bob@company.com',
        enabled: false,
        locked: false,
        createdAt: '2025-04-05T13:20:00Z',
        lastLogin: '2025-12-01T10:30:00Z',
      },
      {
        id: '5',
        username: 'alice_brown',
        email: 'alice@company.com',
        enabled: true,
        locked: true,
        createdAt: '2025-05-12T09:45:00Z',
        lastLogin: '2025-11-28T14:15:00Z',
      },
      {
        id: '6',
        username: 'charlie_davis',
        email: 'charlie@company.com',
        enabled: true,
        locked: false,
        createdAt: '2025-06-18T11:30:00Z',
        lastLogin: '2025-12-06T13:45:00Z',
      },
      {
        id: '7',
        username: 'diana_miller',
        email: 'diana@company.com',
        enabled: true,
        locked: false,
        createdAt: '2025-07-22T15:00:00Z',
        lastLogin: '2025-12-08T08:30:00Z',
      },
      {
        id: '8',
        username: 'evan_garcia',
        email: 'evan@company.com',
        enabled: false,
        locked: true,
        createdAt: '2025-08-30T10:15:00Z',
        lastLogin: '2025-11-15T12:00:00Z',
      },
      {
        id: '9',
        username: 'frank_anderson',
        email: 'frank@company.com',
        enabled: true,
        locked: false,
        createdAt: '2025-09-14T14:30:00Z',
        lastLogin: '2025-12-05T17:45:00Z',
      },
      {
        id: '10',
        username: 'grace_taylor',
        email: 'grace@company.com',
        enabled: true,
        locked: false,
        createdAt: '2025-10-08T09:00:00Z',
        lastLogin: '2025-12-08T10:20:00Z',
      },
      {
        id: '11',
        username: 'henry_thomas',
        email: 'henry@company.com',
        enabled: true,
        locked: false,
        createdAt: '2025-11-02T16:20:00Z',
        lastLogin: '2025-12-07T15:30:00Z',
      },
      {
        id: '12',
        username: 'iris_jackson',
        email: 'iris@company.com',
        enabled: true,
        locked: false,
        createdAt: '2025-11-25T12:45:00Z',
        lastLogin: '2025-12-08T09:00:00Z',
      },
    ]
    return mockUsers
  }

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const mockUsers = generateMockUsers()
      setUsers(mockUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter and sort users
  useEffect(() => {
    let filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sort.field) {
        case 'username':
          aVal = a.username.toLowerCase()
          bVal = b.username.toLowerCase()
          break
        case 'enabled':
          aVal = a.enabled ? 1 : 0
          bVal = b.enabled ? 1 : 0
          break
        case 'locked':
          aVal = a.locked ? 1 : 0
          bVal = b.locked ? 1 : 0
          break
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime()
          bVal = new Date(b.createdAt).getTime()
          break
        default:
          aVal = a.username
          bVal = b.username
      }

      if (aVal < bVal) return sort.order === 'asc' ? -1 : 1
      if (aVal > bVal) return sort.order === 'asc' ? 1 : -1
      return 0
    })

    setFilteredUsers(filtered)
    setPage(0)
  }, [users, searchTerm, sort])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      setSort({
        field,
        order: sort.order === 'asc' ? 'desc' : 'asc',
      })
    } else {
      setSort({
        field,
        order: 'asc',
      })
    }
  }

  const handleAddUser = () => {
    navigate('/security/users/create')
  }

  const handleEditUser = (userId: string) => {
    navigate(`/security/users/${userId}/edit`)
  }

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId))
    }
  }

  const handleRefresh = () => {
    fetchUsers()
  }

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportAnchorEl(event.currentTarget)
  }

  const handleExportClose = () => {
    setExportAnchorEl(null)
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Username', 'Email', 'Enabled', 'Locked', 'Created', 'Last Login']
    const rows = filteredUsers.map((user) => [
      user.id,
      user.username,
      user.email,
      user.enabled ? 'Yes' : 'No',
      user.locked ? 'Yes' : 'No',
      new Date(user.createdAt).toLocaleString(),
      user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    handleExportClose()
  }

  const exportToXLSX = () => {
    try {
      // Prepare data for Excel
      const data = filteredUsers.map((user) => ({
        ID: user.id,
        Username: user.username,
        Email: user.email,
        Enabled: user.enabled ? 'Yes' : 'No',
        Locked: user.locked ? 'Yes' : 'No',
        Created: new Date(user.createdAt).toLocaleString(),
        'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-',
      }))

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(data)

      // Set column widths
      const columnWidths = [
        { wch: 8 },  // ID
        { wch: 20 }, // Username
        { wch: 30 }, // Email
        { wch: 10 }, // Enabled
        { wch: 10 }, // Locked
        { wch: 25 }, // Created
        { wch: 25 }, // Last Login
      ]
      worksheet['!cols'] = columnWidths

      // Create workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')

      // Generate file
      const fileName = `users_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)

      handleExportClose()
    } catch (error) {
      console.error('XLSX export error:', error)
      alert('Failed to export XLSX file. Please try again.')
    }
  }

  const exportToPDF = () => {
    try {
      // Create PDF document
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(18)
      doc.text('Users List', 14, 22)

      // Add date
      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)
      doc.text(`Total Users: ${filteredUsers.length}`, 14, 36)

      // Prepare table data
      const headers = [['ID', 'Username', 'Email', 'Enabled', 'Locked', 'Created', 'Last Login']]
      const rows = filteredUsers.map((user) => [
        user.id,
        user.username,
        user.email,
        user.enabled ? 'Yes' : 'No',
        user.locked ? 'Yes' : 'No',
        new Date(user.createdAt).toLocaleDateString(),
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-',
      ])

      // Add table
      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 42,
        styles: {
          fontSize: 9,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [46, 125, 50], // Green color
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 15 },  // ID
          1: { cellWidth: 30 },  // Username
          2: { cellWidth: 45 },  // Email
          3: { cellWidth: 20 },  // Enabled
          4: { cellWidth: 20 },  // Locked
          5: { cellWidth: 30 },  // Created
          6: { cellWidth: 30 },  // Last Login
        },
      })

      // Save PDF
      const fileName = `users_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)

      handleExportClose()
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to export PDF file. Please try again.')
    }
  }

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <Box sx={{ p: 3, pt: 12 }}>
      <Card>
        <CardHeader
          title="Users Management"
          subheader={`Total: ${filteredUsers.length} users`}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExportClick}
                sx={{
                  bgcolor: '#2e7d32',
                  '&:hover': { bgcolor: '#1b5e20' },
                }}
              >
                Export
              </Button>
              <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={handleExportClose}
              >
                <MenuItem onClick={exportToCSV}>
                  Export as CSV
                </MenuItem>
                <MenuItem onClick={exportToXLSX}>
                  Export as XLSX
                </MenuItem>
                <MenuItem onClick={exportToPDF}>
                  Export as PDF
                </MenuItem>
              </Menu>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddUser}
                sx={{
                  bgcolor: '#2e7d32',
                  '&:hover': { bgcolor: '#1b5e20' },
                }}
              >
                Add User
              </Button>
            </Box>
          }
        />
        <CardContent>
          {/* Search and Controls */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: '#2e7d32' }} />,
              }}
              sx={{
                flex: 1,
                minWidth: '250px',
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2e7d32',
                  },
                },
              }}
              size="small"
            />
            <Button
              variant="outlined"
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                borderColor: '#2e7d32',
                color: '#2e7d32',
                '&:hover': {
                  borderColor: '#1b5e20',
                  bgcolor: 'rgba(46, 125, 50, 0.04)',
                },
              }}
            >
              {loading ? <CircularProgress size={20} /> : 'Refresh'}
            </Button>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>
                    <TableSortLabel
                      active={sort.field === 'username'}
                      direction={sort.field === 'username' ? sort.order : 'asc'}
                      onClick={() => handleSort('username')}
                      sx={{
                        '&.MuiTableSortLabel-root.Mui-active': {
                          color: '#2e7d32',
                        },
                      }}
                    >
                      <strong>Username</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.field === 'enabled'}
                      direction={sort.field === 'enabled' ? sort.order : 'asc'}
                      onClick={() => handleSort('enabled')}
                      sx={{
                        '&.MuiTableSortLabel-root.Mui-active': {
                          color: '#2e7d32',
                        },
                      }}
                    >
                      <strong>Enabled</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.field === 'locked'}
                      direction={sort.field === 'locked' ? sort.order : 'asc'}
                      onClick={() => handleSort('locked')}
                      sx={{
                        '&.MuiTableSortLabel-root.Mui-active': {
                          color: '#2e7d32',
                        },
                      }}
                    >
                      <strong>Locked</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.field === 'createdAt'}
                      direction={sort.field === 'createdAt' ? sort.order : 'asc'}
                      onClick={() => handleSort('createdAt')}
                      sx={{
                        '&.MuiTableSortLabel-root.Mui-active': {
                          color: '#2e7d32',
                        },
                      }}
                    >
                      <strong>Created</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <strong>Last Login</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#999' }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:hover': { bgcolor: '#f9f9f9' },
                        opacity: user.enabled ? 1 : 0.6,
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.enabled ? 'Enabled' : 'Disabled'}
                          color={user.enabled ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.locked ? 'Locked' : 'Unlocked'}
                          color={user.locked ? 'error' : 'success'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {user.lastLogin ? formatDate(user.lastLogin) : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEditUser(user.id)}
                            sx={{
                              color: '#2e7d32',
                              '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.08)' },
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteUser(user.id)}
                            sx={{
                              color: '#c41c47',
                              '&:hover': { bgcolor: 'rgba(196, 28, 71, 0.08)' },
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            sx={{
              '& .MuiTablePagination-select': {
                borderColor: '#2e7d32',
              },
              '& .MuiIconButton-root:not(:disabled)': {
                color: '#2e7d32',
              },
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserList
