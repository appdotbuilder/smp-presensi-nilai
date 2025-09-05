import { Head } from '@inertiajs/react';

interface Props {
    userRole: 'admin' | 'teacher';
    stats: {
        [key: string]: number;
    };
    recentStudents?: Array<{
        id: number;
        name: string;
        nis: string;
        school_class?: {
            name: string;
            grade: string;
        };
    }>;
    classesWithCapacity?: Array<{
        id: number;
        name: string;
        grade: string;
        students_count: number;
        max_students: number;
        capacity_percentage: number;
        homeroom_teacher?: string;
    }>;
    teacherSubjects?: Array<{
        id: number;
        subject: {
            name: string;
            code: string;
        };
        class: {
            name: string;
            grade: string;
        };
        students_count: number;
    }>;
    recentAttendances?: Array<{
        id: number;
        date: string;
        status: string;
        student: {
            name: string;
            nis: string;
        };
        subject: {
            name: string;
        };
    }>;
    todayAttendance?: {
        [key: string]: number;
    };
    academicYear: string;
    [key: string]: unknown;
}

export default function Dashboard({ 
    userRole, 
    stats, 
    recentStudents, 
    classesWithCapacity, 
    teacherSubjects,
    recentAttendances,
    todayAttendance,
    academicYear 
}: Props) {


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'hadir': return 'bg-green-100 text-green-800';
            case 'sakit': return 'bg-yellow-100 text-yellow-800';
            case 'izin': return 'bg-blue-100 text-blue-800';
            case 'alfa': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
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

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            📊 Dashboard {userRole === 'admin' ? 'Admin' : 'Guru'}
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                            Tahun Ajaran {academicYear}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(stats).map(([key, value]) => {
                            const getStatInfo = (key: string) => {
                                if (userRole === 'admin') {
                                    switch (key) {
                                        case 'total_students': return { icon: '👨‍🎓', label: 'Total Siswa', color: 'text-blue-600' };
                                        case 'total_teachers': return { icon: '👨‍🏫', label: 'Total Guru', color: 'text-green-600' };
                                        case 'total_subjects': return { icon: '📚', label: 'Mata Pelajaran', color: 'text-purple-600' };
                                        case 'total_classes': return { icon: '🏛️', label: 'Kelas Aktif', color: 'text-orange-600' };
                                        default: return { icon: '📊', label: key, color: 'text-gray-600' };
                                    }
                                } else {
                                    switch (key) {
                                        case 'assigned_classes': return { icon: '🏛️', label: 'Kelas Diampu', color: 'text-blue-600' };
                                        case 'total_students': return { icon: '👨‍🎓', label: 'Total Siswa', color: 'text-green-600' };
                                        case 'subjects_taught': return { icon: '📚', label: 'Mata Pelajaran', color: 'text-purple-600' };
                                        case 'today_attendances': return { icon: '📊', label: 'Presensi Hari Ini', color: 'text-orange-600' };
                                        default: return { icon: '📊', label: key, color: 'text-gray-600' };
                                    }
                                }
                            };

                            const { icon, label, color } = getStatInfo(key);

                            return (
                                <div key={key} className="rounded-xl bg-white p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-4">{icon}</div>
                                        <div>
                                            <p className={`text-3xl font-bold ${color} dark:text-white`}>{value}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Admin Specific Content */}
                        {userRole === 'admin' && (
                            <>
                                {/* Recent Students */}
                                {recentStudents && (
                                    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                            👨‍🎓 Siswa Terbaru
                                        </h3>
                                        <div className="space-y-3">
                                            {recentStudents.map((student) => (
                                                <div key={student.id} className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">NIS: {student.nis}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {student.school_class?.name || 'Belum ada kelas'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Kelas {student.school_class?.grade || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Class Capacity */}
                                {classesWithCapacity && (
                                    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                            🏛️ Kapasitas Kelas
                                        </h3>
                                        <div className="space-y-4">
                                            {classesWithCapacity.slice(0, 5).map((classItem) => (
                                                <div key={classItem.id} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">{classItem.name}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Wali Kelas: {classItem.homeroom_teacher || 'Belum ditentukan'}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {classItem.students_count}/{classItem.max_students}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                                                        <div 
                                                            className={`h-2 rounded-full ${
                                                                classItem.capacity_percentage >= 90 ? 'bg-red-500' : 
                                                                classItem.capacity_percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                            style={{ width: `${Math.min(classItem.capacity_percentage, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Teacher Specific Content */}
                        {userRole === 'teacher' && (
                            <>
                                {/* Teacher Subjects */}
                                {teacherSubjects && (
                                    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                            📚 Mata Pelajaran yang Diampu
                                        </h3>
                                        <div className="space-y-3">
                                            {teacherSubjects.map((ts) => (
                                                <div key={ts.id} className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{ts.subject.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Kode: {ts.subject.code}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {ts.class.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {ts.students_count} siswa
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent Attendances */}
                                {recentAttendances && (
                                    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                            📊 Presensi Terbaru (7 Hari Terakhir)
                                        </h3>
                                        <div className="space-y-3">
                                            {recentAttendances.slice(0, 8).map((attendance) => (
                                                <div key={attendance.id} className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{attendance.student.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {attendance.subject.name} - {new Date(attendance.date).toLocaleDateString('id-ID')}
                                                        </p>
                                                    </div>
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(attendance.status)}`}>
                                                        {getStatusLabel(attendance.status)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Today's Attendance Summary */}
                                {todayAttendance && Object.keys(todayAttendance).length > 0 && (
                                    <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                            📈 Ringkasan Presensi Hari Ini
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {Object.entries(todayAttendance).map(([status, count]) => (
                                                <div key={status} className="text-center">
                                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                                                        status === 'hadir' ? 'bg-green-100 text-green-600' :
                                                        status === 'sakit' ? 'bg-yellow-100 text-yellow-600' :
                                                        status === 'izin' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-red-100 text-red-600'
                                                    }`}>
                                                        <span className="text-xl font-bold">{count}</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {getStatusLabel(status)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}