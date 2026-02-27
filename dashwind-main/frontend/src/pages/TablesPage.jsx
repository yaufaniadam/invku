import React, { useState } from 'react';
import { Sidebar, Header } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  FileSpreadsheet, 
  Plus, 
  ChevronUp, 
  ChevronDown,
  Eye,
  Pencil,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data for the table
const tableData = [
  {
    id: 'SPPG-001',
    nama: 'Sekolah Penggerak Maju Bersama',
    lembaga: 'Yayasan Pendidikan Nusantara',
    status: 'Operasional',
    statusType: 'success',
    aktif: true,
    akreditasi: 'A',
    kepalaSPPG: 'Dr. Budi Santoso, M.Pd',
  },
  {
    id: 'SPPG-002',
    nama: 'Pusat Pelatihan Guru Profesional',
    lembaga: 'Dinas Pendidikan Jakarta',
    status: 'Siap Berjalan',
    statusType: 'success',
    aktif: true,
    akreditasi: 'A',
    kepalaSPPG: 'Prof. Siti Rahayu, Ph.D',
  },
  {
    id: 'SPPG-003',
    nama: 'Lembaga Sertifikasi Pendidik',
    lembaga: 'Universitas Negeri Malang',
    status: 'Aktif',
    statusType: 'default',
    aktif: true,
    akreditasi: 'B',
    kepalaSPPG: 'Drs. Ahmad Wijaya, M.Si',
  },
  {
    id: 'SPPG-004',
    nama: 'Balai Diklat Guru Daerah',
    lembaga: 'Pemerintah Provinsi Jawa Barat',
    status: 'Operasional',
    statusType: 'success',
    aktif: true,
    akreditasi: 'A',
    kepalaSPPG: 'Ir. Dewi Kusuma, M.T',
  },
  {
    id: 'SPPG-005',
    nama: 'Unit Pengembangan Kompetensi',
    lembaga: 'Kementerian Pendidikan',
    status: 'Dalam Proses',
    statusType: 'warning',
    aktif: false,
    akreditasi: 'B',
    kepalaSPPG: 'Dr. Hendra Prasetyo, M.Pd',
  },
  {
    id: 'SPPG-006',
    nama: 'Sekolah Model Penggerak',
    lembaga: 'Yayasan Cendekia Indonesia',
    status: 'Operasional',
    statusType: 'success',
    aktif: true,
    akreditasi: 'A',
    kepalaSPPG: 'Dra. Rina Marlina, M.M',
  },
  {
    id: 'SPPG-007',
    nama: 'Pusat Inovasi Pembelajaran',
    lembaga: 'Institut Teknologi Bandung',
    status: 'Siap Berjalan',
    statusType: 'success',
    aktif: true,
    akreditasi: 'A',
    kepalaSPPG: 'Prof. Andi Firmansyah, Ph.D',
  },
  {
    id: 'SPPG-008',
    nama: 'Lembaga Peningkatan Mutu',
    lembaga: 'Universitas Gadjah Mada',
    status: 'Aktif',
    statusType: 'default',
    aktif: true,
    akreditasi: 'A',
    kepalaSPPG: 'Dr. Maya Indah, M.Sc',
  },
  {
    id: 'SPPG-009',
    nama: 'Akademi Guru Kreatif',
    lembaga: 'Yayasan Kreativitas Bangsa',
    status: 'Tidak Aktif',
    statusType: 'destructive',
    aktif: false,
    akreditasi: 'C',
    kepalaSPPG: 'Drs. Fajar Nugroho, M.Pd',
  },
  {
    id: 'SPPG-010',
    nama: 'Balai Pengembangan SDM',
    lembaga: 'Dinas Pendidikan Surabaya',
    status: 'Operasional',
    statusType: 'success',
    aktif: true,
    akreditasi: 'B',
    kepalaSPPG: 'Ir. Linda Permata, M.T',
  },
];

// Sort Icon Component
const SortIcon = ({ column, sortConfig }) => {
  const isActive = sortConfig.key === column;
  return (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp 
        className={cn(
          "h-3 w-3 -mb-1",
          isActive && sortConfig.direction === 'asc' ? "text-primary" : "text-muted-foreground/40"
        )} 
      />
      <ChevronDown 
        className={cn(
          "h-3 w-3",
          isActive && sortConfig.direction === 'desc' ? "text-primary" : "text-muted-foreground/40"
        )} 
      />
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ status, type }) => {
  const styles = {
    success: 'bg-success/10 text-success border-success/20',
    default: 'bg-secondary text-muted-foreground border-border',
    warning: 'bg-warning/10 text-warning border-warning/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      styles[type] || styles.default
    )}>
      {status}
    </span>
  );
};

export default function TablesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [perPage, setPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle select all
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(tableData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Handle individual row selection
  const handleRowSelect = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
      setSelectAll(false);
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  const filteredData = tableData
    .filter(row => {
      const matchesSearch = row.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           row.lembaga.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || row.statusType === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalResults = 11;
  const startResult = 1;
  const endResult = Math.min(parseInt(perPage), totalResults);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main content */}
        <main className="p-4 lg:p-8">
          {/* Page Header with Breadcrumbs and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Breadcrumbs */}
            <div>
              <nav className="flex items-center text-sm text-muted-foreground mb-2">
                <span>Dashboard</span>
                <span className="mx-2">/</span>
                <span>Data Master</span>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">SPPG</span>
              </nav>
              <h1 className="text-2xl font-bold text-foreground">Data SPPG</h1>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button className="bg-success hover:bg-success/90 text-success-foreground gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Import SPPG (Excel)
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Table Controls Card */}
          <Card className="border-0 shadow-card mb-6">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Filter Dropdown */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Filter:</span>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="success">Operasional</SelectItem>
                    <SelectItem value="default">Aktif</SelectItem>
                    <SelectItem value="warning">Dalam Proses</SelectItem>
                    <SelectItem value="destructive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-lg border-input focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Card>

          {/* Data Table Card */}
          <Card className="border-0 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <span className="flex items-center">
                        ID SPPG
                        <SortIcon column="id" sortConfig={sortConfig} />
                      </span>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('nama')}
                    >
                      <span className="flex items-center">
                        Nama
                        <SortIcon column="nama" sortConfig={sortConfig} />
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Lembaga Pengusul
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Aktif
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Akreditasi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Kepala SPPG
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-border">
                  {filteredData.map((row) => (
                    <tr 
                      key={row.id} 
                      className="bg-card hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          onCheckedChange={(checked) => handleRowSelect(row.id, checked)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-foreground">{row.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-foreground">{row.nama}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-muted-foreground">{row.lembaga}</span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={row.status} type={row.statusType} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        {row.aktif ? (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-success/10">
                            <Check className="h-4 w-4 text-success" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-bold",
                          row.akreditasi === 'A' && "bg-success/10 text-success",
                          row.akreditasi === 'B' && "bg-info/10 text-info",
                          row.akreditasi === 'C' && "bg-warning/10 text-warning"
                        )}>
                          {row.akreditasi}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-muted-foreground">{row.kepalaSPPG}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="h-4 w-4" />
                            <span>Lihat</span>
                          </button>
                          <button className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 transition-colors">
                            <Pencil className="h-4 w-4" />
                            <span>Ubah</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Pagination */}
            <div className="px-4 py-4 border-t border-border bg-secondary/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Results Info */}
                <p className="text-sm text-muted-foreground">
                  Menampilkan <span className="font-medium text-foreground">{startResult}</span> sampai <span className="font-medium text-foreground">{endResult}</span> dari <span className="font-medium text-foreground">{totalResults}</span> hasil
                </p>

                {/* Pagination Controls */}
                <div className="flex items-center gap-4">
                  {/* Per Page Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Per halaman:</span>
                    <Select value={perPage} onValueChange={setPerPage}>
                      <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pagination Links */}
                  <div className="flex items-center gap-1">
                    <button 
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button 
                      className={cn(
                        "inline-flex items-center justify-center h-8 w-8 rounded-lg border text-sm font-medium transition-colors",
                        currentPage === 1 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                    <button 
                      className={cn(
                        "inline-flex items-center justify-center h-8 w-8 rounded-lg border text-sm font-medium transition-colors",
                        currentPage === 2 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                      onClick={() => setCurrentPage(2)}
                    >
                      2
                    </button>
                    <button 
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === 2}
                      onClick={() => setCurrentPage(p => Math.min(2, p + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
