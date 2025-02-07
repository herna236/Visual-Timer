import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Typography, Button, Box, Alert } from '@mui/material';

function LandingPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get('message');

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Visual Timer App
      </Typography>
      <Typography variant="body1" paragraph>
        This app is great for people who want to see a countdown with a mystery image!
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" component={Link} to="/sign-in">
          Sign In
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/sign-up">
          Sign Up
        </Button>
      </Box>

      {message && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">{message}</Alert>
        </Box>
      )}
    </Container>
  );
}

export default LandingPage;
