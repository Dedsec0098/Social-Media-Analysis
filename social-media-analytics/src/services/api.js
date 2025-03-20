import axios from 'axios';


const api = axios.create({
  baseURL: 'http://20.244.56.144/test',
});


api.interceptors.request.use((config) => {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNDc2NDc1LCJpYXQiOjE3NDI0NzYxNzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjRmYWY2N2M3LWIwZDEtNGQzNy1hZDliLWY0MjQ0ZmJjYmJiOSIsInN1YiI6InNtOTI5NEBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiI0ZmFmNjdjNy1iMGQxLTRkMzctYWQ5Yi1mNDI0NGZiY2JiYjkiLCJjbGllbnRTZWNyZXQiOiJ0YWhrdkZZcG1LRnpsWUd5Iiwib3duZXJOYW1lIjoiU2hyaXNoIE1pc2hyYSIsIm93bmVyRW1haWwiOiJzbTkyOTRAc3JtaXN0LmVkdS5pbiIsInJvbGxObyI6IlJBMjIxMTAyNzAxMDAyNSJ9.2r6o6PDaxHYIzBVHzMNMfqWp5Z80nk66Fqh59HPIW7A";
  
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});


const apiService = {

  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  

  getPosts: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  

  getComments: async (postId) => {
    try {
      const response = await api.get(`/comments?postId=${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }
};

export default apiService;