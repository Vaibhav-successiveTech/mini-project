'use client'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Avatar, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import EditNoteIcon from '@mui/icons-material/EditNote';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { GETUSER_API } from "@/apis";

export default function Sidebar() {
    const router = useRouter();
    const [user, setUser] = useState({});

    const [drawerWidth, setDrawerWidth] = useState(280);
    const resizerRef = useRef(null);
    const isResizing = useRef(false);

    const handleMouseDown = () => {
        isResizing.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 500) {
            setDrawerWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = jwtDecode(token).id;
        const fetchUser = async () => {
            try {
                const user = await axios.get(`${GETUSER_API}${userId}`, {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                })
                setUser(user.data.user);
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser();
    }, []);


    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    bgcolor: "#141414",
                    color: "white",
                    borderRight: "1px solid #2c2c2c",
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "'Montserrat', sans-serif",
                    position: "relative",
                    boxShadow: "2px 0 8px rgba(0,0,0,0.6)",
                },

            }}
        >
            {/* User section */}
            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderBottom: "1px solid #2c2c2c",
                    gap: 2,
                }}
            >
                <Avatar
                    sx={{
                         width: 72, height: 72, fontSize: 28, cursor: "pointer",
                        transition: "0.2s",
                        "&:hover": {
                            opacity: 0.8,
                        },
                    }}
                    onClick={() => router.push(`/profile/${user._id}`)}
                    src={
                        user?.avatar
                            ? user.avatar
                            : '/default-avatar.png'
                    }
                />
                <Typography variant="h6" fontWeight={600}>
                    {user?.name || "User"}
                </Typography>
            </Box>

            {/* Navigation */}
            <List sx={{ flex: 1, overflowY: "auto" }}>
                {[
                    { text: "Home", icon: <HomeIcon /> },
                    { text: "Chats", icon: <ChatIcon /> },
                    { text: "MyPosts", icon: <EditNoteIcon /> },
                    { text: "Profile", icon: <AccountCircleIcon /> },
                ].map(({ text, icon }) => {
                    const isActive = router.pathname === `/${text}`; // check active
                    return (
                        <ListItem
                            button='true'
                            key={text}
                            sx={{
                                my: 0.5,
                                borderRadius: 2,
                                px: 2,
                                transition: "all 0.2s ease",
                                bgcolor: isActive ? "#2c2c2c" : "transparent",
                                "&:hover": {
                                    bgcolor: "#1f1f1f",
                                },
                            }}
                            onClick={() => {
                                if (text === "Profile") {
                                    router.push(`/profile/${user._id}`);
                                } else {
                                    router.push(`/${text}`);
                                }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: isActive ? "#e50914" : "#b0b0b0", // red only when active
                                    minWidth: 40,
                                }}
                            >
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={text}
                                primaryTypographyProps={{
                                    fontSize: 16,
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? "#fff" : "#ccc",
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>

            {/* Resizer */}
            <Box
                ref={resizerRef}
                onMouseDown={handleMouseDown}
                sx={{
                    width: "5px",
                    cursor: "col-resize",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "#e50914" },
                }}
            />
        </Drawer>


    );
}
