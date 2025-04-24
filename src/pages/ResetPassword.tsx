import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
	const [success, setSucess] = useState(false);
  const userId = localStorage.getItem('resetUserId');
	const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        userId,
        newPassword,
      });
      setStatus('Password updated successfully.');
      setSucess(true);
			localStorage.removeItem('resetUserId');
    } catch (err) {
      setStatus('Failed to update password.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#e3f2f1' }}>
      <div className="card p-4 shadow-sm" style={{ width: '400px', borderRadius: '12px' }}>
        <h3 className="text-center mb-4">Reset Password</h3>
        {!success ? (
				<form onSubmit={handleReset}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-success w-100">Reset Password</button>
        </form>
				):(
					<div className="text-center">
					<p className="text-success mb-3">{status}</p>
					<button className="btn btn-primary w-100" onClick={() => navigate('/')}>
						Go to Login
					</button>
				</div>
			)}
		</div>
	</div>
);
}

export default ResetPassword;