import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../services/api';


const getRandomAvatar = (id) => {
  return `https://i.pravatar.cc/150?img=${id % 70}`;
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        

        const usersData = await apiService.getUsers();
        setUsers(usersData.users || {});
        
       
        const postsData = await apiService.getPosts();
        
        
        const processedPosts = await Promise.all(
          (postsData.posts || []).map(async (post) => {
          
            const commentsData = await apiService.getComments(post.id);
            
            return {
              ...post,
              comments: commentsData.comments || [],
              commentCount: (commentsData.comments || []).length,
              userAvatar: getRandomAvatar(post.userId),
              imageUrl: `https://picsum.photos/seed/${post.id}/800/400`
            };
          })
        );
        
        setPosts(processedPosts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
    

    const pollInterval = setInterval(() => {
      fetchNewPosts();
    }, 30000); 
    
    return () => clearInterval(pollInterval);
  }, []);
  

  const fetchNewPosts = async () => {
    try {
      const postsData = await apiService.getPosts();
      
      const existingPostIds = new Set(posts.map(p => p.id));
      const newPosts = (postsData.posts || []).filter(post => !existingPostIds.has(post.id));
      
      if (newPosts.length > 0) {
      
        const processedNewPosts = await Promise.all(
          newPosts.map(async (post) => {
            const commentsData = await apiService.getComments(post.id);
            
            return {
              ...post,
              comments: commentsData.comments || [],
              commentCount: (commentsData.comments || []).length,
              userAvatar: getRandomAvatar(post.userId),
              imageUrl: `https://picsum.photos/seed/${post.id}/800/400`
            };
          })
        );
        
        
        setPosts(prevPosts => [...processedNewPosts, ...prevPosts]);
      }
    } catch (err) {
      console.error('Error fetching new posts:', err);
    }
  };
  

  const getTopUsers = (count = 5) => {
    const userPostCounts = {};
    
    posts.forEach(post => {
      const userId = post.userId.toString();
      userPostCounts[userId] = (userPostCounts[userId] || 0) + 1;
    });
    
    return Object.entries(userPostCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([userId, postCount]) => ({
        id: userId,
        name: users[userId] || `User ${userId}`,
        postCount,
        avatar: getRandomAvatar(parseInt(userId))
      }));
  };
  

  const getTrendingPosts = () => {
    if (posts.length === 0) return [];
    
    const maxComments = Math.max(...posts.map(post => post.commentCount));
    return posts.filter(post => post.commentCount === maxComments);
  };
  

  const getFeedPosts = () => {
    return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };
  
  return (
    <DataContext.Provider
      value={{
        users,
        getTopUsers,
        getTrendingPosts,
        getFeedPosts,
        loading,
        error,
        refreshData: fetchNewPosts
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);