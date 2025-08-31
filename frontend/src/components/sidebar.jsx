'use client';
import { Box, Typography, Divider, Stack, TextField } from "@mui/material";
import UserCard from "./userChatCard";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { GETUSERS_API } from "@/apis";
import { useRouter } from "next/navigation";

const SideBar = () => {
    const router = useRouter();
    const [list, setList] = useState([]);
    const [constList, setConstLint] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const resp = await axios.get(GETUSERS_API, {
                    headers: { token: localStorage.getItem("token") },
                });
                setConstLint(resp.data.user);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!search.length) {
            setList([...constList]);
        } else {
            const newList = constList.filter((i) => i.name.includes(search));
            setList([...newList]);
        }
    }, [search, constList]);

    const [width, setWidth] = useState(280); // initial width
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);

    const handleMouseDown = (e) => {
        isResizing.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX; // distance from left edge
        if (newWidth >= 200 && newWidth <= 600) { // min/max width
            setWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    return (
        <Box
            ref={sidebarRef}
            sx={{
                background: "linear-gradient(180deg, #141414 0%, #1b1b1b 100%)",
                height: "100vh",
                width: `${width}px`,
                padding: "16px",
                borderRight: "1px solid #333",
                display: "flex",
                flexDirection: "column",
                fontFamily: "'Montserrat', sans-serif",
                position: "relative",
            }}
        >
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#e50914", letterSpacing: 1 }}>
                    Chat
                </Typography>
                <LogoutIcon sx={{ cursor: "pointer", color: "#e50914" }} onClick={() => router.push('/')} />
            </Stack>

            <Divider sx={{ borderColor: "#333", mb: 2 }} />

            {/* Search */}
            <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                    backgroundColor: "#2a2a2a",
                    borderRadius: "8px",
                    input: { color: "white" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#e50914" },
                    "& .MuiInputBase-input::placeholder": { color: "#aaa", opacity: 1 },
                    mb: 2,
                }}
            />

            <Divider sx={{ borderColor: "#333", mb: 2 }} />

            {/* Users List */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
                {list.sort((a,b)=>a.name.localeCompare(b.name)).map((i) => (
                    <UserCard key={i._id} item={i}>{i.name}</UserCard>
                ))}
            </Box>

            {/* Drag handle */}
            <Box
                onMouseDown={handleMouseDown}
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "100%",
                    width: "5px",
                    cursor: "ew-resize",
                    zIndex: 10,
                }}
            />
        </Box>
    );
};

export default SideBar;
