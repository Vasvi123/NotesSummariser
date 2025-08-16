import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Home } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <FileText size={24} />
          Notes Summariser
        </Link>
        
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                <Home size={16} />
                Home
              </Link>
            </li>
            <li>
              <Link to="/summary" className={location.pathname === '/summary' ? 'active' : ''}>
                <FileText size={16} />
                Summary
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
