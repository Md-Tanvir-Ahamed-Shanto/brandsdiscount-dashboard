import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export function PermissionGate({ 
  permission, 
  permissions, 
  role, 
  roles,
  requireAll = false,
  fallback = null,
  children 
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole } = useAuth();

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

  return hasAccess ? children : fallback;
}
