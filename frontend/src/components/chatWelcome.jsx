import { Stack, Typography } from "@mui/material";

const Welcome = () => {
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
                height: "100vh",
                width: "100%",
                background: "linear-gradient(135deg, #141414, #1a1a1a)", // darker gradient for distinction
                color: "white",
                textAlign: "center",
            }}
        >
            <Typography
                variant="h2"
                sx={{
                    fontWeight: 700,
                    color: "#e50914", // Netflix red
                    textShadow: "0px 0px 12px rgba(229,9,20,0.8)",
                    mb: 2,
                }}
            >
                Start Conversation
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#b3b3b3" }}>
                Select a user from the sidebar to begin chatting 💬
            </Typography>
        </Stack>
    );
};

export default Welcome;
