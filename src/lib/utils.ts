import { toast } from "sonner";
import { ImageData } from "./types";

export const handleDownloadImage = async (image: ImageData) => {
    const imageUrl = image.url;
    const imageName = image.title || 'downloaded-image';

    try {
        // Fetch the image as a Blob (this makes sure it gets treated as a file)
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const link = document.createElement('a');

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = imageName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the created URL to release memory
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        toast.error('Failed to download image.');
    }
};
