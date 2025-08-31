import { Typography, Box } from "@mui/material";

const MessageBox = ({ text, time, direction }) => {
    const isSender = direction === "end";

    return (
        <Box
            display="flex"
            justifyContent={direction}
            sx={{ mb: 1, px: 1 }}
        >
            <Box
                sx={{
                    backgroundColor: isSender ? "#e50914" : "#1c1c1c", // Netflix red for sender, dark gray for receiver
                    color: "white",
                    maxWidth: "70%",
                    borderRadius: isSender
                        ? "16px 16px 0px 16px"
                        : "16px 16px 16px 0px",
                    p: 1.5,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{ wordBreak: "break-word" }}
                >
                    {text}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        textAlign: "right",
                        mt: 0.5,
                        color: "rgba(255,255,255,0.7)",
                    }}
                >
                    {time}
                </Typography>
            </Box>
        </Box>
    );
};

export default MessageBox;
