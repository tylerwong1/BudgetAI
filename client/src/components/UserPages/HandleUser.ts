import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom Enums to track where the user is for the NavBar to adjust with its links
 */
export enum NavigationState {
  INTRO = 'INTRO',
  LOG_IN = 'LOG-IN',
  MAIN_PAGES = 'MAIN-PAGES',
}

/**  
 * Custom hook for checking if user is logged in.
 * When invoked, if the user isn't logged in, it returns them to the log in page!
*/
export const useCheckLoggedIn = (): void => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
      navigate('/login');
    }
  }, [navigate]);
};
