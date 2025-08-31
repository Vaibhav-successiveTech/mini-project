'use client';
import { Button, TextField, Alert, Box, Stack, Typography, Card } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { LOGIN_API } from '../apis';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(200);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post(LOGIN_API, { email, password });
      localStorage.setItem('token', res.data.token);
      setStatus(200);
      router.push('/Home');
    } catch (err) {
      console.error(err);
      setStatus(400);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#121212', // dark background
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
          bgcolor: '#1e1e1e', // dark card background
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            sx={{ color: '#fff', fontWeight: 700, letterSpacing: 0.5 }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ color: '#bbb' }}>
            Please log in to continue
          </Typography>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            sx={{
              bgcolor: '#2a2a2a',
              borderRadius: 2,
              input: { color: '#fff' },
              label: { color: '#aaa' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': {
                  borderColor: '#d32f2f',
                  boxShadow: '0 0 5px rgba(211, 47, 47, 0.6)',
                },
              },
            }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
            sx={{
              bgcolor: '#2a2a2a',
              borderRadius: 2,
              input: { color: '#fff' },
              label: { color: '#aaa' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#d32f2f' },
                '&.Mui-focused fieldset': {
                  borderColor: '#d32f2f',
                  boxShadow: '0 0 5px rgba(211, 47, 47, 0.6)',
                },
              },
            }}
            InputLabelProps={{ shrink: true }}
          />

          {/* 🔴 Red Accent Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              py: 1.75,
              fontWeight: 'bold',
              borderRadius: 3,
              textTransform: 'none',
              backgroundColor: '#d32f2f',
              boxShadow: '0 4px 15px rgba(211, 47, 47, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.6)',
                backgroundColor: '#b71c1c',
              },
            }}
            onClick={handleLogin}
            aria-label="Log in"
          >
            Log In
          </Button>

          {status === 400 && (
            <Alert severity="error" variant="outlined" aria-live="assertive">
              Invalid email or password. Please try again.
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Typography sx={{ color: '#aaa' }} variant="body2">
              Don't have an account?
            </Typography>
            <Link href="/register" passHref legacyBehavior>
              <Typography
                component="a"
                sx={{
                  color: '#d32f2f',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign Up
              </Typography>
            </Link>
          </Box>
        </Stack>
      </Card>
    </Box>


  );
};

export default LoginComponent;