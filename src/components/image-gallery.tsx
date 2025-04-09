'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { Box, Typography, CircularProgress, Chip } from "@mui/material"
import Masonry from "react-masonry-css"
import ImageCard from "./image-card"
import ImagePreviewModal from "./image-preview-modal"
import type { ImageData } from "@/lib/types"
import { getImages, searchImagesByTag } from "@/lib/actions"

interface ImageGalleryProps {
  initialImages: ImageData[]
  initialHasMore: boolean
  searchQuery?: string
}

export default function ImageGallery({ initialImages, initialHasMore, searchQuery }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const [columnCount, setColumnCount] = useState(4)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false) // State to toggle the visibility of all tags
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Responsive column count
  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth
      if (width < 600) setColumnCount(2)
      else if (width < 960) setColumnCount(3)
      else if (width < 1280) setColumnCount(4)
      else setColumnCount(5)
    }

    updateColumnCount()
    const resizeHandler = debounce(updateColumnCount, 200)
    window.addEventListener("resize", resizeHandler)
    return () => window.removeEventListener("resize", resizeHandler)
  }, [])

  // Reset when search query changes
  useEffect(() => {
    setImages(initialImages)
    setHasMore(initialHasMore)
    setPage(1)
    setActiveTag(null)
  }, [initialImages, initialHasMore, searchQuery])

  // Load more images when page changes
  useEffect(() => {
    if (page === 1) return

    const loadMoreImages = async () => {
      try {
        setIsLoading(true)
        const result = activeTag
          ? await searchImagesByTag(activeTag, page, 12)
          : await getImages(page, 12, searchQuery)

        if (result.images.length > 0) {
          setImages(prev => [...prev, ...result.images])
          setHasMore(result.hasMore)
        } else {
          setHasMore(false)
        }
      } catch (error) {
        console.error("Error loading images:", error)
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadMoreImages()
  }, [page, searchQuery, activeTag])

  // Intersection Observer callback
  const lastImageElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || !hasMore) {
      if (observer.current) observer.current.disconnect()
      return
    }

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage(prev => prev + 1)
        }
      },
      { rootMargin: "200px" }
    )

    if (node) observer.current.observe(node)
  }, [isLoading, hasMore])

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [])

  // Memoized unique tags
  const uniqueTags = useMemo(() =>
    Array.from(new Set(images.flatMap(img => img.tags || [])))
    , [images])

  // Memoized breakpoint columns
  const breakpointColumnsObj = useMemo(() => ({
    default: columnCount,
    1280: 4,
    960: 3,
    600: 2,
  }), [columnCount])

  // Handlers
  const handleDeleteImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }, [])

  const handleImagePreview = useCallback((image: ImageData) => {
    setSelectedImage(image)
  }, [])

  const handleClosePreview = useCallback(() => {
    setSelectedImage(null)
  }, [])

  const handleTagClick = useCallback(async (tag: string) => {
    try {
      setIsLoading(true)
      const isSameTag = tag === activeTag
      const newTag = isSameTag ? null : tag

      setActiveTag(newTag)
      const result = newTag
        ? await searchImagesByTag(newTag, 1, 12)
        : await getImages(1, 12, searchQuery)

      setImages(result.images)
      setHasMore(result.hasMore)
      setPage(1)
    } catch (error) {
      console.error("Error filtering by tag:", error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTag, searchQuery])

  // Toggle the visibility of all tags
  const handleSeeMoreTags = () => {
    setShowAllTags(prev => !prev)
  }

  if (images.length === 0 && !isLoading) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No images found
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {uniqueTags.length > 0 && (
        <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {/* Show up to 15 tags, or all if "See More" is clicked */}
          {uniqueTags.slice(0, showAllTags ? uniqueTags.length : 15).map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagClick(tag)}
              color={activeTag === tag ? "primary" : "default"}
              variant={activeTag === tag ? "filled" : "outlined"}
              clickable
            />
          ))}
          {uniqueTags.length > 15 && (
            <Chip
              label={showAllTags ? "See Less" : "See More"}
              onClick={handleSeeMoreTags}
              color="primary"
              variant="outlined"
              clickable
              sx={{ border: 'none' }}
            />
          )}
        </Box>
      )}

      <Box sx={{ p: 2 }}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
        >
          {images.map((image, index) => (
            <Box
              key={`${image.id}-${index}`}
              ref={images.length === index + 1 ? lastImageElementRef : null}
              className="masonry-grid-item"
              sx={{ p: 1 }}
            >
              <ImageCard
                image={image}
                onDelete={() => handleDeleteImage(image.id)}
                onPreviewClick={handleImagePreview}
              />
            </Box>
          ))}
        </Masonry>

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }} ref={loadingRef}>
            <CircularProgress color="primary" />
          </Box>
        )}
      </Box>

      <ImagePreviewModal
        open={!!selectedImage}
        image={selectedImage}
        onClose={handleClosePreview}
        images={images}
        onTagClick={handleTagClick}
      />
    </>
  )
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
