"use client";

import type React from "react";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  InputBase,
  Box,
  IconButton,
  Button,
  Tooltip,
  Container,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useThemeContext } from "@/contexts/theme-context";
import ImageUploadForm from "./image-upload-form";
import Image from "next/image";
import logo from "../../public/images/logo.png";
import { DarkMode, LightMode } from "@mui/icons-material";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  borderColor: (theme.palette || theme).divider,
  // padding: '4px 12px',
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 24,
  backgroundColor: alpha(theme.palette.common.black, 0.3),
  // "&:hover": {
  //   backgroundColor: alpha(theme.palette.common.black, 0.12),
  // },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
    },
  },
}));

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { mode, toggleColorMode } = useThemeContext();

  // const pathname = usePathname()
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleMenuClose = () => {
  //   setAnchorEl(null)
  // }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    } else {
      router.push("/");
    }
  };

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="xl">
          <StyledToolbar
            variant="dense"
            disableGutters
            sx={{ padding: { sm: "4px 12px", xs: "8px 0px" } }}
          >
            <Link href="/" className="min-w-9 sm:w-[50px] mr-1 sm:mr-0">
              <Image
                src={logo}
                alt="Logo"
                width={80}
                height={80}
                className="size-9 sm:size-[50px]"
              />
            </Link>

            {/* {isMobile ? (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            ) : null} */}

            {/* <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose} component={Link} href="/">
                Home
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  handleUploadClick()
                }}
              >
                Upload Images
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  toggleColorMode()
                }}
              >
                {mode === "dark" ? "Light Mode" : "Dark Mode"}
              </MenuItem>
            </Menu> */}

            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{ flexGrow: 1, display: "flex" }}
            >
              <Search
                sx={{
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(0, 0, 0, 0.3)"
                      : "rgba(0, 0, 0, 0.12)",
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search images..."
                  inputProps={{ "aria-label": "search" }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </Search>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
                <IconButton
                  size="medium"
                  sx={{
                    border: "1px solid",
                    borderColor:
                      mode === "dark"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.2)",
                    borderRadius: 1.5,
                    p: { sm: "6px 8px", xs: "4px" },
                  }}
                  onClick={toggleColorMode}
                  color="inherit"
                >
                  {mode === "dark" ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>

              {/* <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <Badge badgeContent={3} color="primary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip> */}

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  ml: 1,
                  borderRadius: 1.5,
                }}
                onClick={handleUploadClick}
              >
                Upload
              </Button>

              <IconButton
                edge="end"
                color="primary"
                aria-label="upload"
                onClick={handleUploadClick}
                sx={{
                  display: { xs: "flex", sm: "none" },
                  ml: 1,
                  mr: 1,
                  borderRadius: 1.5,
                  p: { sm: "6px 8px", xs: "4px" },
                  border: "1px solid",
                }}
              >
                <AddIcon />
              </IconButton>

              {/* <Avatar sx={{ width: 32, height: 32, ml: 1 }}>U</Avatar> */}
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>

      {uploadModalOpen && (
        <ImageUploadForm
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />
      )}
    </>
  );
}
