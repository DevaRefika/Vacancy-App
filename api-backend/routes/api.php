<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VacancyController;

Route::post("register", [AuthController::class, "register"]);
Route::post("login", [AuthController::class, "login"]);
Route::get('/Vacancy/all', [VacancyController::class, 'allVacancies']);

Route::group([
    "middleware" => ["auth:sanctum"]
], function(){
    Route::get("profile", [AuthController::class, "profile"]);
    Route::post("logout", [AuthController::class, "logout"]);
    Route::put('/Vacancy/{id}', [VacancyController::class, 'update']);
    Route::get('/Vacancy/all', [VacancyController::class, 'allVacancies']);

    Route::apiResource("Vacancy", VacancyController::class);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
