import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';
import '../styles/Projects.css';

const Projects: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="projects-container">
      <header className="projects-header">
        <h1>Todos os Projetos</h1>
        <p>Visualize e gerencie todos os seus projetos em um só lugar</p>
      </header>

      <div className="projects-content">
        <div className="empty-state-large">
          <FolderOpen size={80} />
          <h2>Em breve</h2>
          <p>A visualização completa de projetos está em desenvolvimento.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Voltar para Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projects;
