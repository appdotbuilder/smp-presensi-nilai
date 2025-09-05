<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
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
            'date' => 'required|date',
            'attendances' => 'required|array|min:1',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:hadir,sakit,izin,alfa',
            'attendances.*.notes' => 'nullable|string|max:500',
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
            'date.required' => 'Tanggal presensi harus diisi.',
            'date.date' => 'Format tanggal tidak valid.',
            'attendances.required' => 'Data presensi siswa harus diisi.',
            'attendances.*.student_id.required' => 'ID siswa harus diisi.',
            'attendances.*.student_id.exists' => 'Data siswa tidak valid.',
            'attendances.*.status.required' => 'Status presensi harus dipilih.',
            'attendances.*.status.in' => 'Status presensi harus salah satu dari: Hadir, Sakit, Izin, Alfa.',
            'attendances.*.notes.max' => 'Catatan maksimal 500 karakter.',
        ];
    }
}