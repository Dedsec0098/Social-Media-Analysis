import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Grid, 
  Box, 
  Chip,
  CircularProgress 
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

const TopUsers = () => {
  const { getTopUsers, loading, error } = useData();
  const topUsers = getTopUsers(5);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <Typography color="error" variant="h6">
          Error loading data: {error}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Top Users
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        These users have the highest number of posts on the platform.
      </Typography>
      
      <Grid container spacing={3}>
        {topUsers.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                border: index === 0 ? '2px solid gold' : 'none',
                boxShadow: index === 0 ? '0 0 15px rgba(255, 215, 0, 0.5)' : '',
              }}
            >
              {index === 0 && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: -15, 
                    right: -15, 
                    bgcolor: 'gold',
                    color: 'white',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  <TrophyIcon />
                </Box>
              )}
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={user.avatar} 
                  alt={user.name}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <Typography variant="h5" component="div" gutterBottom align="center">
                  {user.name}
                </Typography>
                <Chip 
                  label={`${user.postCount} posts`}
                  color={index === 0 ? "primary" : "default"}
                  variant={index === 0 ? "filled" : "outlined"}
                />
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Rank: #{index + 1}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TopUsers;