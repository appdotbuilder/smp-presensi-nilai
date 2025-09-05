<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('nis')->unique()->comment('Nomor Induk Siswa');
            $table->string('name');
            $table->enum('gender', ['L', 'P'])->comment('L = Laki-laki, P = Perempuan');
            $table->date('birth_date');
            $table->string('birth_place');
            $table->text('address');
            $table->string('phone')->nullable();
            $table->string('parent_name');
            $table->string('parent_phone');
            $table->foreignId('class_id')->nullable()->constrained('classes')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('nis');
            $table->index('name');
            $table->index('class_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};