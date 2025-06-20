import { useEffect, useState } from "react";
import { PERMISSIONS } from "../constants";
import { AuthContext } from "../contexts/AuthContext";
import { apiClient } from "../config/api/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user")) ;

      if (storedToken) {
        setToken(storedToken);

          try {
            console.log("storedUser", storedUser);
            const response = await apiClient.get(
              `/userroute/user/${storedUser?.id}`
            );
            setUser(response.data);
            setIsAuthenticated(true);
          } catch (error) {
            console.log("Error: ", error);
            localStorage.removeItem("token");
            setToken(null);
            setIsAuthenticated(false);
          }
        
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Set up Axios interceptors
  // useEffect(() => {
  //   const requestInterceptor = apiClient.interceptors.request.use(
  //     (config) => {
  //       if (token) {
  //         config.headers.Authorization = `Bearer ${token}`;
  //       }
  //       return config;
  //     },
  //     (error) => Promise.reject(error)
  //   );

  //   const responseInterceptor = apiClient.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       if (error.response?.status === 401) {
  //         logout();
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return () => {
  //     apiClient.interceptors.request.eject(requestInterceptor);
  //     apiClient.interceptors.response.eject(responseInterceptor);
  //   };
  // }, [token]);

  const login = async (credentials) => {
    console.log("Login Credentials: ", credentials);
    try {
      setLoading(true);
      const response = await apiClient.post("/authroute/login", credentials);
      console.log("response: ", response);
      const { access_token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Permission checking functions
  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    const userPermissions = PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!user || !user.role) return false;
    const userPermissions = PERMISSIONS[user.role] || [];
    return permissions.some((permission) =>
      userPermissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissions) => {
    if (!user || !user.role) return false;
    const userPermissions = PERMISSIONS[user.role] || [];
    return permissions.every((permission) =>
      userPermissions.includes(permission)
    );
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return user?.role && roles.includes(user.role);
  };

  const getUserPermissions = () => {
    if (!user || !user.role) return [];
    return PERMISSIONS[user.role] || [];
  };

  const isAdmin = () => {
    return hasAnyRole(["Superadmin", "Admin"]);
  };

  const isSuperadmin = () => {
    return hasRole("Superadmin");
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    // Permission methods
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    getUserPermissions,
    isAdmin,
    isSuperadmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
