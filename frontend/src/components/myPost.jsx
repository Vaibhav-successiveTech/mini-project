'use client'

import { useState, useEffect } from "react";
import { Box, Stack, Avatar, Typography, IconButton, Button, Modal, TextField, } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};


const EditPostModal = ({ open, onClose, post, onSave, onDelete }) => {
    const [text, setText] = useState(post?.text || "");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(post?.avatar || "");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("text", text);
        if (imageFile) formData.append("image", imageFile);

        await onSave(post._id, formData);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    maxHeight: "80vh", // max height to allow scrolling
                    bgcolor: "#1e1e1e",
                    color: "white",
                    borderRadius: 2,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Scrollable Content */}
                <Box sx={{ overflowY: "auto", pr: 1, flex: 1 }}>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Edit Post</Typography>
                        <IconButton onClick={onClose} sx={{ color: "white" }}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    {/* Text Input */}
                    <TextField
                        multiline
                        rows={3}
                        fullWidth
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Edit your post"
                        sx={{
                            backgroundColor: "#2a2a2a",
                            borderRadius: "8px",
                            "& .MuiInputBase-input": {
                                color: "white",
                                "&::placeholder": {
                                    color: "white",
                                    opacity: 0.7,
                                },
                            },
                        }}
                    />

                    {/* File Input */}
                    <Box mt={2}>
                        <input
                            accept="image/*"
                            type="file"
                            id="file-upload"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        <label htmlFor="file-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                sx={{
                                    color: "white",
                                    borderColor: "#555",
                                    "&:hover": { borderColor: "#888", backgroundColor: "#2a2a2a" },
                                }}
                            >
                                Choose Image
                            </Button>
                        </label>
                    </Box>

                    {/* Preview */}
                    {preview && (
                        <Box sx={{ mt: 2, borderRadius: 1, overflow: "hidden" }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ width: "100%", objectFit: "cover", borderRadius: 8 }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
                    <Button variant="contained" color="error" onClick={() => onDelete(post._id)}>
                        Delete
                    </Button>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            sx={{
                                color: "#ccc",
                                borderColor: "#555",
                                "&:hover": { borderColor: "#888", backgroundColor: "#2a2a2a" },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{
                                backgroundColor: "#1976d2",
                                "&:hover": { backgroundColor: "#1565c0" },
                            }}
                        >
                            Save Changes
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};


export const MyPostCard = ({ post, onEdit }) => {
    return (
        <Box
            sx={{
                position: 'relative',
                backgroundColor: "#1e1e1e",
                color: "white",
                borderRadius: "12px",
                padding: "20px",
                mb: 3,
                boxShadow: "0 2px 8px rgba(255,255,255,0.1)", // subtle white shadow
                "&:hover": { boxShadow: "0 4px 16px rgba(255,255,255,0.2)" }, // brighter on hover
                width: 800,
                margin: "0 auto",
            }}
        >

            {/* Edit icon on top-right, visible on hover */}
            <IconButton
                onClick={() => onEdit(post)}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'red',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    '&:hover': { color: 'darkred' },
                    // Show icon on parent hover
                    '.MuiBox-root:hover &': { opacity: 1 },
                }}
            >
                <EditIcon />
            </IconButton>

            {/* User Info */}
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                    src={
                        post.user?.avatar
                            ? post.user.avatar
                            : `https://api.dicebear.com/9.x/initials/svg?seed=${post.user?.name}`
                    }
                />
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {post.user?.name}
                    </Typography>
                    <Typography variant="caption" color="gray">
                        {formatTimeAgo(new Date(post.date).getTime())}
                    </Typography>
                </Box>
            </Stack>

            {/* Post Text */}
            <Typography mt={2}>{post.text}</Typography>

            {/* Post Image */}
            {post.avatar && (
                <Box mt={3} sx={{ borderRadius: "12px", overflow: "hidden" }}>
                    <img
                        src={post.avatar}
                        alt="post"
                        width={780} // slightly smaller than card width
                        height={400}
                        style={{ objectFit: "cover", borderRadius: "12px" }}
                    />
                </Box>
            )}
        </Box>
    );
};

// MyPosts Page
const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleEdit = (post) => {
        setSelectedPost(post);
        setEditOpen(true);
    };

    const handleSavePost = async (postId, formData) => {
        try {
            const token = localStorage.getItem("token");
            console.log('formdata---', formData)
            const res = await axios.put(`http://localhost:5000/api/posts/${postId}`, formData, {
                headers: { token },
            });
            console.log(res);
            setPosts((prev) => prev.map(p => p._id === postId ? res.data : p));
            setEditOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/posts/${postId}`, { headers: { token } });
            setPosts((prev) => prev.filter(p => p._id !== postId));
            setEditOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/posts", {
                    headers: { token: localStorage.getItem("token") },
                });
                console.log(res.data);
                setPosts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPosts();
    }, []);

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#141414", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        overflow: "hidden",
                        p: 3,
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flex: 1,
                            gap: 3,
                            overflowY: "auto",
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": { display: "none" },
                        }}
                    >
                        <Typography variant="h4" color="white" mb={2}>
                            My Posts
                        </Typography>

                        {posts.length === 0 ? (
                            <Typography color="white">You haven't created any posts yet.</Typography>
                        ) : (
                            posts
                                .sort((a, b) => new Date(Number(b.date)) - new Date(Number(a.date)))
                                .map((post) => <MyPostCard key={post._id} post={post} onEdit={handleEdit} />)
                        )}
                        {selectedPost && (
                            <EditPostModal
                                open={editOpen}
                                onClose={() => setEditOpen(false)}
                                post={selectedPost}
                                onSave={handleSavePost}
                                onDelete={handleDeletePost}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MyPosts;
