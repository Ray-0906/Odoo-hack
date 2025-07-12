import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('soloAuth');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  return children;
};

export default AuthCheck;
