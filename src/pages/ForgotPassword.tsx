import { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseURL = import.meta.env.VITE_API_BASE_URL; // ✅ added

    try {
      const res = await axios.post(`${baseURL}/api/auth/forgot-password`, { email }); // ✅ dynamic URL
      localStorage.setItem('resetUserId', res.data.userId);
      setStatus('User found. You can now reset your password.');
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setStatus('No account found with this email.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f8ff' }}>
      <div className="card p-4 shadow-sm" style={{ width: '400px', borderRadius: '12px' }}>
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-100">Continue</button>
        </form>
        {status && <p className="text-center mt-3 text-muted">{status}</p>}
        {status.includes('You can now') && (
          <div className="text-center mt-3">
            <a href="/reset-password">Reset Password</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
