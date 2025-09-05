<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Subject;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\TeacherSubject;
use App\Models\Attendance;
use App\Models\Grade;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default admin
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@smp.sch.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'nip' => 'ADM001',
            'address' => 'Jl. Pendidikan No. 1, Jakarta',
            'phone' => '021-1234567',
            'email_verified_at' => now(),
        ]);

        // Create sample teachers
        $teachers = [];
        $teacherData = [
            ['name' => 'Siti Nurhaliza, S.Pd', 'email' => 'siti@smp.sch.id', 'nip' => 'GUR001'],
            ['name' => 'Ahmad Suryanto, S.Si', 'email' => 'ahmad@smp.sch.id', 'nip' => 'GUR002'],
            ['name' => 'Dewi Sartika, S.Pd', 'email' => 'dewi@smp.sch.id', 'nip' => 'GUR003'],
            ['name' => 'Budi Santoso, S.Pd', 'email' => 'budi@smp.sch.id', 'nip' => 'GUR004'],
            ['name' => 'Rini Wijayanti, S.Ag', 'email' => 'rini@smp.sch.id', 'nip' => 'GUR005'],
            ['name' => 'Dony Prasetyo, S.Pd', 'email' => 'dony@smp.sch.id', 'nip' => 'GUR006'],
        ];

        foreach ($teacherData as $data) {
            $teachers[] = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'guru',
                'nip' => $data['nip'],
                'address' => 'Jl. Guru No. ' . random_int(1, 100),
                'phone' => '08' . random_int(1000000000, 9999999999),
                'email_verified_at' => now(),
            ]);
        }

        // Create subjects
        $subjectData = [
            ['name' => 'Matematika', 'code' => 'MAT', 'description' => 'Mata pelajaran matematika untuk SMP'],
            ['name' => 'Bahasa Indonesia', 'code' => 'IND', 'description' => 'Mata pelajaran bahasa Indonesia'],
            ['name' => 'Bahasa Inggris', 'code' => 'ING', 'description' => 'Mata pelajaran bahasa Inggris'],
            ['name' => 'IPA (Ilmu Pengetahuan Alam)', 'code' => 'IPA', 'description' => 'Mata pelajaran IPA'],
            ['name' => 'IPS (Ilmu Pengetahuan Sosial)', 'code' => 'IPS', 'description' => 'Mata pelajaran IPS'],
            ['name' => 'Pendidikan Agama Islam', 'code' => 'PAI', 'description' => 'Mata pelajaran agama Islam'],
            ['name' => 'Pendidikan Pancasila', 'code' => 'PKN', 'description' => 'Mata pelajaran Pancasila'],
            ['name' => 'Seni Budaya', 'code' => 'SBK', 'description' => 'Mata pelajaran seni budaya'],
            ['name' => 'Pendidikan Jasmani', 'code' => 'PJK', 'description' => 'Mata pelajaran olahraga'],
            ['name' => 'Prakarya', 'code' => 'PKY', 'description' => 'Mata pelajaran prakarya'],
        ];

        $subjects = [];
        foreach ($subjectData as $data) {
            $subjects[] = Subject::create($data);
        }

        // Create classes
        $classes = [];
        $currentYear = date('Y');
        $academicYear = $currentYear . '/' . ($currentYear + 1);
        
        foreach (['7', '8', '9'] as $grade) {
            foreach (['A', 'B', 'C'] as $section) {
                $classes[] = SchoolClass::create([
                    'name' => $grade . $section,
                    'grade' => $grade,
                    'academic_year' => $academicYear,
                    'homeroom_teacher_id' => $teachers[array_rand($teachers)]->id,
                    'max_students' => 30,
                ]);
            }
        }

        // Create students
        $students = [];
        foreach ($classes as $class) {
            for ($i = 1; $i <= random_int(25, 30); $i++) {
                $gender = random_int(0, 1) ? 'L' : 'P';
                $students[] = Student::create([
                    'nis' => $currentYear . str_pad((string)($class->id * 100 + $i), 4, '0', STR_PAD_LEFT),
                    'name' => fake('id_ID')->name,
                    'gender' => $gender,
                    'birth_date' => fake()->dateTimeBetween('-16 years', '-12 years')->format('Y-m-d'),
                    'birth_place' => fake('id_ID')->city,
                    'address' => fake('id_ID')->address,
                    'phone' => fake()->optional()->phoneNumber,
                    'parent_name' => fake('id_ID')->name,
                    'parent_phone' => '08' . random_int(1000000000, 9999999999),
                    'class_id' => $class->id,
                ]);
            }
        }

        // Assign teachers to subjects and classes
        $teacherSubjects = [];
        foreach ($classes as $class) {
            foreach ($subjects as $subject) {
                $teacher = $teachers[array_rand($teachers)];
                
                try {
                    $teacherSubjects[] = TeacherSubject::create([
                        'teacher_id' => $teacher->id,
                        'subject_id' => $subject->id,
                        'class_id' => $class->id,
                        'academic_year' => $academicYear,
                    ]);
                } catch (\Exception $e) {
                    // Skip if duplicate combination
                    continue;
                }
            }
        }

        // Create sample attendance data (last 30 days)
        $attendances = [];
        foreach ($students as $student) {
            $classSubjects = TeacherSubject::where('class_id', $student->class_id)->get();
            
            for ($i = 0; $i < 30; $i++) {
                $date = now()->subDays($i)->format('Y-m-d');
                
                // Skip weekends
                if (date('N', strtotime($date)) >= 6) continue;
                
                foreach ($classSubjects->take(3) as $ts) { // 3 subjects per day
                    $status = fake()->randomElement(['hadir', 'hadir', 'hadir', 'hadir', 'sakit', 'izin', 'alfa']);
                    
                    try {
                        $attendances[] = Attendance::create([
                            'student_id' => $student->id,
                            'subject_id' => $ts->subject_id,
                            'teacher_id' => $ts->teacher_id,
                            'date' => $date,
                            'status' => $status,
                            'notes' => $status !== 'hadir' ? fake()->optional()->sentence() : null,
                        ]);
                    } catch (\Exception $e) {
                        // Skip if duplicate
                        continue;
                    }
                }
            }
        }

        // Create sample grades
        foreach ($students as $student) {
            $classSubjects = TeacherSubject::where('class_id', $student->class_id)->get();
            
            foreach ($classSubjects as $ts) {
                // Daily grades (3-5 per subject)
                for ($i = 0; $i < random_int(3, 5); $i++) {
                    Grade::create([
                        'student_id' => $student->id,
                        'subject_id' => $ts->subject_id,
                        'teacher_id' => $ts->teacher_id,
                        'semester' => '1',
                        'academic_year' => $academicYear,
                        'grade_type' => 'harian',
                        'score' => fake()->numberBetween(65, 95),
                        'notes' => fake()->optional(0.2)->sentence(),
                    ]);
                }
                
                // UTS grade
                Grade::create([
                    'student_id' => $student->id,
                    'subject_id' => $ts->subject_id,
                    'teacher_id' => $ts->teacher_id,
                    'semester' => '1',
                    'academic_year' => $academicYear,
                    'grade_type' => 'uts',
                    'score' => fake()->numberBetween(60, 90),
                    'notes' => 'Nilai Ujian Tengah Semester',
                ]);
                
                // UAS grade (optional, not all completed yet)
                if (fake()->boolean(30)) {
                    Grade::create([
                        'student_id' => $student->id,
                        'subject_id' => $ts->subject_id,
                        'teacher_id' => $ts->teacher_id,
                        'semester' => '1',
                        'academic_year' => $academicYear,
                        'grade_type' => 'uas',
                        'score' => fake()->numberBetween(65, 95),
                        'notes' => 'Nilai Ujian Akhir Semester',
                    ]);
                }
            }
        }

        $this->command->info('School data seeded successfully!');
        $this->command->info('Admin login: admin@smp.sch.id / password');
        $this->command->info('Teacher login: siti@smp.sch.id / password (or any other teacher)');
    }
}