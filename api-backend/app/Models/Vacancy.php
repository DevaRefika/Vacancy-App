<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'judul',
        'posisi',
        'tipe_pekerjaan',
        'kandidat',
        'masa_aktif',
        'lokasi',
        'deskripsi',
        'gaji_minimum',
        'gaji_maximum',
        'pengalaman',
    ];
    protected $casts = [
        'masa_aktif' => 'date',
        'gaji_minimum' => 'decimal:2',
        'gaji_maximum' => 'decimal:2',
    ];
}
