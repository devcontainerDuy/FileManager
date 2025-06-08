declare interface FileItem {
    name: string;
    path: string;
    url: string;
    size: number;
    mime_type: string;
    last_modified: number;
    isDirectory?: boolean;
}

declare interface DirectoryItem {
    name: string;
    path: string;
}

declare interface FileManagerContextType {
    currentDirectory: string;
    files: FileItem[];
    directories: DirectoryItem[];
    loading: boolean;
    error: string | null;
    getFiles: (directory: string) => Promise<void>;
    createDirectory: (name: string) => Promise<void>;
    uploadFiles: (files: FileList, directory: string) => Promise<void>;
    deleteFile: (path: string) => Promise<void>;
    deleteDirectory: (path: string) => Promise<void>;
}
