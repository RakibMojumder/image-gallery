"use server"

import { connectToDatabase } from "./mongodb"
import Image from "@/models/Image"
import type { ImageData } from "./types"
import cloudinary from "./cloudinary"
import { revalidatePath } from "next/cache"

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
  }
}

// Add new image
export async function addImage(imageData: Omit<ImageData, "id" | "createdAt">) {
  try {
    await connectToDatabase()

    // Create new image in database
    const newImage = await Image.create({
      title: imageData.title,
      description: imageData.description || "",
      url: imageData.url,
      publicId: imageData.publicId,
      tags: imageData.tags || [],
      width: imageData.width,
      height: imageData.height,
    })

    revalidatePath("/")
    return { success: true, image: convertToImageData(newImage) }
  } catch (error) {
    console.error("Error adding image:", error)
    throw new Error("Failed to add image")
  }
}

// Update existing image
export async function updateImage({
  id,
  title,
  description,
  ...updates
}: {
  id: string
  title: string
  description?: string
  file?: File
} & Partial<ImageData>) {
  try {
    await connectToDatabase()

    // Find and update the image
    const updatedImage = await Image.findByIdAndUpdate(
      id,
      {
        title,
        description,
        ...updates,
      },
      { new: true, runValidators: true },
    )

    if (!updatedImage) {
      throw new Error("Image not found")
    }

    revalidatePath("/")
    return { success: true, image: convertToImageData(updatedImage) }
  } catch (error) {
    console.error("Error updating image:", error)
    throw new Error("Failed to update image")
  }
}

export async function deleteImage(id: string) {
  try {
    await connectToDatabase()

    // Find the image to get the publicId
    const image = await Image.findById(id)

    if (!image) {
      throw new Error("Image not found")
    }

    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId)
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError)
        throw new Error("Failed to delete image from Cloudinary")
      }
    }

    // Delete from database
    await Image.findByIdAndDelete(id)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting image:", error)
    throw new Error("Failed to delete image")
  }
}

export async function getImages(page = 1, limit = 12, searchQuery?: string) {
  try {
    await connectToDatabase()

    const skip = (page - 1) * limit

    let query = {}

    // If search query is provided, use text search
    if (searchQuery && searchQuery.trim() !== "") {
      query = { $text: { $search: searchQuery } }
    }

    // Get total count for pagination
    const total = await Image.countDocuments(query)

    // Get images with pagination
    const imageDocuments = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Convert to ImageData format
    const images = imageDocuments.map(convertToImageData)

    return {
      images,
      hasMore: skip + images.length < total,
      total,
    }
  } catch (error) {
    console.error("Error getting images:", error)
    throw new Error("Failed to get images")
  }
}

export async function getImageById(id: string) {
  try {
    await connectToDatabase()

    const image = await Image.findById(id)

    if (!image) {
      return null
    }

    return convertToImageData(image)
  } catch (error) {
    console.error("Error getting image by ID:", error)
    throw new Error("Failed to get image")
  }
}

// Search images by tags
export async function searchImagesByTag(tag: string, page = 1, limit = 12) {
  try {
    await connectToDatabase()

    const skip = (page - 1) * limit

    const query = { tags: tag }

    // Get total count for pagination
    const total = await Image.countDocuments(query)

    // Get images with pagination
    const imageDocuments = await Image.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    // Convert to ImageData format
    const images = imageDocuments.map(convertToImageData)

    return {
      images,
      hasMore: skip + images.length < total,
      total,
    }
  } catch (error) {
    console.error("Error searching images by tag:", error)
    throw new Error("Failed to search images")
  }
}

// Initialize with sample images if database is empty
export async function initializeSampleImages() {
  try {
    await connectToDatabase()

    // Check if there are any images in the database
    const count = await Image.countDocuments()

    if (count === 0) {
      // Sample images data
      const sampleImages = [
        {
          title: "Beautiful Nature",
          description: "A stunning view of nature",
          url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=1200&q=80",
          tags: ["nature", "landscape", "outdoor"],
          width: 800,
          height: 1200,
        },
        {
          title: "Urban Landscape",
          description: "City skyline at sunset",
          url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&h=600&q=80",
          tags: ["city", "urban", "architecture"],
          width: 900,
          height: 600,
        },
        {
          title: "Delicious Food",
          description: "Gourmet meal prepared by a chef",
          url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=900&q=80",
          tags: ["food", "cuisine", "gourmet"],
          width: 600,
          height: 900,
        },
        {
          title: "Travel Destinations",
          description: "Explore amazing places around the world",
          url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=800&q=80",
          tags: ["travel", "vacation", "adventure"],
          width: 800,
          height: 800,
        },
        {
          title: "Modern Architecture",
          description: "Contemporary building designs",
          url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
          tags: ["architecture", "design", "modern"],
          width: 1200,
          height: 800,
        },
        {
          title: "Portrait Photography",
          description: "Capturing human emotions",
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&h=1000&q=80",
          tags: ["portrait", "photography", "people"],
          width: 700,
          height: 1000,
        },
        {
          title: "Wildlife",
          description: "Animals in their natural habitat",
          url: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&h=1200&q=80",
          tags: ["animals", "wildlife", "nature"],
          width: 900,
          height: 1200,
        },
        {
          title: "Beach Paradise",
          description: "Relaxing coastal views",
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
          tags: ["beach", "ocean", "vacation"],
          width: 800,
          height: 600,
        },
        {
          title: "Modern Technology",
          description: "Cutting-edge devices",
          url: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
          tags: ["technology", "gadgets", "innovation"],
          width: 600,
          height: 800,
        },
        {
          title: "Abstract Art",
          description: "Creative expression through colors",
          url: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWJzdHJhY3QlMjBhcnR8ZW58MHx8MHx8fDA%3D",
          tags: ["art", "abstract", "creative"],
          width: 1000,
          height: 800,
        },
        {
          title: "Fashion Trends",
          description: "Latest styles and designs",
          url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=1000&q=80",
          tags: ["fashion", "style", "clothing"],
          width: 800,
          height: 1000,
        },
        {
          title: "Sports Action",
          description: "Capturing the excitement of sports",
          url: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&h=700&q=80",
          tags: ["sports", "action", "athletics"],
          width: 900,
          height: 700,
        },
      ]

      // Insert sample images
      await Image.insertMany(sampleImages)
    }
  } catch (error) {
    console.error("Error initializing sample images:", error)
  }
}

