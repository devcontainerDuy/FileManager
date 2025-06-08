import { useState } from "react";
import axios from "axios";

const useFileManager = () => {
    const [currentDirectory, setCurrentDirectory] = useState<string>("");
    const [files, setFiles] = useState<FileItem[]>([]);
    const [directories, setDirectories] = useState<DirectoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getFiles = async (directory: string = "") => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/file-manager/files", {
                params: { directory },
            });
            setFiles(response.data.files);
            setDirectories(response.data.directories);
            setCurrentDirectory(response.data.current_directory);
        } catch (err) {
            setError("Failed to load files");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createDirectory = async (name: string) => {
        setLoading(true);
        setError(null);
        try {
            await axios.post("/file-manager/directory", {
                name,
                directory: currentDirectory,
            });
            await getFiles(currentDirectory);
        } catch (err) {
            setError("Failed to create directory");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const uploadFiles = async (files: FileList, directory: string = "") => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append("files[]", file);
            });
            formData.append("directory", directory);

            await axios.post("/file-manager/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await getFiles(currentDirectory);
        } catch (err) {
            setError("Failed to upload files");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteFile = async (path: string) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete("/file-manager/file", {
                data: { path },
            });
            await getFiles(currentDirectory);
        } catch (err) {
            setError("Failed to delete file");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteDirectory = async (path: string) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete("/file-manager/directory", {
                data: { path },
            });
            await getFiles(currentDirectory);
        } catch (err) {
            setError("Failed to delete directory");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        currentDirectory,
        files,
        directories,
        loading,
        error,
        getFiles,
        createDirectory,
        uploadFiles,
        deleteFile,
        deleteDirectory,
    };
};

export default useFileManager;
