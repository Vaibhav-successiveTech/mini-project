import { Box, Toolbar, AppBar, Avatar, Typography, TextField, Stack, IconButton } from "@mui/material";
import MessageBox from "./messagebox";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { fetchMessages, sendMessage, subscription } from "@/graphql/query.js";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import emoji picker (avoids SSR issues)
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const ChatScreen = ({ id, name }) => {
    const userId = jwtDecode(localStorage.getItem("token")).id;
    const [list, setList] = useState([]);
    const [message, setMessage] = useState("");
    const [avatar, setAvatar] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const router = useRouter();
    const inputRef = useRef(null);

    const { data, loading, refetch } = useQuery(fetchMessages, {
        variables: { getMessagesSender2: id, getMessagesReceiver2: userId },
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (id) {
            refetch({ getMessagesSender2: id, getMessagesReceiver2: userId });
        }
    }, [id, userId, refetch]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await axios.get(`http://localhost:5000/api/users/${id}`, {
                    headers: { token: localStorage.getItem('token') }
                });
                setAvatar(user.data.user.avatar);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchUser();
    }, [id]);

    let [send] = useMutation(sendMessage);
    const { data: subdata } = useSubscription(subscription);

    useEffect(() => {
        if (subdata?.messageSent) {
            setList((prev) => [...prev, subdata.messageSent]);
        }
    }, [subdata]);

    useEffect(() => {
        if (data?.getMessages) {
            setList(data.getMessages);
        }
    }, [data]);

    const handleSend = () => {
        if (message.trim() === "") return;
        send({ variables: { sender: userId, receiver: id, text: message } });
        setMessage("");
    };

    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
        inputRef.current.focus();
    };

    if (loading) return <>Loading .....</>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Top Bar */}
            <AppBar position="static" sx={{ backgroundColor: '#141414', boxShadow: '0' }}>
                <Toolbar>
                    <Avatar
                        onClick={() => router.push(`/profile/${id}`)}
                        src={avatar ? avatar : '/default-avatar.png'}
                        sx={{
                            width: '32px',
                            height: '32px',
                            marginRight: 2,
                            cursor: "pointer",
                            "&:hover": { opacity: 0.8 },
                        }}
                    />
                    <Typography color="white" variant="subtitle1">{name}</Typography>
                </Toolbar>
            </AppBar>

            {/* Chat Messages */}
            <Box
                sx={{
                    flex: 1,
                    padding: '10px',
                    overflowY: 'auto',
                    backgroundColor: '#000',
                    "&::-webkit-scrollbar": { display: "none" },
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                }}
            >
                {[...list].sort((a, b) => Number(a.createdAt) - Number(b.createdAt)).map((i, idx) => (
                    <MessageBox
                        key={idx}
                        text={i?.text}
                        time={new Date(Number(i.createdAt)).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                        direction={i?.sender?.id === userId ? 'end' : 'start'}
                    />
                ))}
            </Box>

            {/* Input Box */}
            <Stack direction="row" alignItems="center" sx={{ p: 1, backgroundColor: "#141414", position: "relative" }}>
                <IconButton
                    sx={{ color: "#e50914" }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <InsertEmoticonIcon />
                </IconButton>

                <TextField
                    placeholder="Enter message"
                    variant="outlined"
                    fullWidth
                    size="small"
                    multiline
                    maxRows={4}
                    inputRef={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    sx={{
                        backgroundColor: "#2a2a2a",
                        borderRadius: "8px",
                        input: { color: "white" },
                        textarea: { color: "white" },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                    }}
                />
                <SendIcon
                    fontSize="large"
                    sx={{ color: "#e50914", cursor: "pointer", ml: 1 }}
                    onClick={handleSend}
                />

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <Box sx={{ position: "absolute", bottom: 50, left: 10, zIndex: 1000 }}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </Box>
                )}
            </Stack>
        </Box>
    );
};

export default ChatScreen;
