import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Avatar, 
  Box, 
  Grid, 
  Chip,
  CircularProgress,
  CardHeader
} from '@mui/material';
import { Comment as CommentIcon, Whatshot as HotIcon } from '@mui/icons-material';

const TrendingPosts = () => {
  const { getTrendingPosts, users, loading, error } = useData();
  const trendingPosts = getTrendingPosts();
  
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <HotIcon color="error" sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h4">
          Trending Posts
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {trendingPosts.length > 1 
          ? `These ${trendingPosts.length} posts have the highest engagement with ${trendingPosts[0]?.commentCount} comments each.`
          : trendingPosts.length === 1 
            ? `This post has the highest engagement with ${trendingPosts[0]?.commentCount} comments.`
            : 'No trending posts available.'}
      </Typography>
      
      <Grid container spacing={3}>
        {trendingPosts.map((post) => (
          <Grid item xs={12} md={6} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                avatar={
                  <Avatar src={post.userAvatar} alt={users[post.userId] || `User ${post.userId}`} />
                }
                title={users[post.userId] || `User ${post.userId}`}
                subheader={new Date(post.timestamp).toLocaleString()}
              />
              <CardMedia
                component="img"
                height="200"
                image={post.imageUrl}
                alt="Post image"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {post.body}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Chip 
                    icon={<CommentIcon />} 
                    label={`${post.commentCount} comments`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrendingPosts;