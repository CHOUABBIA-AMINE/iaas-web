/**
 * Layout Component
 * Main layout wrapper for protected routes
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      {/* TODO: Add navigation, header, sidebar */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
