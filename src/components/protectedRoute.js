import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ user, role, children }) => {
  const navigate = useNavigate();

  if (!user || user.role !== role) {
    navigate('/');  // Redirect to the home page
    return null;  // Prevent rendering the children if not authorized
  }

  return children;
};

export default ProtectedRoute;
