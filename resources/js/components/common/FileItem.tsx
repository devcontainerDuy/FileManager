import { useEffect } from 'react';
import feather from 'feather-icons';

interface FileItemProps {
    file: FileItem;
    onDelete: () => void;
}

const FileItem = ({ file, onDelete }: FileItemProps) => {
    useEffect(() => {
        feather.replace();
    }, []);

    const formatSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]);
    };

    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleDateString();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy URL: ', err);
        });
    };

    return (
        <div className="grid grid-cols-12 gap-2 p-3 hover:bg-gray-50 items-center">
            <div className="col-span-1">
                {file.mime_type.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="w-10 h-10 object-cover rounded" />
                ) : (
                    <i data-feather="file" className="w-5 h-5 text-gray-400"></i>
                )}
            </div>
            <div className="col-span-4 font-medium text-gray-700 truncate">{file.name}</div>
            <div className="col-span-2 text-gray-500">{formatSize(file.size)}</div>
            <div className="col-span-2 text-gray-500">{file.mime_type}</div>
            <div className="col-span-2 text-gray-500">{formatDate(file.last_modified)}</div>
            <div className="col-span-1 flex space-x-2">
                <button 
                    onClick={() => copyToClipboard(file.url)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Copy URL"
                >
                    <i data-feather="copy"></i>
                </button>
                <button 
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                >
                    <i data-feather="trash-2"></i>
                </button>
            </div>
        </div>
    );
};

export default FileItem;