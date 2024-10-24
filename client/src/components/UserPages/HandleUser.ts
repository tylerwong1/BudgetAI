import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**  Custom hook for checking if user is logged in.
 *   When invoked, if the user isn't logged in, it returns them to the log in page!
*/
export const useAuthCheck = (): void => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
      navigate('/login');
    }
  }, [navigate]);
};
