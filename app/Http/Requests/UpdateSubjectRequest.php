<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubjectRequest extends FormRequest
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
                Rule::unique('subjects', 'name')->ignore($this->subject->id)
            ],
            'code' => [
                'required',
                'string',
                'max:10',
                Rule::unique('subjects', 'code')->ignore($this->subject->id)
            ],
            'description' => 'nullable|string|max:1000',
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
            'name.required' => 'Nama mata pelajaran harus diisi.',
            'name.string' => 'Nama mata pelajaran harus berupa teks.',
            'name.max' => 'Nama mata pelajaran maksimal 255 karakter.',
            'name.unique' => 'Nama mata pelajaran sudah digunakan.',
            'code.required' => 'Kode mata pelajaran harus diisi.',
            'code.string' => 'Kode mata pelajaran harus berupa teks.',
            'code.max' => 'Kode mata pelajaran maksimal 10 karakter.',
            'code.unique' => 'Kode mata pelajaran sudah digunakan.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 1000 karakter.',
            'is_active.boolean' => 'Status aktif harus berupa true atau false.',
        ];
    }
}