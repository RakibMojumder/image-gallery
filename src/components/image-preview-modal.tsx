"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Divider,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import DownloadIcon from "@mui/icons-material/Download"
import type { ImageData } from "@/lib/types"
import Image from "next/image"
import { handleDownloadImage } from "@/lib/utils"

interface ImagePreviewModalProps {
  open: boolean
  image: ImageData | null
  onClose: () => void
  images: ImageData[]
  onTagClick?: (tag: string) => void
}

export default function ImagePreviewModal({ open, image, onClose, images, onTagClick }: ImagePreviewModalProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (image) {
      const index = images.findIndex((img) => img.id === image.id)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    }
  }, [image, images])

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious(e as unknown as React.MouseEvent)
    } else if (e.key === "ArrowRight") {
      handleNext(e as unknown as React.MouseEvent)
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag)
      onClose()
    }
  }

  const currentImage = images[currentIndex]

  if (!open || !currentImage) return null

  // Format date
  const formattedDate = new Date(currentImage.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullScreen={fullScreen}
      onKeyDown={handleKeyDown}
      sx={{
        "& .MuiDialog-paper": {
          bgcolor: theme.palette.background.default,
          m: { xs: 0, sm: 2 },
          width: "100%",
          height: fullScreen ? "100%" : "auto",
          maxHeight: fullScreen ? "100%" : "calc(100% - 64px)",
          borderRadius: fullScreen ? 0 : 2,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          display: "flex",
          gap: 1,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: { xs: "column", md: "row" }, overflow: "hidden" }}>
        <Box
          sx={{
            position: "relative",
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "black",
            minHeight: { xs: "50vh", md: "70vh" },
            width: { xs: "100%", md: "70%" },
          }}
        >
          <Image
            src={currentImage.url || "/placeholder.svg"}
            alt={currentImage.title}
            width={currentImage.width}
            height={currentImage.height}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />

          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: 16,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            p: 3,
            width: { xs: "100%", md: "30%" },
            minWidth: { md: "300px" },
            maxWidth: { md: "400px" },
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            {currentImage.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>U</Avatar>
            <Box>
              <Typography variant="subtitle2">User Name</Typography>
              <Typography variant="caption" color="text.secondary">
                {formattedDate}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <IconButton color="primary">
              <FavoriteIcon />
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
            <IconButton onClick={() => handleDownloadImage(currentImage)}>
              <DownloadIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          {currentImage.description && (
            <>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" paragraph>
                {currentImage.description}
              </Typography>
            </>
          )}

          {currentImage.tags && currentImage.tags.length > 0 && (
            <>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {currentImage.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" onClick={() => handleTagClick(tag)} clickable />
                ))}
              </Box>
            </>
          )}

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Details
          </Typography>
          <Typography variant="body2">
            Dimensions: {currentImage.width} × {currentImage.height} px
          </Typography>
          <Typography variant="body2">Aspect ratio: {(currentImage.width / currentImage.height).toFixed(2)}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

