import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Grade {
    id: number;
    semester: string;
    academic_year: string;
    grade_type: string;
    score: number;
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
    grades: {
        data: Grade[];
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
        semester?: string;
        academic_year?: string;
        grade_type?: string;
    };
    [key: string]: unknown;
}

export default function GradeIndex({ grades, subjects, filters }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string; id: number } } }>().props;
    
    const getGradeColor = (score: number) => {
        if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
        if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    const getLetterGrade = (score: number) => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'E';
    };

    const getGradeTypeLabel = (type: string) => {
        switch (type) {
            case 'harian': return 'Harian';
            case 'uts': return 'UTS';
            case 'uas': return 'UAS';
            default: return type;
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value || undefined };
        
        // Remove empty values
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k as keyof typeof newFilters]) delete (newFilters as Record<string, unknown>)[k];
        });

        router.get(route('grades.index'), newFilters, { 
            preserveState: true,
            preserveScroll: true 
        });
    };

    return (
        <AppLayout>
            <Head title="Data Nilai" />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                📝 Data Nilai
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Kelola nilai siswa untuk setiap mata pelajaran
                            </p>
                        </div>
                        
                        {(auth.user.role === 'guru' || auth.user.role === 'admin') && (
                            <Link href={route('grades.create')}>
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                    ➕ Input Nilai
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
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                                        Semester
                                    </label>
                                    <select 
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        value={filters.semester || ''}
                                        onChange={(e) => handleFilterChange('semester', e.target.value)}
                                    >
                                        <option value="">Semua Semester</option>
                                        <option value="ganjil">Ganjil</option>
                                        <option value="genap">Genap</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Jenis Nilai
                                    </label>
                                    <select 
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        value={filters.grade_type || ''}
                                        onChange={(e) => handleFilterChange('grade_type', e.target.value)}
                                    >
                                        <option value="">Semua Jenis</option>
                                        <option value="harian">Harian</option>
                                        <option value="uts">UTS</option>
                                        <option value="uas">UAS</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tahun Ajaran
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="2024/2025"
                                        value={filters.academic_year || ''}
                                        onChange={(e) => handleFilterChange('academic_year', e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex items-end">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => router.get(route('grades.index'))}
                                        className="w-full"
                                    >
                                        🔄 Reset Filter
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Grades List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>📊 Daftar Nilai</span>
                                <span className="text-sm font-normal text-gray-500">
                                    Total: {grades.total} record
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {grades.data.length > 0 ? (
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
                                                    Jenis / Semester
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                    Nilai
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
                                            {grades.data.map((grade) => (
                                                <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {grade.student.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                NIS: {grade.student.nis}
                                                            </div>
                                                            {grade.student.school_class && (
                                                                <div className="text-xs text-gray-400">
                                                                    Kelas {grade.student.school_class.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {grade.subject.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {grade.subject.code}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <Badge variant="outline" className="mb-1">
                                                                {getGradeTypeLabel(grade.grade_type)}
                                                            </Badge>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                Semester {grade.semester === 'ganjil' ? 'Ganjil' : 'Genap'}
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                {grade.academic_year}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={getGradeColor(grade.score)}>
                                                                {grade.score}
                                                            </Badge>
                                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                ({getLetterGrade(grade.score)})
                                                            </span>
                                                        </div>
                                                        {grade.score < 60 && (
                                                            <div className="text-xs text-red-500 mt-1">
                                                                ⚠️ Tidak Lulus
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {grade.teacher.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <Link 
                                                                href={route('grades.show', grade.id)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                👁️ Lihat
                                                            </Link>
                                                            {(auth.user.role === 'admin' || grade.teacher.id === auth.user.id) && (
                                                                <Link 
                                                                    href={route('grades.edit', grade.id)}
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
                                    <div className="text-6xl mb-4">📝</div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Belum ada data nilai
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Mulai input nilai siswa untuk melihat data di sini.
                                    </p>
                                    {(auth.user.role === 'guru' || auth.user.role === 'admin') && (
                                        <Link href={route('grades.create')}>
                                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                                                ➕ Input Nilai Pertama
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {grades.data.length > 0 && grades.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Menampilkan {((grades.current_page - 1) * grades.per_page) + 1} sampai{' '}
                                {Math.min(grades.current_page * grades.per_page, grades.total)} dari{' '}
                                {grades.total} hasil
                            </div>
                            
                            <div className="flex gap-2">
                                {grades.links.map((link, index) => {
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