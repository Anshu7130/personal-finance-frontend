import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4"
			style={{
			backgroundColor: '#f8f9fa', 
			height: '100vh', 
			overflowY: 'auto'
			 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
