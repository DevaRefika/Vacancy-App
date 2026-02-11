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
    Schema::create('vacancies', function (Blueprint $table) {
        $table->id();
        $table->string('judul');
        $table->string('posisi');
        $table->enum('tipe_pekerjaan', ['full time', 'part time', 'kontrak', 'magang']);
        $table->integer('kandidat');
        $table->date('masa_aktif');
        $table->string('lokasi');
        $table->longText('deskripsi');
        $table->decimal('gaji_minimum', 15, 2)->nullable();
        $table->decimal('gaji_maximum', 15, 2)->nullable();
        $table->enum('pengalaman', ['kurang dari 1 tahun', '1-3 tahun', '4-6 tahun', '7+ tahun']);
        $table->foreignId("user_id")->constrained("users");
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
