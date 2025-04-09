import { Box, Button, Container, Typography } from "@mui/material"
import Link from "next/link"

export default function NotFound() {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "70vh",
                    textAlign: "center",
                    py: 8,
                }}
            >
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: "600px" }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </Typography>
                <Button component={Link} href="/" variant="contained" size="large">
                    Go to Homepage
                </Button>
            </Box>
        </Container>
    )
}

