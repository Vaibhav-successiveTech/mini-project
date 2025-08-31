'use client'
import { Box } from "@mui/material";
import SideBar from "../components/globalsidebar";

export default function GlobalLayout({ children }) {
  return (
    <Box display="flex" height="100vh" width="100vw" overflow="hidden">
      {/* Sidebar fixed width */}
      <SideBar />

      {/* Chat area fills rest */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        sx={{
          backgroundColor: "#141414", // Netflix-style dark bg
          overflow: "hidden", // prevent inner scroll issues
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
