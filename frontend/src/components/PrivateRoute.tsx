import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return authState.accessToken ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
