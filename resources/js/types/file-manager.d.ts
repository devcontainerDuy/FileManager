interface FileItem {
    name: string;
    path: string;
    url?: string;
    size?: number;
    type?: string;
    last_modified?: number;
    is_directory: boolean;
}

interface Breadcrumb {
    name: string;
    path: string;
}
