"use client"

import { Box, Container, Typography, Link, Grid, Divider, useTheme } from "@mui/material"

export default function Footer() {
  const theme = useTheme()

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.05)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              ImageGallery
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A beautiful place to store and share your images
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Features
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Upload Images
            </Link>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Search Gallery
            </Link>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Organize Collections
            </Link>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Help Center
            </Link>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Privacy Policy
            </Link>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Terms of Service
            </Link>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Email: support@imagegallery.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +1 (123) 456-7890
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {"© "}
          {new Date().getFullYear()}{" "}
          <Link color="inherit" href="/">
            ImageGallery
          </Link>
          {". All rights reserved."}
        </Typography>
      </Container>
    </Box>
  )
}

