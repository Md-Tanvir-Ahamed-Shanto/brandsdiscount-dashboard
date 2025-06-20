
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RoleProtectedRoute({ 
  children, 
  permission, 
  permissions, 
  role, 
  roles,
  requireAll = false,
  redirectTo = '/unauthorized' 
}) {
  const { 
    isAuthenticated, 
    loading, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    hasRole, 
    hasAnyRole 
  } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  } else if (role) {
    hasAccess = hasRole(role);
  } else if (roles) {
    hasAccess = hasAnyRole(roles);
  }

  return hasAccess ? children : <Navigate to={redirectTo} replace />;
}