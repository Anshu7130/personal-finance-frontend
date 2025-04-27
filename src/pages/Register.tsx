import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      await axios.post(`${baseURL}/api/auth/register`, formData);
      alert('Registration successful! You can now log in.');
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#e3f2f1' }}>
      <div className="card p-4" style={{ width: '350px' }}>
        <h3 className="text-center mb-3">Register</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" className="form-control mb-2" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} required />
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
