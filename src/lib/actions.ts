"use server";

import { connectToDatabase } from "./mongodb";
import Image from "@/models/Image";
import type { ImageData } from "./types";
import cloudinary from "./cloudinary";
import { revalidatePath } from "next/cache";
import { initializeSampleImagesData } from "@/data";

// Convert MongoDB document to ImageData
function convertToImageData(doc: any): ImageData {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description || "",
    url: doc.url,
    publicId: doc.publicId,
    tags: doc.tags || [],
    width: doc.width,
    height: doc.height,
    createdAt: doc.createdAt.toISOString(),
  };
}

// Add new image
export async function addImage(imageData: Omit<ImageData, "id" | "createdAt">) {
  try {
    await connectToDatabase();

    // Create new image in database
    const newImage = await Image.create({
      title: imageData.title,
      description: imageData.description || "",
      url: imageData.url,
      publicId: imageData.publicId,
      tags: imageData.tags || [],
      width: imageData.width,
      height: imageData.height,
    });

    revalidatePath("/");
    return { success: true, image: convertToImageData(newImage) };
  } catch (error) {
    console.error("Error adding image:", error);
    throw new Error("Failed to add image");
  }
}

// Update existing image
export async function updateImage({
  id,
  title,
  description,
  ...updates
}: {
  id: string;
  title: string;
  description?: string;
  file?: File;
} & Partial<ImageData>) {
  try {
    await connectToDatabase();

    // Find and update the image
    const updatedImage = await Image.findByIdAndUpdate(
      id,
      {
        title,
        description,
        ...updates,
      },
      { new: true, runValidators: true }
    );

    if (!updatedImage) {
      throw new Error("Image not found");
    }

    revalidatePath("/");
    return { success: true, image: convertToImageData(updatedImage) };
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error("Failed to update image");
  }
}

export async function deleteImage(id: string) {
  try {
    await connectToDatabase();

    // Find the image to get the publicId
    const image = await Image.findById(id);

    if (!image) {
      throw new Error("Image not found");
    }

    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        throw new Error("Failed to delete image from Cloudinary");
      }
    }

    // Delete from database
    await Image.findByIdAndDelete(id);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

export async function getImages(page = 1, limit = 12, searchQuery?: string) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    let query = {};

    // If search query is provided, use text search
    if (searchQuery && searchQuery.trim() !== "") {
      query = { $text: { $search: searchQuery } };
    }

    // Get total count for pagination
    const total = await Image.countDocuments(query);

    // Get images with pagination
    const imageDocuments = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Convert to ImageData format
    const images = imageDocuments.map(convertToImageData);

    return {
      images,
      hasMore: skip + images.length < total,
      total,
    };
  } catch (error) {
    console.error("Error getting images:", error);
    throw new Error("Failed to get images");
  }
}

export async function getImageById(id: string) {
  try {
    await connectToDatabase();

    const image = await Image.findById(id);

    if (!image) {
      return null;
    }

    return convertToImageData(image);
  } catch (error) {
    console.error("Error getting image by ID:", error);
    throw new Error("Failed to get image");
  }
}

// Search images by tags
export async function searchImagesByTag(tag: string, page = 1, limit = 12) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const query = { tags: tag };

    // Get total count for pagination
    const total = await Image.countDocuments(query);

    // Get images with pagination
    const imageDocuments = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Convert to ImageData format
    const images = imageDocuments.map(convertToImageData);

    return {
      images,
      hasMore: skip + images.length < total,
      total,
    };
  } catch (error) {
    console.error("Error searching images by tag:", error);
    throw new Error("Failed to search images");
  }
}

// Initialize with sample images if database is empty
export async function initializeSampleImages() {
  try {
    await connectToDatabase();

    // Check if there are any images in the database
    const count = await Image.countDocuments();

    if (count === 0) {
      // Insert sample images
      await Image.insertMany(initializeSampleImagesData);
    }
  } catch (error) {
    console.error("Error initializing sample images:", error);
  }
}
