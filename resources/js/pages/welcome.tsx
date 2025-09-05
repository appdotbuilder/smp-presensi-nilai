import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Props {
    stats?: {
        students: number;
        teachers: number;
        subjects: number;
        classes: number;
    };
    [key: string]: unknown;
}

export default function Welcome({ stats }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="SMP Presensi & Penilaian">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 dark:text-white">
                <header className="mb-8 w-full max-w-7xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                📊 Dashboard
                            </Link>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    🔐 Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    ✨ Daftar
                                </Link>
                            </div>
                        )}
                    </nav>
                </header>

                <div className="w-full max-w-7xl">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="mb-6">
                            <h1 className="text-5xl font-bold text-gray-900 mb-4 dark:text-white">
                                🏫 <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SMP Presensi & Penilaian</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto dark:text-gray-300">
                                Sistem manajemen sekolah modern untuk mengelola presensi dan penilaian siswa SMP dengan mudah dan efisien
                            </p>
                        </div>

                        {/* Stats Overview */}
                        {stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="text-3xl mb-2">👨‍🎓</div>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.students}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Siswa Aktif</div>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="text-3xl mb-2">👨‍🏫</div>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.teachers}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Guru</div>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="text-3xl mb-2">📚</div>
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.subjects}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Mata Pelajaran</div>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="text-3xl mb-2">🏛️</div>
                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.classes}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Kelas</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Manajemen Pengguna</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Sistem otentikasi untuk Guru dan Admin dengan peran yang jelas dan terorganisir
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Presensi Digital</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Catat kehadiran siswa dengan status Hadir, Sakit, Izin, dan Alfa secara real-time
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Penilaian Komprehensif</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Input nilai harian, UTS, dan UAS dengan skala 0-100 untuk setiap mata pelajaran
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <div className="text-4xl mb-4">🏛️</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Manajemen Kelas</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Kelola kelas 7, 8, dan 9 dengan sistem wali kelas dan kapasitas siswa
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <div className="text-4xl mb-4">📄</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Laporan PDF</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Generate laporan presensi dan nilai dalam format PDF untuk dokumentasi
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <div className="text-4xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Mata Pelajaran</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Manajemen mata pelajaran dengan kode unik dan assignment ke guru dan kelas
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4">Siap untuk memulai?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Bergabunglah dengan sistem manajemen sekolah modern untuk kemudahan administrasi
                        </p>
                        <div className="flex gap-4 justify-center">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                >
                                    📊 Buka Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                    >
                                        ✨ Daftar Sekarang
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:-translate-y-1"
                                    >
                                        🔐 Masuk
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400">
                            Sistem Informasi Manajemen SMP - Presensi & Penilaian
                        </p>
                        <p className="text-sm text-gray-500 mt-2 dark:text-gray-500">
                            Dibuat dengan ❤️ menggunakan Laravel & React
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}