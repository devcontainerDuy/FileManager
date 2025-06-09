import { useEffect, useState } from "react";
import feather from "feather-icons";
import { Head, router } from "@inertiajs/react";

interface FileManagerProps {
    files: FileItem[];
    directories: FileItem[];
    currentDirectory: string;
    breadcrumbs: Breadcrumb[];
    parentDirectory: string | null;
    flash?: {
        success?: string;
        error?: string;
    };
}

const FileManager = ({ 
    files, 
    directories, 
    currentDirectory, 
    breadcrumbs, 
    parentDirectory,
    flash 
}: FileManagerProps) => {
    const [showCreateFolderModal, setShowCreateFolderModal] = useState<boolean>(false);
    const [newFolderName, setNewFolderName] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    useEffect(() => {
        feather.replace();
    }, [files, directories]);

    const navigateToDirectory = (path: string) => {
        router.get(route('file-manager.index'), { directory: path }, {
            preserveState: true,
        });
    };

    const handleCreateFolder = () => {
        router.post(route('file-manager.create-directory'), {
            name: newFolderName,
            directory: currentDirectory,
        }, {
            onSuccess: () => {
                setShowCreateFolderModal(false);
                setNewFolderName('');
            },
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            const formData = new FormData();
            Array.from(e.target.files).forEach(file => {
                formData.append('files[]', file);
            });
            formData.append('directory', currentDirectory);

            router.post(route('file-manager.upload'), formData, {
                preserveState: true,
                onProgress: (progress) => {
                    setUploadProgress(progress?.percentage || 0);
                },
                onFinish: () => {
                    setIsUploading(false);
                    setUploadProgress(0);
                },
            });
        }
    };

    const handleDelete = (path: string, isDirectory: boolean) => {
        if (confirm(`Are you sure you want to delete this ${isDirectory ? 'directory' : 'file'}?`)) {
            router.delete(route('file-manager.delete'), {
                data: { path, is_directory: isDirectory },
                preserveState: true,
            });
        }
    };

    const formatSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
    };

    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div>
            <Head title="File Manager" />

            {/* Flash messages */}
            {flash?.success && <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">{flash.success}</div>}
            {flash?.error && <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{flash.error}</div>}

            <div className="flex h-full flex-col bg-gray-50">
                {/* Header */}
                <div className="border-b border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-800">File Manager</h1>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowCreateFolderModal(true)}
                                className="flex items-center rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                            >
                                <i data-feather="folder-plus" className="mr-2"></i>
                                New Folder
                            </button>
                            <label className="flex cursor-pointer items-center rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600">
                                <i data-feather="upload" className="mr-2"></i>
                                Upload
                                <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                            </label>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <div className="mt-4 flex items-center text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center">
                                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                                <button
                                    onClick={() => navigateToDirectory(crumb.path)}
                                    className={`hover:text-blue-500 ${index === breadcrumbs.length - 1 ? 'font-medium text-gray-700' : 'text-gray-500'}`}
                                >
                                    {crumb.name}
                                </button>
                            </div>
                        ))}

                        {/* Back button */}
                        {parentDirectory !== null && (
                            <button
                                onClick={() => navigateToDirectory(parentDirectory)}
                                className="ml-4 flex items-center rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
                            >
                                <i data-feather="arrow-left" className="mr-1 h-4 w-4"></i>
                                Back
                            </button>
                        )}
                    </div>

                    {/* Upload progress */}
                    {isUploading && (
                        <div className="mt-2">
                            <div className="h-2.5 w-full rounded-full bg-gray-200">
                                <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">Uploading: {uploadProgress}%</div>
                        </div>
                    )}
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-auto p-4">
                    {/* Files and directories */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Modified</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {/* Directories first */}
                                {directories.map((dir) => (
                                    <tr key={dir.path} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => navigateToDirectory(dir.path.replace('public/', ''))}
                                                className="flex items-center text-blue-500 hover:text-blue-700"
                                            >
                                                <i data-feather="folder" className="mr-2 h-5 w-5 text-yellow-400"></i>
                                                {dir.name}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">-</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">Directory</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">-</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                            <button onClick={() => handleDelete(dir.path, true)} className="text-red-500 hover:text-red-700">
                                                <i data-feather="trash-2"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {/* Files */}
                                {files.map((file: FileItem) => (
                                    <tr key={file.path} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {file.type && file.type.startsWith('image/') ? (
                                                    <img src={file.url} alt={file.name} className="mr-2 h-8 w-8 rounded object-cover" />
                                                ) : (
                                                    <i data-feather="file" className="mr-2 h-5 w-5 text-gray-400"></i>
                                                )}
                                                <span className="max-w-xs truncate">{file.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{formatSize(file.size ?? 0)}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{file.type}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{formatDate(file.last_modified ?? 0)}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                            <div className="flex space-x-2">
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="View"
                                                >
                                                    <i data-feather="eye"></i>
                                                </a>
                                                <button
                                                    onClick={() => file.url && navigator.clipboard.writeText(file.url)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Copy URL"
                                                >
                                                    <i data-feather="copy"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file.path, false)}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Delete"
                                                >
                                                    <i data-feather="trash-2"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Empty state */}
                        {files.length === 0 && directories.length === 0 && (
                            <div className="flex h-full flex-col items-center justify-center text-gray-400 mt-3">
                                <i data-feather="folder" className="mb-4 h-16 w-16"></i>
                                <h3 className="text-lg font-medium">Empty directory</h3>
                                <p className="mb-4">Upload files or create a new folder</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create folder modal */}
            {showCreateFolderModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h3 className="mb-4 text-lg font-medium">Create New Folder</h3>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder name"
                            className="mb-4 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowCreateFolderModal(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                disabled={!newFolderName.trim()}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileManager;