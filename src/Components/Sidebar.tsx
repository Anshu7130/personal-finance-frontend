import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaExchangeAlt, FaUser } from 'react-icons/fa';

function Sidebar() {
  return (
    <div
      className="d-flex flex-column p-3 text-white"
      style={{
        width: '220px',
        height: '100vh',
        background: 'linear-gradient(to bottom, #0f4d4d, #137f7f)',
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px',
      }}
    >
      <h4 className="text-white mb-4">Proficard</h4>
      <ul className="nav nav-pills flex-column">
        <li className="nav-item mb-2">
          <NavLink to="/dashboard" className="nav-link text-white">
            <FaTachometerAlt className="me-2" />
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/transactions" className="nav-link text-white">
            <FaExchangeAlt className="me-2" />
            Transactions
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/profile" className="nav-link text-white">
            <FaUser className="me-2" />
            Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

