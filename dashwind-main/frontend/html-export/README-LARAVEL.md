# 🚀 Panduan Implementasi Laravel

## 📥 Langkah 1: Download File

Download semua file dari folder `html-export/`:
- `assets/css/styles.css` - CSS utama
- `dashboard.html`
- `settings.html`  
- `tables.html`
- `auth.html`

---

## 📁 Langkah 2: Struktur Folder Laravel

Letakkan file sesuai struktur berikut:

```
laravel-project/
├── public/
│   └── assets/
│       └── css/
│           └── styles.css          ← Pindahkan CSS ke sini
│
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php       ← Layout utama
│       │
│       ├── components/
│       │   ├── sidebar.blade.php   ← Komponen sidebar
│       │   └── header.blade.php    ← Komponen header
│       │
│       ├── dashboard.blade.php     ← Halaman dashboard
│       ├── settings.blade.php      ← Halaman settings
│       ├── tables.blade.php        ← Halaman tables
│       │
│       └── auth/
│           └── login.blade.php     ← Halaman login
```

---

## 📄 Langkah 3: Buat Layout Utama

Buat file `resources/views/layouts/app.blade.php`:

```blade
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Dashboard') - {{ config('app.name') }}</title>
    
    <!-- Google Fonts - Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    
    <!-- Alpine.js -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">
    
    @stack('styles')
</head>
<body x-data="{ sidebarOpen: false, openSubmenus: {} }">
    
    <!-- Mobile Sidebar Overlay -->
    <div 
        x-show="sidebarOpen" 
        x-transition:enter="transition-opacity duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition-opacity duration-300"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
        @click="sidebarOpen = false"
        class="sidebar-overlay lg:hidden"
    ></div>

    <!-- Sidebar -->
    @include('components.sidebar')

    <!-- Main Content -->
    <div class="lg:pl-64">
        <!-- Header -->
        @include('components.header')

        <!-- Page Content -->
        <main class="p-4 lg:p-8">
            @yield('content')
        </main>
    </div>

    <!-- Initialize Lucide Icons -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            lucide.createIcons();
        });
        
        // Re-initialize icons when Livewire updates DOM
        document.addEventListener('livewire:navigated', () => {
            lucide.createIcons();
        });
    </script>
    
    @stack('scripts')
</body>
</html>
```

---

## 🧩 Langkah 4: Buat Komponen Sidebar

Buat file `resources/views/components/sidebar.blade.php`:

```blade
<aside 
    class="sidebar"
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
>
    <!-- Logo -->
    <div class="sidebar-header">
        <a href="{{ route('dashboard') }}" class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <i data-lucide="layers" class="h-5 w-5 text-primary-foreground"></i>
            </div>
            <span class="text-lg font-semibold text-sidebar-foreground">Dashboard</span>
        </a>
        <button @click="sidebarOpen = false" class="btn btn-ghost btn-icon-sm lg:hidden">
            <i data-lucide="chevron-left" class="h-4 w-4"></i>
        </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
        <div class="space-y-1">
            <a href="{{ route('dashboard') }}" 
               class="sidebar-menu-item {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                <i data-lucide="layout-dashboard" class="h-5 w-5"></i>
                <span>Dashboard</span>
                @if(request()->routeIs('dashboard'))
                    <span class="ml-auto h-2 w-2 rounded-full bg-primary"></span>
                @endif
            </a>

            <!-- Menu dengan Submenu -->
            <div>
                <button 
                    @click="openSubmenus.invoice = !openSubmenus.invoice"
                    class="sidebar-menu-item w-full justify-between"
                    :class="openSubmenus.invoice ? 'sidebar-menu-item-parent active' : ''"
                >
                    <div class="flex items-center gap-3">
                        <i data-lucide="file-spreadsheet" class="h-5 w-5"></i>
                        <span>Invoice</span>
                    </div>
                    <i data-lucide="chevron-down" class="h-4 w-4 transition-transform duration-200" 
                       :class="openSubmenus.invoice ? 'rotate-180' : ''"></i>
                </button>
                <div class="sidebar-submenu"
                     :style="openSubmenus.invoice ? 'max-height: 200px; opacity: 1' : 'max-height: 0; opacity: 0'">
                    <div class="py-1">
                        <a href="#" class="sidebar-submenu-item">
                            <span class="h-2 w-2 rounded-full bg-primary"></span>
                            <span>All Invoices</span>
                        </a>
                        <a href="#" class="sidebar-submenu-item">
                            <span class="h-2 w-2 rounded-full bg-success"></span>
                            <span>Create Invoice</span>
                        </a>
                    </div>
                </div>
            </div>

            <a href="{{ route('tables') }}" 
               class="sidebar-menu-item {{ request()->routeIs('tables') ? 'active' : '' }}">
                <i data-lucide="table-2" class="h-5 w-5"></i>
                <span>Tables</span>
            </a>
        </div>

        <div class="mt-8">
            <p class="sidebar-section-title mb-4">Support</p>
            <div class="space-y-1">
                <a href="{{ route('settings') }}" 
                   class="sidebar-menu-item {{ request()->routeIs('settings') ? 'active' : '' }}">
                    <i data-lucide="settings" class="h-5 w-5"></i>
                    <span>Settings</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- User Section -->
    <div class="sidebar-footer">
        <div class="flex items-center gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-secondary cursor-pointer">
            <img src="{{ auth()->user()->avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . auth()->user()->name }}" 
                 alt="User" class="h-10 w-10 rounded-full bg-secondary">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-sidebar-foreground truncate">{{ auth()->user()->name }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ auth()->user()->role ?? 'Admin' }}</p>
            </div>
            <form action="{{ route('logout') }}" method="POST" class="inline">
                @csrf
                <button type="submit">
                    <i data-lucide="log-out" class="h-4 w-4 text-muted-foreground"></i>
                </button>
            </form>
        </div>
    </div>
</aside>
```

---

## 📄 Langkah 5: Contoh Halaman Blade

Buat file `resources/views/dashboard.blade.php`:

```blade
@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
    <!-- Page Title -->
    <div class="mb-8">
        <h1 class="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p class="text-muted-foreground mt-1">Welcome back, {{ auth()->user()->name }}!</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <!-- Total Revenue -->
        <div class="card border-0 shadow-card">
            <div class="p-6">
                <div class="flex items-start justify-between">
                    <div class="space-y-3">
                        <p class="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <p class="text-3xl font-bold tracking-tight text-foreground">
                            Rp {{ number_format($totalRevenue ?? 84254000, 0, ',', '.') }}
                        </p>
                        <div class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-success/10 text-success">
                            <i data-lucide="trending-up" class="h-3 w-3"></i>
                            <span>+12.5%</span>
                        </div>
                    </div>
                    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <i data-lucide="dollar-sign" class="h-6 w-6 text-primary"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Tambahkan card lainnya... -->
    </div>

    <!-- Transactions Table dengan Livewire -->
    @livewire('recent-transactions')
@endsection
```

---

## 🔧 Langkah 6: Setup Routes

Edit file `routes/web.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TablesController;

Route::middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::get('/tables', [TablesController::class, 'index'])->name('tables');
});

// Auth routes (jika pakai Laravel Breeze/Jetstream)
require __DIR__.'/auth.php';
```

---

## 📦 Langkah 7: Install Dependencies (Opsional)

Jika ingin menggunakan Livewire untuk interaktivitas:

```bash
# Install Livewire
composer require livewire/livewire

# Atau install Alpine.js via NPM (jika tidak pakai CDN)
npm install alpinejs
```

---

## ✅ Checklist

- [ ] Copy `styles.css` ke `public/assets/css/`
- [ ] Buat layout utama `layouts/app.blade.php`
- [ ] Buat komponen `sidebar.blade.php` dan `header.blade.php`
- [ ] Konversi setiap halaman HTML ke Blade
- [ ] Setup routes di `routes/web.php`
- [ ] Test di browser

---

## 💡 Tips

1. **Untuk data dinamis**, ganti value statis dengan variabel Blade:
   ```blade
   {{ $totalRevenue }}
   {{ $user->name }}
   ```

2. **Untuk Livewire table**, buat komponen:
   ```bash
   php artisan make:livewire DataTable
   ```

3. **Untuk form dengan validasi**, gunakan Livewire atau form request Laravel

4. **Icons** akan otomatis terinisialisasi dengan script Lucide di layout
