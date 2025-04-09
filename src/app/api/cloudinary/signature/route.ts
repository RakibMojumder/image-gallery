import { NextResponse } from "next/server"
import { generateSignature } from "@/lib/cloudinary"

export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = generateSignature("image_gallery", timestamp)

    return NextResponse.json(signature)
  } catch (error) {
    console.error("Error generating signature:", error)
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 })
  }
}

