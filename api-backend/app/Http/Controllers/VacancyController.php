<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VacancyController extends Controller
{
    public function allVacancies()
{
    $vacancies = Vacancy::orderBy('created_at', 'desc')->get();

    return response()->json([
        "status" => true,
        "vacancy" => $vacancies
    ]);
}

    public function index()
    {
        $user_id = auth()->user()->id;
        $vacancies = Vacancy::where("user_id", $user_id)->get();

        return response()->json([
            "status" => true,
            "vacancy" => $vacancies
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi minimal sesuai permintaanmu
        $data = $request->validate([
            "judul" => "required"
        ]);

        $data["posisi"]         = $request->posisi;
        $data["tipe_pekerjaan"] = $request->tipe_pekerjaan;
        $data["kandidat"]       = $request->kandidat;
        $data["masa_aktif"]     = $request->masa_aktif;
        $data["lokasi"]         = $request->lokasi;
        $data["deskripsi"]      = $request->deskripsi;
        $data["gaji_minimum"]   = $request->gaji_minimum;
        $data["gaji_maximum"]   = $request->gaji_maximum;
        $data["pengalaman"]     = $request->pengalaman;

        $data["user_id"] = auth()->user()->id; 

        Vacancy::create($data);

        return response()->json([
            "status" => true,
            "message" => "Lowongan berhasil dibuat"
        ]);
    }

    public function show($id) // Terima $id biasa
{
    $vacancy = Vacancy::find($id);

    if (!$vacancy) {
        return response()->json([
            "status" => false,
            "message" => "Lowongan tidak ditemukan"
        ], 404);
    }

    return response()->json([
        "status" => true,
        "message" => "Lowongan ditemukan",
        "vacancy" => $vacancy
    ]);
}

    public function update(Request $request, $id) // Gunakan $id biasa
{
    $vacancy = Vacancy::find($id);

    if (!$vacancy) {
        return response()->json([
            "status" => false,
            "message" => "Lowongan tidak ditemukan"
        ], 404);
    }

    $request->validate([
        "judul" => "required"
    ]);

    $vacancy->judul           = $request->judul;
    $vacancy->posisi          = $request->posisi;
    $vacancy->tipe_pekerjaan  = $request->tipe_pekerjaan;
    $vacancy->kandidat        = $request->kandidat;
    $vacancy->masa_aktif      = $request->masa_aktif;
    $vacancy->lokasi          = $request->lokasi;
    $vacancy->deskripsi       = $request->deskripsi;
    $vacancy->gaji_minimum    = $request->gaji_minimum;
    $vacancy->gaji_maximum    = $request->gaji_maximum;
    $vacancy->pengalaman      = $request->pengalaman;

    $vacancy->save();

    return response()->json([
        "status" => true,
        "message" => "Lowongan berhasil diperbarui",
        "vacancy" => $vacancy
    ]);
    }

    public function destroy(Vacancy $vacancy)
    {

        $vacancy->delete();

        return response()->json([
            "status" => true,
            "message" => "Lowongan berhasil dihapus"
        ]);
    }
}