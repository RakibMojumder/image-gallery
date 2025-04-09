import { Suspense } from "react"
import { Box, Container, Typography, Skeleton } from "@mui/material"
import ImageGallery from "@/components/image-gallery"
import { getImages, initializeSampleImages } from "@/lib/actions"

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string } | null> }) {
  // Initialize sample images
  await initializeSampleImages()

  // Get images based on search query
  const searchQuery = (await searchParams)?.q || ""
  const result = await getImages(1, 12, searchQuery)

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {searchQuery && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h1">
            Search results for: <strong style={{ color: "#F20091" }}>{searchQuery}</strong>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Found {result.total} {result.total === 1 ? "image" : "images"}
          </Typography>
        </Box>
      )}

      <Suspense fallback={<ImageGallerySkeleton />}>
        <ImageGallery
          initialImages={result.images}
          initialHasMore={result.hasMore}
          searchQuery={searchQuery}
        />
      </Suspense>
    </Container>
  )
}

function ImageGallerySkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 2 }}>
        {Array.from(new Array(12)).map((_, index) => (
          <Box key={index} sx={{ p: 1 }}>
            <Skeleton variant="rectangular" height={index % 2 === 0 ? 200 : 300} sx={{ borderRadius: 2 }} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}