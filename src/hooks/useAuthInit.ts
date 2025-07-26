import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setAuthenticated, setLoading } from '../slice/auth.slice';

export const useAuthInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        dispatch(setLoading(true));
        
        // Check if user is authenticated by calling the login GET endpoint
        const response = await fetch('/api/login', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });
        
        const data = await response.json();
        
        if (data.authenticated) {
          dispatch(setAuthenticated(true));
        } else {
          dispatch(setAuthenticated(false));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        dispatch(setAuthenticated(false));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuthStatus();
  }, [dispatch]);
}; 