import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn || isLoggedIn !== 'true') {
      navigate('/login');
    }
  }, [navigate, location]);
};

/**  
 * Custom hook for checking if user is logged in.
 * When invoked, if the user is logged in, it returns them to the home page!
*/
export const useCheckSaveLogin = (): void => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
      navigate('/home');
    }
  }, [navigate, location]);
};

/**
 * Custom hook to manage navigation state based on current route.
 */
export const useNavigationState = (): NavigationState => {
  const location = useLocation();
  const [currentState, setCurrentState] = useState<NavigationState>(NavigationState.LOG_IN);

  useEffect(() => {
    switch (location.pathname) {
      case '/login':
      case '/signup':
        setCurrentState(NavigationState.LOG_IN);
        break;
      case '/home':
      case '/upload-data':
      case '/analysis':
      case '/chat':
        setCurrentState(NavigationState.MAIN_PAGES);
        break;
      default:
        setCurrentState(NavigationState.INTRO); // Default state can be INTRO
    }
  }, [location]);

  return currentState;
};
