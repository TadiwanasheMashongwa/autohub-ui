const BACKEND_URL = 'http://localhost:8080';

export const getImageUrl = (path) => {
  if (!path) return '/placeholder-part.png';
  
  // If the path is already a full URL, return it
  if (path.startsWith('http')) return path;
  
  // If it's a relative path, prefix it with the backend address
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
};