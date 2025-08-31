'use client'
import { use, useEffect, useState } from "react";
import { GETCOMMENTS_API } from "@/apis";
import axios from "axios";
import {
    Box, Stack, Typography, Avatar, IconButton,
    TextField, Button, Divider, Drawer, List, ListItem, ListItemAvatar, ListItemText, Modal, Fade
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import AddPost from "./addpost";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { getPost, postSubscription, getLikes, postLike, likeSubscription, sendPost } from "@/graphql/query";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Picker from 'emoji-picker-react';
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EmojiPicker from "emoji-picker-react";

// Format "time ago" helper
const formatTimeAgo = (date) => { const now = new Date(); const postDate = date; const diff = Math.floor((now - postDate) / 1000); if (diff < 60) return `${ diff }s ago`; if (diff < 3600) return `${ Math.floor(diff / 60) }m ago`; if (diff < 86400) return `${ Math.floor(diff / 3600) }h ago`; return `${ Math.floor(diff / 86400) }d ago`; };

// PostCard Component
const PostCard = ({ post, onOpenComments }) => {
    const [liked, setLiked] = useState(false);
    const [userId, setUserId] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setUserId(jwtDecode(localStorage.getItem('token')).id);
    }, []);

    const { data: likes } = useQuery(getLikes, { variables: { postId: post.id } });
    useEffect(() => {
        if (likes) {
            setLikeCount(likes.getLikes?.length);
            setLiked(likes.getLikes.some(u => u.id === userId));
        }
    }, [likes, userId]);

    const [sendLike] = useMutation(postLike);
    const { data: subData } = useSubscription(likeSubscription, { variables: { likesPostId2: post.id } });
    useEffect(() => {
        if (subData?.likes) {
            setLikeCount(subData.likes.likes.length);
            setLiked(subData.likes.likes.some(u => u.id === userId));
        }
    }, [subData]);

    return (
        <Box sx={{
            position: 'relative',
            backgroundColor: "#1e1e1e",
            color: "white",
            borderRadius: "12px",
            padding: "20px",
            mb: 3,
            boxShadow: "0 0 15px rgba(255,255,255,0.15)",
            "&:hover": { boxShadow: "0 0 25px rgba(255,255,255,0.25)" },
            maxWidth: "900px",
            width: "90%",
            margin: "0 auto",
            transition: "box-shadow 0.3s ease"
        }}>
            {/* User Info */}
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                    onClick={() => router.push(`/profile/${post.user.id}`)}
                    src={post.user?.avatar || '/default-avatar.png'}
                    sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                />
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{post.user?.name}</Typography>
                    <Typography variant="caption" color="gray">{formatTimeAgo(Number(post.date))}</Typography>
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
                        width={780}
                        height={400}
                        style={{ objectFit: "cover", borderRadius: "12px" }}
                    />
                </Box>
            )}

            {/* Like & Comment */}
            <Stack direction="row" spacing={2} mt={2}>
                <IconButton onClick={() => sendLike({ variables: { postId: post.id, userId } })}>
                    {liked ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon sx={{ color: "white" }} />}
                    <Typography variant="caption" sx={{ ml: 0.5, color: "white" }}>{likeCount}</Typography>
                </IconButton>
                <IconButton sx={{ color: "white" }} onClick={() => onOpenComments(post)}>
                    <ChatBubbleOutlineIcon />
                </IconButton>
            </Stack>
        </Box>
    );
};

// HomePage Component
const HomePage = () => {
    const [open, setOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [list, setList] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [addPostText, setAddPostText] = useState("");
    const [showAddEmoji, setShowAddEmoji] = useState(false);

    const { data: post } = useQuery(getPost);
    useEffect(() => {
        if (post) setList(post.getPosts);
    }, [post]);


    const fetchComments = async (postId) => {
        try {
            const res = await axios.get(`${GETCOMMENTS_API}${postId}/comment`, {
                headers: { token: localStorage.getItem("token") },
            });
            setComments(res.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        } catch (err) { console.error(err); }
    };

    const handleOpenComments = (post) => { setSelectedPost(post); fetchComments(post.id); setOpen(true); };
    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await axios.put(
                `${GETCOMMENTS_API}${selectedPost.id}/comment`,
                { text: newComment },
                { headers: { token: localStorage.getItem("token") } }
            );
            setComments(prev => [...prev, res.data]);
            setNewComment("");
            setOpen(false);
        } catch (err) { console.error(err); }
    };

    const handleAddPost = async () => {
        if (!addPostText.trim()) return;
        // Add your mutation/API call for creating post here
        setAddPostText("");
        setShowAddEmoji(false);
        setAddOpen(false);
    };
    const handleEmojiClick = (emojiData, setText) => {
        setText(prev => prev + emojiData.emoji);
    };

    const { data: subData } = useSubscription(postSubscription);
    useEffect(() => { if (subData) setList([...list, subData.post]); }, [subData]);

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#141414", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <Box sx={{ flex: 1, display: "flex", justifyContent: "center", overflow: "hidden", p: 3 }}>
                    <Box sx={{ width: "100%", maxWidth: "900px", display: "flex", flexDirection: "column", flex: 1 }}>
                        {/* Header */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexShrink: 0 }}>
                            <Typography variant="h4" color="white">Home</Typography>
                            <Button
                                variant="contained"
                                onClick={() => setAddOpen(true)}
                                sx={{ bgcolor: "#e50914", textTransform: "none", fontWeight: "bold", "&:hover": { bgcolor: "#b20710" } }}
                            >Add Post+</Button>
                        </Box>

                        {/* Add Post Modal */}
                        <AddPost open={addOpen} onClose={() => setAddOpen(false)} postCardWidth={800} />

                        {/* Scrollable posts */}
                        <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3, pr: 1, mx: 'auto', scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
                            {[...list].sort((a, b) => new Date(Number(b.date)) - new Date(Number(a.date))).map((post, idx) => (
                                <PostCard key={idx} post={post} onOpenComments={handleOpenComments} />
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* Comments Drawer */}
                <Drawer
                    anchor="right"
                    open={open}
                    onClose={() => setOpen(false)}
                    PaperProps={{ sx: { width: 500, backgroundColor: "#1e1e1e", color: "white" } }}
                >
                    {selectedPost && (
                        <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                            <Typography variant="h6" mb={1}>{selectedPost.user?.name}'s Post</Typography>
                            <Divider sx={{ backgroundColor: "gray", mb: 2 }} />
                            <List sx={{ flex: 1, overflowY: "auto" }}>
                                {comments.map(comment => (
                                    <Box key={comment._id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar src={comment.user?.avatar} alt={comment.user?.name} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={comment.user?.name}
                                                secondary={comment.text}
                                                primaryTypographyProps={{ fontSize: 12, fontWeight: "bold", color: "white" }}
                                                secondaryTypographyProps={{ fontSize: 16, color: "white" }}
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" sx={{ borderColor: "#333" }} />
                                    </Box>
                                ))}
                            </List>

                            {/* Comment Input */}
                            <Divider sx={{ backgroundColor: "gray", mb: 1 }} />
                            <Stack direction="row" spacing={1} sx={{ position: "relative" }}>
                                <IconButton sx={{ color: "#e50914" }} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <InsertEmoticonIcon />
                                </IconButton>
                                <TextField
                                    placeholder="Write a comment..."
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    sx={{
                                        backgroundColor: "#2a2a2a",
                                        borderRadius: "8px",
                                        input: { color: "white" },
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handlePostComment();
                                        }
                                    }}
                                />
                                <Button variant="contained" color="error" onClick={handlePostComment}>
                                    Post
                                </Button>

                                {showEmojiPicker && (
                                    <Box sx={{ position: "absolute", bottom: 50, left: 0, zIndex: 1000 }}>
                                        <EmojiPicker
                                            onEmojiClick={(emojiData) => {
                                                setNewComment(prev => prev + emojiData.emoji);
                                            }}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    )}
                </Drawer>
            </Box>
        </Box>
    );
};

export default HomePage;
