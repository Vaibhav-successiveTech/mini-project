'use client';
import { Box, Stack, Button, Typography, TextField, Alert, Card } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { REGISTER_API } from '@/apis';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Register = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(200);

    const handleClick = async () => {
        try {
            const resp = await axios.post(REGISTER_API, { name, email, password });
            localStorage.setItem('token', resp.data.token);
            setStatus(200);
            router.push('/Home');

        } catch (error) {
            console.error(error.message);
            setStatus(400);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#121212', // Dark background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
            }}
        >
            <Card
                elevation={6}
                sx={{
                    p: 5,
                    width: { xs: '100%', sm: 420 },
                    borderRadius: 3,
                    bgcolor: '#1e1e1e', // Dark card
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)',
                }}
            >
                <Stack spacing={3}>
                    <Typography
                        textAlign="center"
                        variant="h4"
                        sx={{ color: '#fff', fontWeight: 700, letterSpacing: 0.5 }}
                    >
                        Register
                    </Typography>

                    <TextField
                        required
                        type="text"
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        aria-label="Name"
                        sx={{
                            bgcolor: '#2a2a2a',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#444',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#f44336',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#f44336',
                                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.5)',
                                },
                            },
                            input: { color: '#fff' },
                            label: { color: '#aaa' },
                        }}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        required
                        type="email"
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email"
                        sx={{
                            bgcolor: '#2a2a2a',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#444',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#f44336',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#f44336',
                                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.5)',
                                },
                            },
                            input: { color: '#fff' },
                            label: { color: '#aaa' },
                        }}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        required
                        type="password"
                        label="Password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-label="Password"
                        sx={{
                            bgcolor: '#2a2a2a',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#444',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#f44336',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#f44336',
                                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.5)',
                                },
                            },
                            input: { color: '#fff' },
                            label: { color: '#aaa' },
                        }}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClick}
                        sx={{
                            py: 1.75,
                            fontWeight: 'bold',
                            borderRadius: 3,
                            textTransform: 'none',
                            boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(244, 67, 54, 0.6)',
                                backgroundColor: '#d32f2f',
                            },
                        }}
                        fullWidth
                        aria-label="Register"
                    >
                        Register
                    </Button>

                    {status !== 200 && (
                        <Alert severity="error" variant="outlined" aria-live="assertive">
                            Please enter valid information.
                        </Alert>
                    )}
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, gap: 1 }}>
                    <Typography sx={{ color: '#aaa' }} variant="body2">
                        Already have an account?
                    </Typography>
                    <Link href="/login" passHref legacyBehavior>
                        <Typography
                            component="a"
                            sx={{
                                color: '#f44336',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            Login
                        </Typography>
                    </Link>
                </Box>
            </Card>
        </Box>
    );


};

export default Register;