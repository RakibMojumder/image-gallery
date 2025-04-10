import { v2 as cloudinary } from "cloudinary";
import config from "@/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: config.CLOUDINARY_API_KEY || "",
  api_secret: config.CLOUDINARY_API_SECRET || "",
  secure: true,
});

export type GenerateSignaturePayload = {
  timestamp: number;
  folder?: string;
  public_id?: string;
};

export const generateSignature = (payload: GenerateSignaturePayload) => {
  const signature = cloudinary.utils.api_sign_request(
    { ...payload },
    config.CLOUDINARY_API_SECRET || ""
  );

  return {
    signature,
    timestamp: payload.timestamp,
    cloudName: config.CLOUDINARY_CLOUD_NAME || "demo",
    apiKey: config.CLOUDINARY_API_KEY || "",
  };
};

export default cloudinary;
