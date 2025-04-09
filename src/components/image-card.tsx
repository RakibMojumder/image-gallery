"use client"

import type React from "react"

import { useState } from "react"
import {
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import { deleteImage } from "@/lib/actions"
import type { ImageData } from "@/lib/types"
import ImageUploadForm from "./image-upload-form"
import { toast } from "sonner"
import { Download } from "@mui/icons-material"
import { handleDownloadImage } from "@/lib/utils"

interface ImageCardProps {
  image: ImageData
  onDelete: () => void
  onPreviewClick: (image: ImageData) => void
}

export default function ImageCard({ image, onDelete, onPreviewClick }: ImageCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleMenuClose()
    setEditModalOpen(true)
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      await deleteImage(image.id)
      setDeleteDialogOpen(false)
      onDelete()
      toast.success("Image deleted successfully!")
    } catch (error) {
      console.error("Failed to delete image:", error)
      toast.error("Failed to delete image")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleImageClick = () => {
    onPreviewClick(image)
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  // Calculate aspect ratio for the card
  const aspectRatio = image.height / image.width

  return (
    <>
      <Card
        sx={{
          width: "100%",
          position: "relative",
          cursor: "pointer",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
            "& .image-actions": {
              opacity: 1,
            },
            "& .image-title": {
              opacity: 1,
            },
          },
        }}
        onClick={handleImageClick}
      >
        <CardMedia
          component="img"
          image={image.url}
          alt={image.title}
          sx={{
            width: "100%",
            height: "auto",
            aspectRatio: `${1}/${aspectRatio}`,
            objectFit: "cover",
          }}
        />

        <Box
          className="image-title"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            padding: 1,
            color: "white",
            opacity: 0,
            transition: "opacity 0.3s",
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {image.title}
          </Typography>
        </Box>

        <CardActions
          disableSpacing
          className="image-actions"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            opacity: 0,
            transition: "opacity 0.3s",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "0 0 0 8px",
            display: "flex",
            gap: 0.5,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton aria-label="add to favorites" size="small" sx={{ color: "white" }} onClick={toggleFavorite}>
            {isFavorite ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton aria-label="more options" size="small" sx={{ color: "white" }} onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </CardActions>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
        <MenuItem onClick={() => handleDownloadImage(image)} sx={{ color: "primary.main" }}>
          <Download fontSize="small" sx={{ mr: 1 }} />
          Download
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <span style={{ color: "#F20091" }}>{image.title}</span> image? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" size="small" sx={{ borderRadius: 2 }} onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="outlined" size="small" sx={{ borderRadius: 2 }} onClick={handleDeleteConfirm} color="error" disabled={isDeleting} autoFocus>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>


      {editModalOpen && (
        <ImageUploadForm
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          editMode
          imageData={image}
        />
      )}
    </>
  )
}

