import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Attendance {
    id: number;
    date: string;
    status: string;
    notes?: string;
    student: {
        id: number;
        name: string;
        nis: string;
        school_class?: {
            name: string;
            grade: string;
        };
    };
    subject: {
        id: number;
        name: string;
        code: string;
    };
    teacher: {
        id: number;
        name: string;
    };
}

interface Subject {
    id: number;
    name: string;
    code: string;
}

interface Props {
    attendances: {
        data: Attendance[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    subjects: Subject[];
    filters: {
        subject_id?: number;
        class_id?: number;
        date?: string;
        status?: string;
    };
    [key: string]: unknown;
}

export default function AttendanceIndex({ attendances, subjects, filters }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string; id: number } } }>().props;
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'hadir': return 'bg-green-100 text-green-800 border-green-200';
            case 'sakit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'izin': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'alfa': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'hadir': return 'Hadir';
            case 'sakit': return 'Sakit';
            case 'izin': return 'Izin';
            case 'alfa': return 'Alfa';
            default: return status;
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value || undefined };
        
        // Remove empty values
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k as keyof typeof newFilters]) delete (newFilters as Record<string, unknown>)[k];
        });

        router.get(route('attendances.index'), newFilters, { 
            preserveState: true,
            preserveScroll: true 
        });
    };

    return (
        <AppLayout>
            <Head title="Data Presensi" />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                📊 Data Presensi
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Kelola data kehadiran siswa per mata pelajaran
                            </p>
                        </div>
                        
                        {(auth.user.role === 'guru' || auth.user.role === 'admin') && (
                            <Link href={route('attendances.create')}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    ➕ Input Presensi
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">🔍 Filter & Pencarian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Mata Pelajaran
                                    </label>
                                    <select 
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        value={filters.subject_id || ''}
                                        onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                                    >
                                        <option value="">Semua Mata Pelajaran</option>
                                        {subjects.map((subject) => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.code} - {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tanggal
                                    </label>
                                    <Input
                                        type="date"
                                        value={filters.date || ''}
                                        onChange={(e) => handleFilterChange('date', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select 
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        value={filters.status || ''}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="hadir">Hadir</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="izin">Izin</option>
                                        <option value="alfa">Alfa</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-end">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => router.get(route('attendances.index'))}
                                        className="w-full"
                                    >
                                        🔄 Reset Filter
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>📝 Daftar Presensi</span>
                                <span className="text-sm font-normal text-gray-500">
                                    Total: {attendances.total} record
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {attendances.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Siswa
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Mata Pelajaran
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Tanggal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Guru
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                            {attendances.data.map((attendance) => (
                                                <tr key={attendance.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {attendance.student.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                NIS: {attendance.student.nis}
                                                            </div>
                                                            {attendance.student.school_class && (
                                                                <div className="text-xs text-gray-400">
                                                                    Kelas {attendance.student.school_class.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {attendance.subject.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {attendance.subject.code}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {new Date(attendance.date).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge className={getStatusColor(attendance.status)}>
                                                            {getStatusLabel(attendance.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {attendance.teacher.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <Link 
                                                                href={route('attendances.show', attendance.id)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                👁️ Lihat
                                                            </Link>
                                                            {(auth.user.role === 'admin' || attendance.teacher.id === auth.user.id) && (
                                                                <Link 
                                                                    href={route('attendances.edit', attendance.id)}
                                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                                >
                                                                    ✏️ Edit
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📊</div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Belum ada data presensi
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Mulai input presensi siswa untuk melihat data di sini.
                                    </p>
                                    {(auth.user.role === 'guru' || auth.user.role === 'admin') && (
                                        <Link href={route('attendances.create')}>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                ➕ Input Presensi Pertama
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {attendances.data.length > 0 && attendances.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Menampilkan {((attendances.current_page - 1) * attendances.per_page) + 1} sampai{' '}
                                {Math.min(attendances.current_page * attendances.per_page, attendances.total)} dari{' '}
                                {attendances.total} hasil
                            </div>
                            
                            <div className="flex gap-2">
                                {attendances.links.map((link, index) => {
                                    if (!link.url) {
                                        return (
                                            <span 
                                                key={index}
                                                className="px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            className={`px-3 py-2 text-sm border rounded-md ${
                                                link.active 
                                                    ? 'bg-blue-600 text-white border-blue-600' 
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
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
        </AppLayout>
    );
}