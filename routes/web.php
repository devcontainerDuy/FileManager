<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('app');
})->where('any', '.*');

use App\Http\Controllers\FileManagerController;

Route::prefix('file-manager')->group(function () {
    Route::get('/files', [FileManagerController::class, 'getFiles']);
    Route::post('/directory', [FileManagerController::class, 'createDirectory']);
    Route::post('/upload', [FileManagerController::class, 'uploadFiles']);
    Route::delete('/file', [FileManagerController::class, 'deleteFile']);
    Route::delete('/directory', [FileManagerController::class, 'deleteDirectory']);
})->middleware('web');