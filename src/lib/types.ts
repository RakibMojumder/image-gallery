export interface ImageData {
  id: string
  url: string
  title: string
  description?: string
  tags?: string[]
  createdAt: string
  width: number
  height: number
  publicId?: string
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  created_at: string
  resource_type: string
  tags?: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  original_filename: string
}

