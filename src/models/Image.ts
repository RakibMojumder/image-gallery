import mongoose, { Schema, type Document } from "mongoose"

export interface IImage extends Document {
  title: string
  description?: string
  url: string
  publicId?: string
  tags?: string[]
  width: number
  height: number
  createdAt: Date
  updatedAt: Date
}

const ImageSchema = new Schema<IImage>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this image"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    url: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    publicId: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    width: {
      type: Number,
      required: [true, "Please provide the image width"],
    },
    height: {
      type: Number,
      required: [true, "Please provide the image height"],
    },
  },
  {
    timestamps: true,
  },
)

// Add text index for search functionality
ImageSchema.index({
  title: "text",
  description: "text",
  tags: "text",
})

export default mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema)

