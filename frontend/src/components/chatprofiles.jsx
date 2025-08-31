import { Card, Grid, Avatar, Typography, Paper } from "@mui/material";

const profiles = [
    { id: 1, name: "Alice", img: "/alice.jpg" },
    { id: 2, name: "Bob", img: "/bob.jpg" },
    { id: 3, name: "Charlie", img: "/charlie.jpg" },
    { id: 4, name: "Diana", img: "/diana.jpg" },
    { id: 5, name: "Eve", img: "/eve.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
    { id: 6, name: "Frank", img: "/frank.jpg" },
];

export default function ProfileGrid() {
    return (
        <Grid
            container
            spacing={2} // smaller spacing between rows/columns
            sx={{
                p: 2,
                bgcolor: "#141414", // Netflix black
                minHeight: "100vh",
            }}
        >
            {profiles.map((profile, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            p: 3, // more padding inside card
                            borderRadius: 3,
                            backgroundColor: "#1e1e1e",
                            border: "1px solid #2c2c2c",
                            boxShadow: "0 6px 14px rgba(0,0,0,0.6)",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                transform: "scale(1.08)",
                                borderColor: "#e50914",
                                boxShadow: "0 8px 20px rgba(229, 9, 20, 0.5)",
                            },
                            height: 220, // bigger card height
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: "#e50914",
                                fontSize: "2.2rem",
                                fontWeight: "bold",
                                color: "white",
                                mb: 2,
                            }}
                        >
                            {profile.name.charAt(0)}
                        </Avatar>
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            sx={{ color: "white" }}
                        >
                            {profile.name}
                        </Typography>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
