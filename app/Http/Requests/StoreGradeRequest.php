<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->isTeacher() || auth()->user()->isAdmin());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subject_id' => 'required|exists:subjects,id',
            'semester' => 'required|in:ganjil,genap',
            'academic_year' => 'required|string|regex:/^\d{4}\/\d{4}$/',
            'grade_type' => 'required|in:harian,uts,uas',
            'grades' => 'required|array|min:1',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.score' => 'required|numeric|min:0|max:100',
            'grades.*.notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'subject_id.required' => 'Mata pelajaran harus dipilih.',
            'subject_id.exists' => 'Mata pelajaran tidak valid.',
            'semester.required' => 'Semester harus dipilih.',
            'semester.in' => 'Semester harus Ganjil atau Genap.',
            'academic_year.required' => 'Tahun ajaran harus diisi.',
            'academic_year.regex' => 'Format tahun ajaran tidak valid (contoh: 2024/2025).',
            'grade_type.required' => 'Jenis nilai harus dipilih.',
            'grade_type.in' => 'Jenis nilai harus salah satu dari: Harian, UTS, UAS.',
            'grades.required' => 'Data nilai siswa harus diisi.',
            'grades.*.student_id.required' => 'ID siswa harus diisi.',
            'grades.*.student_id.exists' => 'Data siswa tidak valid.',
            'grades.*.score.required' => 'Nilai harus diisi.',
            'grades.*.score.numeric' => 'Nilai harus berupa angka.',
            'grades.*.score.min' => 'Nilai minimal adalah 0.',
            'grades.*.score.max' => 'Nilai maksimal adalah 100.',
            'grades.*.notes.max' => 'Catatan maksimal 500 karakter.',
        ];
    }
}