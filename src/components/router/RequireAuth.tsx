import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAppSelector } from 'libs/app/hooks';

const RequireAuth: React.FC<any> = ({ children }) => {
  //   const token = useAppSelector((state: any) => state.auth.token);
  //   console.log('token', token);
  return <>{children}</>;

  //   return token ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
