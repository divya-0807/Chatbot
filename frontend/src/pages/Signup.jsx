import React, { useState } from 'react';
import { signup } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import RootCanvas from '../components/RobotCanvas';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signup({ email, password });
      toast.success(res.data.message);
      navigate('/chats');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-gray-900 text-white">
      
  

      {/* Signup Form */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[350px] p-6 rounded-lg shadow-lg bg-gray-800 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
              />
              <div
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 rounded text-white font-semibold transition"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/"
              className="text-blue-400 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

          {/* Robot Canvas - Top on mobile, right on desktop */}
      <div className="w-full md:w-1/2 h-[300px] md:h-full ">
        <RootCanvas />
      </div>
    </div>
  );
}
