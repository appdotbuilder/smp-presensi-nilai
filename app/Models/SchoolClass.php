<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\SchoolClass
 *
 * @property int $id
 * @property string $name
 * @property string $grade
 * @property string $academic_year
 * @property int|null $homeroom_teacher_id
 * @property int $max_students
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $homeroomTeacher
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Student[] $students
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\TeacherSubject[] $teacherSubjects
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass query()
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereAcademicYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereHomeroomTeacherId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereMaxStudents($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass active()
 * @method static \Database\Factories\SchoolClassFactory factory($count = null, $state = [])
 * @method static SchoolClass create(array $attributes = [])
 * @method static SchoolClass firstOrCreate(array $attributes = [], array $values = [])
 * 
 * @mixin \Eloquent
 */
class SchoolClass extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'classes';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'grade',
        'academic_year',
        'homeroom_teacher_id',
        'max_students',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'max_students' => 'integer',
    ];

    /**
     * Get the homeroom teacher for this class.
     */
    public function homeroomTeacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'homeroom_teacher_id');
    }

    /**
     * Get students in this class.
     */
    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    /**
     * Get teacher subject assignments for this class.
     */
    public function teacherSubjects(): HasMany
    {
        return $this->hasMany(TeacherSubject::class, 'class_id');
    }

    /**
     * Scope active classes.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the number of enrolled students.
     */
    public function getStudentCountAttribute(): int
    {
        return $this->students()->where('is_active', true)->count();
    }

    /**
     * Check if class has available slots.
     */
    public function hasAvailableSlots(): bool
    {
        return $this->student_count < $this->max_students;
    }
}