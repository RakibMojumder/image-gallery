import { createTheme, responsiveFontSizes } from "@mui/material/styles"
import type { PaletteMode } from "@mui/material"

// Create a theme instance
export const createAppTheme = (mode: PaletteMode) => {
  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#F20091", // Custom primary color
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#0076E6",
      },
      background: {
        default: mode === "light" ? "#f5f5f7" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },
    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            overflow: "hidden",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            backgroundImage: "none",
            overflowY: "unset",
          }
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  })

  // Make fonts responsive
  theme = responsiveFontSizes(theme)

  return theme
}

// Default light theme
const theme = createAppTheme("light")
export default theme

