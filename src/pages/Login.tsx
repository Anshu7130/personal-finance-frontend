import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#e3f2f1' }}>
      <div className="card p-4" style={{ width: '350px' }}>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} required />
          <button type="submit" className="btn btn-success w-100">Login</button>
          <p className="text-center mt-3">
            Don’t have an account? <a href="/register">Register</a>
          </p>
          <p className="text-center mt-2">
              <a href="/forgot-password">Forgot Password?</a>
          </p>


        </form>
      </div>
    </div>
  );
}

export default Login;
