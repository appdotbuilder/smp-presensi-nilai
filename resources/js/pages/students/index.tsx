import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    nis: string;
    gender: 'L' | 'P';
    is_active: boolean;
    school_class?: {
        name: string;
        grade: string;
    };
    created_at: string;
}

interface SchoolClass {
    id: number;
    name: string;
    grade: string;
}

interface PaginatedStudents {
    data: Student[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    students: PaginatedStudents;
    classes: SchoolClass[];
    filters: {
        search?: string;
        class_id?: string;
        filter?: string;
    };
    [key: string]: unknown;
}

export default function StudentsIndex({ students, classes, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [classFilter, setClassFilter] = useState(filters.class_id || '');
    const [statusFilter, setStatusFilter] = useState(filters.filter || '');

    const handleFilter = () => {
        router.get(route('students.index'), {
            search: search || undefined,
            class_id: classFilter || undefined,
            filter: statusFilter || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setClassFilter('');
        setStatusFilter('');
        router.get(route('students.index'));
    };

    return (
        <>
            <Head title="Data Siswa" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                👨‍🎓 Data Siswa
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Kelola data siswa SMP
                            </p>
                        </div>
                        <Link
                            href={route('students.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            ➕ Tambah Siswa
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Cari Nama/NIS
                                </label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Masukkan nama atau NIS..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Kelas
                                </label>
                                <select
                                    value={classFilter}
                                    onChange={(e) => setClassFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">Semua Kelas</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} (Kelas {cls.grade})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Tidak Aktif</option>
                                </select>
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={handleFilter}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    🔍 Filter
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    🔄 Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            Siswa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            NIS
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            Gender
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {students.data.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                                                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                                {student.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {student.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            Terdaftar: {new Date(student.created_at).toLocaleDateString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {student.nis}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {student.school_class ? (
                                                    <>
                                                        <div className="font-medium">{student.school_class.name}</div>
                                                        <div className="text-gray-500 dark:text-gray-400">
                                                            Kelas {student.school_class.grade}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500 dark:text-gray-400">Belum ada kelas</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    student.gender === 'L' 
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                                        : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                                                }`}>
                                                    {student.gender === 'L' ? '👦 Laki-laki' : '👧 Perempuan'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    student.is_active 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                    {student.is_active ? '✅ Aktif' : '❌ Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('students.show', student.id)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        👁️ Lihat
                                                    </Link>
                                                    <Link
                                                        href={route('students.edit', student.id)}
                                                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                    >
                                                        ✏️ Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {students.data.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">👥</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Tidak ada siswa ditemukan
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {Object.values(filters).some(Boolean) 
                                        ? 'Coba ubah kriteria pencarian Anda'
                                        : 'Mulai dengan menambahkan siswa baru'
                                    }
                                </p>
                                <Link
                                    href={route('students.create')}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
                                >
                                    ➕ Tambah Siswa Baru
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {students.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Menampilkan {((students.current_page - 1) * students.per_page) + 1} hingga{' '}
                                {Math.min(students.current_page * students.per_page, students.total)} dari{' '}
                                {students.total} siswa
                            </div>
                            <div className="flex gap-1">
                                {students.links.map((link, index) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={index}
                                                className="px-3 py-2 text-sm text-gray-400 dark:text-gray-600"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveState
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}