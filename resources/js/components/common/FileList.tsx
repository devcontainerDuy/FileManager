import { useEffect } from "react";
import FileItem from "./FileItem";
// import { FileItem as FileItemType } from "@/types/fileManager";
import useFileManager from "@/hooks/use-FileManager";

const FileList = () => {
    const {
        currentDirectory,
        files,
        directories,
        loading,
        error,
        getFiles,
        deleteFile,
        deleteDirectory,
    } = useFileManager();

    useEffect(() => {
        getFiles();
    }, []);

    const handleDirectoryClick = (path: string) => {
        const relativePath = path.replace("public/", "");
        getFiles(relativePath);
    };

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="grid grid-cols-12 gap-2 bg-gray-50 p-3 border-b border-gray-200 text-sm font-medium text-gray-500">
                <div className="col-span-1">Preview</div>
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Modified</div>
                <div className="col-span-1">Actions</div>
            </div>

            <div className="divide-y divide-gray-200">
                {directories.map((dir) => (
                    <div
                        key={dir.path}
                        className="grid grid-cols-12 gap-2 p-3 hover:bg-gray-50 items-center cursor-pointer"
                        onClick={() => handleDirectoryClick(dir.path)}
                    >
                        <div className="col-span-1">
                            <i
                                data-feather="folder"
                                className="w-5 h-5 text-yellow-400"
                            ></i>
                        </div>
                        <div className="col-span-4 font-medium text-gray-700">
                            {dir.name}
                        </div>
                        <div className="col-span-2 text-gray-500">-</div>
                        <div className="col-span-2 text-gray-500">
                            Directory
                        </div>
                        <div className="col-span-2 text-gray-500">-</div>
                        <div className="col-span-1 flex space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                        confirm(
                                            `Delete directory "${dir.name}" and all its contents?`
                                        )
                                    ) {
                                        deleteDirectory(dir.path);
                                    }
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                            >
                                <i data-feather="trash-2"></i>
                            </button>
                        </div>
                    </div>
                ))}

                {files.map((file) => (
                    <FileItem
                        key={file.path}
                        file={file}
                        onDelete={() => {
                            if (confirm(`Delete file "${file.name}"?`)) {
                                deleteFile(file.path);
                            }
                        }}
                    />
                ))}

                {files.length === 0 && directories.length === 0 && (
                    <div className="p-4 text-center text-gray-400">
                        No files found in this directory
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileList;
