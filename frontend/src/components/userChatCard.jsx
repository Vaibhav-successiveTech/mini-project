import { Stack, Avatar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const UserCard = ({ item: { _id, name, avatar } }) => {
    const router = useRouter();
    const [imgSrc, setImgSrc] = useState("");

    useEffect(() => {
        if (!avatar) {
            setImgSrc('/default-avatar.png');
        } else if (avatar.startsWith("blob:") || avatar.startsWith("http")) {
            setImgSrc(avatar);
        } else {
            setImgSrc(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${avatar}`);
        }
    }, [avatar, name]);

    return (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
                py: 1.2,
                px: 1.5,
                borderRadius: "10px",
                transition: "0.2s ease",
                "&:hover": {
                    backgroundColor: "#272727", // ✅ YouTube-style hover (subtle gray highlight)
                    cursor: "pointer",
                },
            }}
            onClick={() => router.push(`/Chats/${_id}/${encodeURIComponent(name)}`)}
        >
            <Avatar
                src={avatar?avatar:'/default-avatar.png'}
                sx={{
                    width: "36px",
                    height: "36px",
                    border: "2px solid #2c2c2c", // ✅ neutral border
                }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "white" }}>
                {name}
            </Typography>
        </Stack>
    );
};


export default UserCard;
