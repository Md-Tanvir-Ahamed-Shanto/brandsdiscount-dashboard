import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/logo/BD Logo Black.png";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-500">
      <div className="relative">
        <div className="w-96 h-32 bg-gradient-to-br p-5 from-green-400 to-blue-500 rounded-xl flex items-center justify-center animate-bounce shadow-lg">
          <div className="text-white text-xl">
            <img src={Logo} alt="logo" />
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gray-300 rounded-full opacity-50 animate-pulse"></div>
      </div>
      <div className="text-center">
        <h3 className="text-4xl font-semibold text-gray-100 mt-4">Loading...</h3>
        <div className="flex items-center justify-center space-x-1 mt-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-6 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-6 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
