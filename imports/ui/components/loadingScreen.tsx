import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingScreen = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
        </Box>
    );
}

export { LoadingScreen };