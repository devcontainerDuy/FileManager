<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileManagerController extends Controller
{
    public function getFiles(Request $request)
    {
        $directory = $request->input('directory', '');
        $storagePath = 'public/' . ltrim($directory, '/');

        $files = [];
        $directories = [];

        // Get files and directories
        $storageItems = Storage::files($storagePath);
        $storageDirectories = Storage::directories($storagePath);

        foreach ($storageItems as $item) {
            if (Str::startsWith($item, 'public/.')) {
                continue; // Skip hidden files
            }

            $files[] = [
                'name' => basename($item),
                'path' => $item,
                'url' => Storage::url($item),
                'size' => Storage::size($item),
                'mime_type' => Storage::mimeType($item),
                'last_modified' => Storage::lastModified($item),
            ];
        }

        foreach ($storageDirectories as $dir) {
            if (Str::startsWith($dir, 'public/.')) {
                continue; // Skip hidden directories
            }

            $directories[] = [
                'name' => basename($dir),
                'path' => $dir,
            ];
        }

        return response()->json([
            'files' => $files,
            'directories' => $directories,
            'current_directory' => $directory,
        ]);
    }

    public function createDirectory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'directory' => 'nullable|string',
        ]);

        $path = 'public/' . ltrim($request->input('directory', ''), '/') . '/' . $request->name;

        if (Storage::exists($path)) {
            return response()->json(['error' => 'Directory already exists'], 400);
        }

        if (Storage::makeDirectory($path)) {
            return response()->json(['message' => 'Directory created successfully']);
        }

        return response()->json(['error' => 'Failed to create directory'], 500);
    }

    public function uploadFiles(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:10240', // 10MB max
            'directory' => 'nullable|string',
        ]);

        $directory = 'public/' . ltrim($request->input('directory', ''), '/');
        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store($directory);
            $uploadedFiles[] = [
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'url' => Storage::url($path),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ];
        }

        return response()->json(['files' => $uploadedFiles]);
    }

    public function deleteFile(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        if (Storage::delete($request->path)) {
            return response()->json(['message' => 'File deleted successfully']);
        }

        return response()->json(['error' => 'Failed to delete file'], 500);
    }

    public function deleteDirectory(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        if (Storage::deleteDirectory($request->path)) {
            return response()->json(['message' => 'Directory deleted successfully']);
        }

        return response()->json(['error' => 'Failed to delete directory'], 500);
    }
}