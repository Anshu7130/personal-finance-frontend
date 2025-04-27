import { useEffect, useState } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    bootstrap: any;
  }
}

function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const toastEl = document.getElementById('logoutToast');
    if (toastEl) {
      new window.bootstrap.Toast(toastEl);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    const baseURL = import.meta.env.VITE_API_BASE_URL; 

    try {
      const res = await axios.put(`${baseURL}/api/auth/profile`, user, { 
        headers: { Authorization: token || '' },
      });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setEditMode(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    const toastEl = document.getElementById('logoutToast');
    if (toastEl) {
      const toast = new window.bootstrap.Toast(toastEl);
      toast.show();
    }

    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#e3f2f1', height: '100vh' }}>
      <div className="card shadow p-4" style={{ width: '400px', borderRadius: '15px', backgroundColor: '#fffaf1' }}>
        <h3 className="text-center mb-4">My Profile</h3>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        {!editMode ? (
          <button className="btn btn-outline-primary w-100" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        ) : (
          <button className="btn btn-primary w-100" onClick={handleUpdate}>
            Save Changes
          </button>
        )}

        <button className="btn btn-outline-danger mt-3 w-100" onClick={handleLogout}>
          Logout
        </button>

        <hr />
      </div>

    
      <div
        className="toast position-fixed bottom-0 end-0 m-4 text-white bg-dark"
        role="alert"
        id="logoutToast"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-delay="2000"
      >
        <div className="toast-header">
          <strong className="me-auto">Logout</strong>
          <small>Now</small>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div className="toast-body">
          You have been logged out successfully.
        </div>
      </div>
    </div>
  );
}

export default Profile;
