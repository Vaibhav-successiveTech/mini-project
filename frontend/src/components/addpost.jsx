'use client'
import { useState } from "react";
import { Modal, Box, TextField, Stack, Button, IconButton, Fade, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@apollo/client/react";
import { sendPost } from "@/graphql/query";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Emoji Picker
import Picker from 'emoji-picker-react';

const AddPost = ({ open, onClose, postCardWidth = 800 }) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [sendPostMutation] = useMutation(sendPost);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = async () => {
        if (!image) return null;
        const formData = new FormData();
        formData.append("image", image);
        const res = await axios.post("http://localhost:5000/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.url;
    };

    const handleSubmit = async () => {
        if (!text.trim() && !image) return;

        try {
            const uploadedUrl = await handleImageUpload();

            await sendPostMutation({
                variables: {
                    userId: jwtDecode(localStorage.getItem("token")).id,
                    text,
                    avatar: uploadedUrl,
                },
            });

            setText("");
            setImage(null);
            setPreview(null);
            setShowEmoji(false);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Fade in={open}>
                <Box sx={{ mt: 8, mx: "auto", backgroundColor: "#1e1e1e", p: 3, borderRadius: "12px", width: postCardWidth, position: 'relative' }}>
                    <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "white" }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" color="white">Create Post</Typography>

                    <TextField
                        placeholder="What's on your mind?"
                        multiline
                        rows={3}
                        fullWidth
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        sx={{
                            mt: 2,
                            backgroundColor: "#2a2a2a",
                            borderRadius: "8px",
                            "& .MuiInputBase-input": { color: "white" },
                            "& .MuiInputBase-input::placeholder": { color: "white", opacity: 1 },
                        }}
                    />

                    {/* Emoji Button */}
                    <Button
                        onClick={() => setShowEmoji(!showEmoji)}
                        sx={{ mt: 1, color: 'white', textTransform: 'none' }}
                    >
                        {showEmoji ? "Close Emoji" : "Add Emoji"}
                    </Button>

                    {showEmoji && (
                        <Box sx={{ mt: 1 }}>
                            <Picker
                                onEmojiClick={(event, emojiObject) => setText(prev => prev + emojiObject.emoji)}
                            />
                        </Box>
                    )}

                    {preview && <Box sx={{ mt: 2 }}><img src={preview} alt="preview" style={{ maxHeight: 250, width: "100%", objectFit: "cover" }} /></Box>}

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button component="label" variant="outlined" sx={{ color: "white", borderColor: "gray" }}>
                            Upload Image
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                        <Button variant="contained" color="error" onClick={handleSubmit}>Post</Button>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AddPost;
