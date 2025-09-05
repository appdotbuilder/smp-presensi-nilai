import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Student {
    id: number;
    name: string;
    nis: string;
    hasAttendance?: boolean;
}

interface TeacherSubject {
    id: number;
    subject_id: number;
    class_id: number;
    subject: {
        id: number;
        name: string;
        code: string;
    };
    class: {
        id: number;
        name: string;
        grade: string;
    };
}

interface Props {
    teacherSubjects: TeacherSubject[];
    selectedSubject?: {
        id: number;
        name: string;
        code: string;
    };
    selectedClass?: {
        id: number;
        name: string;
        grade: string;
    };
    students: Student[];
    date: string;
    filters: {
        subject_id?: number;
        class_id?: number;
        semester?: string;
        grade_type?: string;
    };
    [key: string]: unknown;
}

interface AttendanceFormData {
    subject_id: number;
    date: string;
    attendances: Array<{
        student_id: number;
        status: string;
        notes?: string;
    }>;
    [key: string]: string | number | Array<{
        student_id: number;
        status: string;
        notes?: string;
    }>;
}

export default function AttendanceCreate({ 
    teacherSubjects, 
    selectedSubject, 
    selectedClass, 
    students, 
    date,
    filters 
}: Props) {
    const [selectedSubjectId, setSelectedSubjectId] = useState<number>(filters.subject_id || 0);
    const [selectedClassId, setSelectedClassId] = useState<number>(filters.class_id || 0);
    const [attendanceDate, setAttendanceDate] = useState<string>(date);

    const { data, setData, post, processing, errors, reset } = useForm<AttendanceFormData>({
        subject_id: selectedSubject?.id || 0,
        date: date,
        attendances: students.map(student => ({
            student_id: student.id,
            status: 'hadir',
            notes: ''
        }))
    });

    useEffect(() => {
        if (selectedSubject && selectedClass) {
            setData(prevData => ({
                ...prevData,
                subject_id: selectedSubject.id,
                attendances: students.map(student => ({
                    student_id: student.id,
                    status: 'hadir',
                    notes: ''
                }))
            }));
        }
    }, [selectedSubject, selectedClass, students, setData]);

    const handleSubjectChange = (subjectId: number, classId: number) => {
        const params = {
            subject_id: subjectId,
            class_id: classId,
            date: attendanceDate
        };

        router.get(route('attendances.create'), params, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDateChange = (newDate: string) => {
        setAttendanceDate(newDate);
        
        if (selectedSubjectId && selectedClassId) {
            const params = {
                subject_id: selectedSubjectId,
                class_id: selectedClassId,
                date: newDate
            };

            router.get(route('attendances.create'), params, {
                preserveState: true,
                preserveScroll: true
            });
        }
    };

    const handleAttendanceChange = (studentId: number, field: 'status' | 'notes', value: string) => {
        setData('attendances', data.attendances.map(attendance => 
            attendance.student_id === studentId 
                ? { ...attendance, [field]: value }
                : attendance
        ));
    };

    const handleBulkStatusChange = (status: string) => {
        setData('attendances', data.attendances.map(attendance => ({
            ...attendance,
            status: status
        })));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedSubject) {
            alert('Pilih mata pelajaran dan kelas terlebih dahulu');
            return;
        }

        post(route('attendances.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'hadir': return 'bg-green-100 text-green-800 border-green-200';
            case 'sakit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'izin': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'alfa': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout>
            <Head title="Input Presensi" />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            ➕ Input Presensi
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Input data kehadiran siswa per mata pelajaran
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>📋 Pilih Mata Pelajaran & Kelas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label htmlFor="subject_class">Mata Pelajaran & Kelas</Label>
                                        <select 
                                            id="subject_class"
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            value={selectedSubjectId && selectedClassId ? `${selectedSubjectId}_${selectedClassId}` : ''}
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    const [subjectId, classId] = e.target.value.split('_').map(Number);
                                                    setSelectedSubjectId(subjectId);
                                                    setSelectedClassId(classId);
                                                    handleSubjectChange(subjectId, classId);
                                                }
                                            }}
                                            required
                                        >
                                            <option value="">Pilih Mata Pelajaran & Kelas</option>
                                            {teacherSubjects.map((ts) => (
                                                <option key={`${ts.subject_id}_${ts.class_id}`} value={`${ts.subject_id}_${ts.class_id}`}>
                                                    {ts.subject.code} - {ts.subject.name} | Kelas {ts.class.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.subject_id && <p className="mt-1 text-sm text-red-600">{errors.subject_id}</p>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="date">Tanggal</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={attendanceDate}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            required
                                        />
                                        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                                    </div>

                                    <div className="flex items-end">
                                        {selectedSubject && selectedClass && (
                                            <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
                                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                    📚 {selectedSubject.name}
                                                </p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                                    🏛️ Kelas {selectedClass.name} ({students.length} siswa)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attendance Form */}
                        {selectedSubject && selectedClass && students.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>👨‍🎓 Daftar Kehadiran Siswa</span>
                                        <div className="flex gap-2">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleBulkStatusChange('hadir')}
                                                className="text-green-600 border-green-300 hover:bg-green-50"
                                            >
                                                ✓ Semua Hadir
                                            </Button>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleBulkStatusChange('alfa')}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                ✗ Semua Alfa
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {students.map((student, index) => {
                                            const attendance = data.attendances.find(a => a.student_id === student.id);
                                            
                                            return (
                                                <div key={student.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm text-gray-500 min-w-[2rem]">
                                                                {(index + 1).toString().padStart(2, '0')}
                                                            </span>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">
                                                                    {student.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    NIS: {student.nis}
                                                                </p>
                                                                {student.hasAttendance && (
                                                                    <Badge variant="secondary" className="text-xs mt-1">
                                                                        ⚠️ Sudah ada presensi hari ini
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        {['hadir', 'sakit', 'izin', 'alfa'].map((status) => (
                                                            <label
                                                                key={status}
                                                                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                                                                    attendance?.status === status
                                                                        ? getStatusColor(status)
                                                                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`attendance_${student.id}`}
                                                                    value={status}
                                                                    checked={attendance?.status === status}
                                                                    onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                                                                    className="sr-only"
                                                                />
                                                                <span className="text-sm font-medium capitalize">
                                                                    {status === 'hadir' && '✓'} 
                                                                    {status === 'sakit' && '🤒'} 
                                                                    {status === 'izin' && '📝'} 
                                                                    {status === 'alfa' && '✗'} 
                                                                    {status}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="w-48">
                                                        <Input
                                                            type="text"
                                                            placeholder="Catatan (opsional)"
                                                            value={attendance?.notes || ''}
                                                            onChange={(e) => handleAttendanceChange(student.id, 'notes', e.target.value)}
                                                            className="text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {errors.attendances && (
                                        <p className="mt-4 text-sm text-red-600">{errors.attendances}</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Submit Button */}
                        {selectedSubject && selectedClass && students.length > 0 && (
                            <div className="flex justify-end gap-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => router.get(route('attendances.index'))}
                                >
                                    ❌ Batal
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {processing ? '⏳ Menyimpan...' : '💾 Simpan Presensi'}
                                </Button>
                            </div>
                        )}
                        
                        {selectedSubject && selectedClass && students.length === 0 && (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <div className="text-6xl mb-4">👨‍🎓</div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Tidak ada siswa di kelas ini
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Pastikan kelas yang dipilih memiliki siswa yang aktif.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}