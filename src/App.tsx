import type { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Layout from './Components/Layout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';



// 🔐 Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute><Transactions /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
