"use client"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  InputAdornment,
  Chip,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import ClearIcon from "@mui/icons-material/Clear"
import AddIcon from "@mui/icons-material/Add"
import { updateImage, addImage } from "@/lib/actions"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { ImageData } from "@/lib/types"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import imageSchema from "@/zod/image-schema"
import config from "@/config"

interface ImageUploadFormProps {
  open: boolean
  onClose: () => void
  editMode?: boolean
  imageData?: ImageData
}

type FormValues = {
  title: string
  description?: string
  tags: string[]
  file?: File | string
  currentTag?: string
}

export default function ImageUploadForm({ open, onClose, editMode = false, imageData }: ImageUploadFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageData?.url || null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      title: imageData?.title || "",
      description: imageData?.description || "",
      tags: imageData?.tags || [],
      file: imageData?.url || undefined,
      currentTag: "",
    },
    mode: "onChange",
  })

  const tags = watch("tags")
  const file = watch("file");
  const currentTag = watch("currentTag")

  // Handle file changes and preview
  useEffect(() => {
    if (file && typeof file !== "string") {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else if (!editMode) {
      setPreviewUrl(null)
    }
  }, [file, editMode])

  // Reset form when opening/closing or when imageData changes
  useEffect(() => {
    if (open) {
      reset({
        title: imageData?.title || "",
        description: imageData?.description || "",
        tags: imageData?.tags || [],
        file: imageData?.url || undefined,
        currentTag: "",
      })
      setPreviewUrl(imageData?.url || null)
    }
  }, [open, imageData, reset])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setValue("file", e.target.files[0], { shouldValidate: true })
    }
  }

  const clearImage = () => {
    setValue("file", undefined, { shouldValidate: true })
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddTag = () => {
    if (currentTag?.trim() && !tags.includes(currentTag.trim())) {
      setValue("tags", [...tags, currentTag.trim()], { shouldValidate: true })
      setValue("currentTag", "", { shouldValidate: false })
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true }
    )
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)

      if (editMode && imageData) {
        // Edit mode logic
        let updatedImageData: Partial<ImageData> = {
          id: imageData.id,
          title: data.title,
          description: data.description,
          tags: data.tags,
        }

        if (data.file && typeof data.file !== "string") {
          // Upload new file to Cloudinary
          const uploadResult = await uploadToCloudinary(data.file)
          updatedImageData = {
            ...updatedImageData,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
          }
        }

        await updateImage(updatedImageData as ImageData)
        toast.success("Image updated successfully!")
      } else {
        // New image upload - file is required here
        if (!data.file || typeof data.file === "string") {
          throw new Error("Image file is required")
        }

        const uploadResult = await uploadToCloudinary(data.file)
        await addImage({
          url: uploadResult.secure_url,
          title: data.title,
          description: data.description,
          tags: data.tags,
          width: uploadResult.width,
          height: uploadResult.height,
          publicId: uploadResult.public_id,
        })
      }

      router.refresh()
      onClose()
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Error during image upload:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsSubmitting(false)
    }
  }

  const uploadToCloudinary = async (file: File) => {
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

  return (
    <Dialog
      open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? "Edit Image" : "Upload New Image"}</DialogTitle>
      <DialogContent sx={{
        overflowX: 'hidden',
        '& > *': {
          maxWidth: '100%' // Ensure all children don't overflow
        }
      }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              mt: 2,
              mb: 3,
              border: "2px dashed rgba(242, 0, 145, 0.57)",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              position: "relative",
            }}
          >
            {previewUrl ? (
              <Box sx={{ position: "relative" }}>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={500}
                  height={300}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                    },
                  }}
                  onClick={clearImage}
                >
                  <ClearIcon />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  py: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="body1">Click to select an image</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  PNG, JPG, WEBP up to 5MB
                </Typography>
              </Box>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInputRef}
              required={!editMode}
            />
            {errors.file && (
              <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                {errors.file.message}
              </Typography>
            )}
          </Box>

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Image Title"
                disabled={isSubmitting}
                error={!!errors.title}
                helperText={errors.title?.message}
                InputProps={{
                  endAdornment: field.value ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear title"
                        onClick={() => field.onChange("")}
                        edge="end"
                        disabled={isSubmitting}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Description (optional)"
                multiline
                rows={3}
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: field.value ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear description"
                        onClick={() => field.onChange("")}
                        edge="end"
                        disabled={isSubmitting}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            )}
          />

          <Box sx={{ mt: 2 }}>
            <Controller
              name="currentTag"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Add Tags"
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleAddTag}
                          disabled={!currentTag?.trim() || isSubmitting}
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  disabled={isSubmitting}
                  size="small"
                />
              ))}
            </Box>
            {errors.tags && (
              <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                {errors.tags.message}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting || (!editMode && !file)}
          onClick={handleSubmit(onSubmit)}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Processing..." : editMode ? "Save Changes" : "Upload Image"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}