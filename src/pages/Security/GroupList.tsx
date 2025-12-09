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
import groupService, { GroupDTO } from '../../services/groupService'

type SortField = 'name' | 'description'
type SortOrder = 'asc' | 'desc'

interface SortState {
  field: SortField
  order: SortOrder
}

function GroupList() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState<GroupDTO[]>([])
  const [filteredGroups, setFilteredGroups] = useState<GroupDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sort, setSort] = useState<SortState>({
    field: 'name',
    order: 'asc',
  })
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null)

  const fetchGroups = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await groupService.getAll()
      setGroups(data)
    } catch (err) {
      console.error('Error fetching groups:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch groups')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useEffect(() => {
    let filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    filtered.sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sort.field) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'description':
          aVal = (a.description || '').toLowerCase()
          bVal = (b.description || '').toLowerCase()
          break
        default:
          aVal = a.name
          bVal = b.name
      }

      if (aVal < bVal) return sort.order === 'asc' ? -1 : 1
      if (aVal > bVal) return sort.order === 'asc' ? 1 : -1
      return 0
    })

    setFilteredGroups(filtered)
    setPage(0)
  }, [groups, searchTerm, sort])

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

  const handleAddGroup = () => {
    navigate('/security/groups/create')
  }

  const handleEditGroup = (groupId: number) => {
    navigate(`/security/groups/${groupId}/edit`)
  }

  const handleDeleteGroup = async (groupId: number) => {
    if (!window.confirm('Are you sure you want to delete this group?')) {
      return
    }

    try {
      await groupService.delete(groupId)
      setGroups(groups.filter((g) => g.id !== groupId))
    } catch (err) {
      console.error('Error deleting group:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete group')
    }
  }

  const handleRefresh = () => {
    fetchGroups()
  }

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportAnchorEl(event.currentTarget)
  }

  const handleExportClose = () => {
    setExportAnchorEl(null)
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'Roles']
    const rows = filteredGroups.map((group) => [
      group.id?.toString() || '',
      group.name,
      group.description || '-',
      group.roles?.map(r => r.name).join(', ') || '-',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `groups_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    handleExportClose()
  }

  const exportToXLSX = () => {
    try {
      const data = filteredGroups.map((group) => ({
        ID: group.id,
        Name: group.name,
        Description: group.description || '-',
        Roles: group.roles?.map(r => r.name).join(', ') || '-',
      }))

      const worksheet = XLSX.utils.json_to_sheet(data)

      const columnWidths = [
        { wch: 8 },  // ID
        { wch: 25 }, // Name
        { wch: 40 }, // Description
        { wch: 40 }, // Roles
      ]
      worksheet['!cols'] = columnWidths

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Groups')

      const fileName = `groups_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)

      handleExportClose()
    } catch (error) {
      console.error('XLSX export error:', error)
      alert('Failed to export XLSX file. Please try again.')
    }
  }

  const exportToPDF = () => {
    try {
      const doc = new jsPDF()

      doc.setFontSize(18)
      doc.text('Groups List', 14, 22)

      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)
      doc.text(`Total Groups: ${filteredGroups.length}`, 14, 36)

      const headers = [['ID', 'Name', 'Description', 'Roles']]
      const rows = filteredGroups.map((group) => [
        group.id?.toString() || '',
        group.name,
        group.description || '-',
        group.roles?.map(r => r.name).join(', ') || '-',
      ])

      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 42,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [46, 125, 50],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 15 },  // ID
          1: { cellWidth: 40 },  // Name
          2: { cellWidth: 60 },  // Description
          3: { cellWidth: 65 },  // Roles
        },
      })

      const fileName = `groups_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)

      handleExportClose()
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to export PDF file. Please try again.')
    }
  }

  const paginatedGroups = filteredGroups.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Box sx={{ p: 3, pt: 12 }}>
      <Card>
        <CardHeader
          title="Groups Management"
          subheader={`Total: ${filteredGroups.length} groups`}
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
                onClick={handleAddGroup}
                sx={{
                  bgcolor: '#2e7d32',
                  '&:hover': { bgcolor: '#1b5e20' },
                }}
              >
                Add Group
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by name or description..."
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>
                    <TableSortLabel
                      active={sort.field === 'name'}
                      direction={sort.field === 'name' ? sort.order : 'asc'}
                      onClick={() => handleSort('name')}
                      sx={{
                        '&.MuiTableSortLabel-root.Mui-active': {
                          color: '#2e7d32',
                        },
                      }}
                    >
                      <strong>Name</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.field === 'description'}
                      direction={sort.field === 'description' ? sort.order : 'asc'}
                      onClick={() => handleSort('description')}
                      sx={{
                        '&.MuiTableSortLabel-root.Mui-active': {
                          color: '#2e7d32',
                        },
                      }}
                    >
                      <strong>Description</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : paginatedGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#999' }}>
                      {error ? 'Failed to load groups' : 'No groups found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGroups.map((group) => (
                    <TableRow
                      key={group.id}
                      sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{group.name}</TableCell>
                      <TableCell>{group.description || '-'}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEditGroup(group.id!)}
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
                            onClick={() => handleDeleteGroup(group.id!)}
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filteredGroups.length}
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

export default GroupList
