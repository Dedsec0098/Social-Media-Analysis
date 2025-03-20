import React, { useState, useEffect } from 'react';
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
  CardHeader,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { 
  Comment as CommentIcon, 
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const Feed = () => {
  const { getFeedPosts, users, loading, error, refreshData } = useData();
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const feedPosts = getFeedPosts();
  
  // Function to handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setLastRefreshed(new Date());
    setIsRefreshing(false);
  };
  
  // Auto-refresh the feed every minute
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000); // 1 minute
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading && feedPosts.length === 0) {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Feed
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{ mr: 2 }}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Typography variant="caption" color="text.secondary">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>
      
      {isRefreshing && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      <Grid container spacing={3}>
        {feedPosts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar src={post.userAvatar} alt={users[post.userId] || `User ${post.userId}`} />
                }
                title={users[post.userId] || `User ${post.userId}`}
                subheader={new Date(post.timestamp).toLocaleString()}
              />
              <CardMedia
                component="img"
                height="300"
                image={post.imageUrl}
                alt="Post image"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {post.body}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    icon={<CommentIcon />} 
                    label={`${post.commentCount} comments`}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                </Box>
                
                {post.comments && post.comments.length > 0 && (
                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="comments-content"
                      id="comments-header"
                    >
                      <Typography>View Comments ({post.comments.length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {post.comments.map((comment, index) => (
                        <Box key={comment.id} sx={{ mb: 2 }}>
                          {index > 0 && <Divider sx={{ my: 2 }} />}
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <Avatar 
                              src={`https://i.pravatar.cc/150?img=${comment.id % 70}`} 
                              alt={comment.name}
                              sx={{ width: 32, height: 32, mr: 1 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">{comment.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {comment.email}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2">{comment.body}</Typography>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Feed;