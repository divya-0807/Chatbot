import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import { toast } from 'react-hot-toast';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email });
      toast.success(res.data.message);
      localStorage.setItem('resetEmail', email);
      navigate('/reset-password');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4 py-6">
      <div className="w-full max-w-sm p-6 rounded-lg shadow-lg bg-gray-800 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 rounded text-white font-semibold transition"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
