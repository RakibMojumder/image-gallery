'use client'

import { toast } from "sonner";
import { ImageData } from "./types";
import config from "@/config";

export const uploadToCloudinary = async (file: File) => {
    const response = await fetch("/api/cloudinary/signature")
    const { signature, timestamp, cloudName, apiKey } = await response.json();

    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", apiKey)
    formData.append("timestamp", timestamp.toString())
    formData.append("signature", signature)
    formData.append("folder", config.CLOUDINARY_FOLDER as string)

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    })

    if (!uploadResponse.ok) {
        throw new Error("Failed to upload image")
    }

    return uploadResponse.json()
}

export const deleteImageFromCloudinary = async (publicId: string) => {
    const response = await fetch(`/api/cloudinary/signature?publicId=${publicId}`)
    const { signature, timestamp, cloudName, apiKey } = await response.json();

    const formData = new FormData()
    formData.append("public_id", publicId)
    formData.append("api_key", apiKey)
    formData.append("timestamp", timestamp.toString())
    formData.append("signature", signature)

    const deleteResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: "POST",
        body: formData,
    })

    if (!deleteResponse.ok) {
        throw new Error("Failed to delete image")
    }

    return deleteResponse.json()
}

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
