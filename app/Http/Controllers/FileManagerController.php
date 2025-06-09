<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FileManagerController extends Controller
{
    public function index(Request $request)
    {
        $directory = $request->input('directory', '');
        $storagePath = 'public/' . ltrim($directory, '/');

        $items = $this->getDirectoryContents($storagePath);

        // Tạo breadcrumbs
        $breadcrumbs = $this->generateBreadcrumbs($directory);

        return Inertia::render('FileManager/Index', [
            'files' => $items['files'],
            'directories' => $items['directories'],
            'currentDirectory' => $directory,
            'breadcrumbs' => $breadcrumbs,
            'parentDirectory' => $this->getParentDirectoryPath($directory),
        ]);
    }

    public function getDirectoryContents($path)
    {
        $files = [];
        $directories = [];

        // Lấy danh sách file
        foreach (Storage::files($path) as $file) {
            if (basename($file) === '.gitignore')
                continue;

            $files[] = [
                'name' => basename($file),
                'path' => $file,
                'url' => Storage::url($file),
                'size' => Storage::size($file),
                'type' => Storage::mimeType($file),
                'last_modified' => Storage::lastModified($file),
                'is_directory' => false,
            ];
        }

        // Lấy danh sách thư mục
        foreach (Storage::directories($path) as $dir) {
            $directories[] = [
                'name' => basename($dir),
                'path' => $dir,
                'is_directory' => true,
            ];
        }

        return [
            'files' => $files,
            'directories' => $directories,
        ];
    }

    protected function generateBreadcrumbs($currentDirectory)
    {
        $breadcrumbs = [['name' => 'Root', 'path' => '']];

        if (!empty($currentDirectory)) {
            $parts = explode('/', $currentDirectory);
            $path = '';

            foreach ($parts as $part) {
                $path .= $part . '/';
                $breadcrumbs[] = [
                    'name' => $part,
                    'path' => rtrim($path, '/'),
                ];
            }
        }

        return $breadcrumbs;
    }

    protected function getParentDirectoryPath($currentDirectory)
    {
        if (empty($currentDirectory)) {
            return null;
        }

        $parent = dirname($currentDirectory);
        return $parent === '.' ? '' : $parent;
    }

    public function createDirectory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'directory' => 'nullable|string',
        ]);

        $path = 'public/' . ltrim($request->input('directory', ''), '/') . '/' . $request->name;

        if (Storage::exists($path)) {
            return back()->with('error', 'Directory already exists');
        }

        Storage::makeDirectory($path);

        return redirect()->route('file-manager.index', [
            'directory' => $request->input('directory', '')
        ])->with('success', 'Directory created');
    }

    public function uploadFiles(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:10240', // 10MB max
            'directory' => 'nullable|string',
        ]);

        $directory = 'public/' . ltrim($request->input('directory', ''), '/');

        foreach ($request->file('files') as $file) {
            $file->storeAs($directory, $file->getClientOriginalName());
        }

        return redirect()->route('file-manager.index', [
            'directory' => $request->input('directory', '')
        ])->with('success', 'Files uploaded');
    }

    public function deleteItem(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
            'is_directory' => 'required|boolean',
        ]);

        $path = $request->path;

        if ($request->is_directory) {
            Storage::deleteDirectory($path);
        } else {
            Storage::delete($path);
        }

        return back()->with('success', 'Item deleted');
    }
}