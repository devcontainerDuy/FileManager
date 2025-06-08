import { useEffect, useState } from "react";
import feather from "feather-icons";
import useFileManager from "@/hooks/use-FileManager";

const FolderTree = () => {
    const { directories, getFiles, createDirectory } = useFileManager();
    const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    useEffect(() => {
        feather.replace();
    }, [directories]);

    const handleCreateFolder = async () => {
        if (newFolderName.trim()) {
            await createDirectory(newFolderName);
            setNewFolderModalOpen(false);
            setNewFolderName("");
        }
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-700">Folders</h2>
                <button
                    onClick={() => setNewFolderModalOpen(true)}
                    className="text-blue-500 hover:text-blue-700"
                >
                    <i data-feather="folder-plus"></i>
                </button>
            </div>

            <div className="space-y-1">
                <div
                    className="folder-item flex items-center px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => getFiles("")}
                >
                    <i
                        data-feather="folder"
                        className="mr-2 text-yellow-400"
                    ></i>
                    <span>Root</span>
                </div>

                {directories.map((dir) => (
                    <div
                        key={dir.path}
                        className="folder-item flex items-center px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                            getFiles(dir.path.replace("public/", ""))
                        }
                    >
                        <i
                            data-feather="folder"
                            className="mr-2 text-yellow-400"
                        ></i>
                        <span>{dir.name}</span>
                    </div>
                ))}
            </div>

            {/* New Folder Modal */}
            {newFolderModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">
                            Create New Folder
                        </h3>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder name"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setNewFolderModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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

export default FolderTree;
