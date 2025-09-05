<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\TeacherSubject
 *
 * @property int $id
 * @property int $teacher_id
 * @property int $subject_id
 * @property int $class_id
 * @property string $academic_year
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $teacher
 * @property-read \App\Models\Subject $subject
 * @property-read \App\Models\SchoolClass $schoolClass
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject query()
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereTeacherId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereSubjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereClassId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereAcademicYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherSubject whereUpdatedAt($value)
 * @method static \Database\Factories\TeacherSubjectFactory factory($count = null, $state = [])
 * @method static TeacherSubject create(array $attributes = [])
 * @method static TeacherSubject firstOrCreate(array $attributes = [], array $values = [])
 * 
 * @mixin \Eloquent
 */
class TeacherSubject extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'teacher_id',
        'subject_id',
        'class_id',
        'academic_year',
    ];

    /**
     * Get the teacher for this assignment.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the subject for this assignment.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the class for this assignment.
     */
    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }
}