import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../features/auth/authSlice';
import Spinner from '../components/loaders/Spinner';

const ProtectedRoute = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, token, user, sessionChecked } = useSelector((state) => state.auth);
  const [bootstrapped, setBootstrapped] = React.useState(Boolean(sessionChecked) || Boolean(user) || Boolean(token) || Boolean(localStorage.getItem('authToken')));

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    if (sessionChecked || (!token && !storedToken)) {
      setBootstrapped(true);
      return undefined;
    }

    let active = true;

    const bootstrap = async () => {
      await dispatch(fetchCurrentUser());
      if (active) {
        setBootstrapped(true);
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [dispatch, sessionChecked, token]);

  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading your workspace..." />
      </div>
    );
  }

  if (!isAuthenticated && !token && !localStorage.getItem('authToken')) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
