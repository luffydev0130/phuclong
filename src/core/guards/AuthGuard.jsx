import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeSelectors } from '../store';

const AdminGuard = ({ isAdmin, children }) => {
  const navigate = useNavigate();
  const currentUser = useSelector(storeSelectors.selectCurrentUser);

  useEffect(() => {
    if (!currentUser || currentUser.isAdmin !== isAdmin) {
      return navigate(-1);
    }
  }, []);

  return <>{children}</>;
};

export default AdminGuard;