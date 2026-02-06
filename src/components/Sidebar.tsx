import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, FolderOpen, MessageSquare, LogOut, Sofa, Settings } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Sofa size={32} />
          <span>Móveis CRM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FolderOpen size={20} />
          <span>Projetos</span>
        </NavLink>

        <NavLink to="/chat" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <MessageSquare size={20} />
          <span>Chat Orçamento</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Configurações</span>
        </NavLink>

        <div className="user-info">
          <img src={user?.avatar} alt={user?.name} className="user-avatar" />
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        <button onClick={logout} className="logout-button">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
