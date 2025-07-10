import React, { useState, useEffect } from 'react';
import { resetPassword } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ResetPass = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) setEmail(savedEmail);
    else navigate('/forgot-password');
  }, [navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const res = await resetPassword({ email, otp, newPassword });
      toast.success(res.data.message);
      localStorage.removeItem('resetEmail');
      setResetDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4 py-6">
      <div className="w-full max-w-sm p-6 rounded-lg shadow-lg bg-gray-800 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {resetDone ? (
          <p className="text-center text-sm text-gray-300">
            ✅ Password reset successfully.{' '}
            <Link to="/" className="text-blue-400 hover:underline font-medium">
              Login to Beanie
            </Link>
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="password"
              required
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 rounded text-white font-semibold transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPass;
