import { v2 as cloudinary } from "cloudinary"
import config from "@/config"

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: config.CLOUDINARY_API_KEY || "",
  api_secret: config.CLOUDINARY_API_SECRET || "",
  secure: true,
})

export const generateSignature = (folder: string, timestamp: number) => {

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    config.CLOUDINARY_API_SECRET || "",
  )

  return {
    signature,
    timestamp,
    cloudName: config.CLOUDINARY_CLOUD_NAME || "demo",
    apiKey: config.CLOUDINARY_API_KEY || "",
  }
}

export default cloudinary
