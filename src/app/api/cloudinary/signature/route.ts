import { NextRequest, NextResponse } from "next/server";
import { generateSignature, GenerateSignaturePayload } from "@/lib/cloudinary";
import config from "@/config";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publicId = searchParams.get("publicId") || "";

    const timestamp = Math.round(new Date().getTime() / 1000);
    // If publicId is provided, use it; otherwise, use a default folder
    const payload: GenerateSignaturePayload = publicId
      ? { public_id: publicId, timestamp }
      : { folder: config.CLOUDINARY_FOLDER, timestamp };

    // Generate a signature for the image upload
    const signature = generateSignature(payload);

    return NextResponse.json(signature);
  } catch (error) {
    console.error("Error generating signature:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
