import { useState, useEffect } from "react";
import feather from "feather-icons";
import FolderTree from "@/components/common/FolderTree";
import UploadModal from "@/components/common/UploadModal";
import FileList from "@/components/common/FileList";

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        feather.replace();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="flex">
                {/* Sidebar */}
                <div
                    className={`${
                        sidebarOpen ? "block" : "hidden"
                    } md:block w-64 bg-white border-r border-gray-200`}
                >
                    <FolderTree />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="md:hidden text-gray-500"
                                >
                                    <i data-feather="menu"></i>
                                </button>
                                <h1 className="text-xl font-bold text-gray-800">
                                    File Manager
                                </h1>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UploadModal />
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-4 bg-white">
                        <FileList />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default App;
