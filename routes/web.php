<?php

use App\Http\Controllers\FileManagerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified', 'web'])->group(function () {
    Route::get('/file-manager', [FileManagerController::class, 'index'])->name('file-manager.index');
    Route::post('/file-manager/directory', [FileManagerController::class, 'createDirectory'])->name('file-manager.create-directory');
    Route::post('/file-manager/upload', [FileManagerController::class, 'uploadFiles'])->name('file-manager.upload');
    Route::delete('/file-manager/delete', [FileManagerController::class, 'deleteItem'])->name('file-manager.delete');
});