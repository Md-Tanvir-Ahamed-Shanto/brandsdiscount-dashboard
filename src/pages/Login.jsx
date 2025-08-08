
import { useState } from 'react';
import { Lock, Mail, Store, CreditCard, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../assets/logo/BDLogoWhite.png';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(credentials);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>
    <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-96 h-24 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 border border-white/20">
            <img src={Logo} className="w-60 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">POS Dashboard</h1>
          <p className="text-blue-200">Access your point of sale system</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white text-center mb-6">Login</h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="username"
                  name="username"
                  placeholder="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200" />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm">
             this page not for you !
            </p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/20">
              <CreditCard className="w-6 h-6 text-blue-300" />
            </div>
            <p className="text-blue-200 text-xs">Secure Payments</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/20">
              <BarChart3 className="w-6 h-6 text-blue-300" />
            </div>
            <p className="text-blue-200 text-xs">Analytics</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/20">
              <Store className="w-6 h-6 text-blue-300" />
            </div>
            <p className="text-blue-200 text-xs">Inventory</p>
          </div>
        </div>
      </div>
  </div>
  );
}

export default Login;