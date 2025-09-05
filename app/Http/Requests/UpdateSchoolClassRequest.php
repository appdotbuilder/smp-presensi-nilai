<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSchoolClassRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('classes', 'name')->ignore($this->class->id)
            ],
            'grade' => 'required|in:7,8,9',
            'homeroom_teacher_id' => 'nullable|exists:users,id',
            'max_students' => 'required|integer|min:1|max:50',
            'academic_year' => 'required|string|regex:/^\d{4}\/\d{4}$/',
            'is_active' => 'boolean',
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
            'name.required' => 'Nama kelas harus diisi.',
            'name.string' => 'Nama kelas harus berupa teks.',
            'name.max' => 'Nama kelas maksimal 255 karakter.',
            'name.unique' => 'Nama kelas sudah digunakan.',
            'grade.required' => 'Tingkatan kelas harus dipilih.',
            'grade.in' => 'Tingkatan kelas harus 7, 8, atau 9.',
            'homeroom_teacher_id.exists' => 'Wali kelas tidak valid.',
            'max_students.required' => 'Kapasitas maksimal siswa harus diisi.',
            'max_students.integer' => 'Kapasitas maksimal siswa harus berupa angka.',
            'max_students.min' => 'Kapasitas maksimal siswa minimal 1.',
            'max_students.max' => 'Kapasitas maksimal siswa maksimal 50.',
            'academic_year.required' => 'Tahun ajaran harus diisi.',
            'academic_year.regex' => 'Format tahun ajaran tidak valid (contoh: 2024/2025).',
            'is_active.boolean' => 'Status aktif harus berupa true atau false.',
        ];
    }
}