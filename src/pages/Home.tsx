import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Clock, CheckCircle, Edit3, Trash2 } from 'lucide-react';
import { Project } from '../types';
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const createProject = () => {
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      client: newProjectClient,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };

    setProjects([newProject, ...projects]);
    setNewProjectName('');
    setNewProjectClient('');
    setShowCreateModal(false);
  };

  const deleteProject = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="status-icon completed" />;
      case 'in-progress':
        return <Clock size={16} className="status-icon in-progress" />;
      default:
        return <Edit3 size={16} className="status-icon draft" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in-progress':
        return 'Em andamento';
      default:
        return 'Rascunho';
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div>
          <h1>Meus Projetos</h1>
          <p>Gerencie seus orçamentos de móveis planejados</p>
        </div>
        <button className="create-project-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Novo Projeto
        </button>
      </header>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-icon">
              <FolderOpen size={32} />
            </div>
            
            <div className="project-info">
              <h3>{project.name}</h3>
              {project.client && <p className="project-client">{project.client}</p>}
              
              <div className="project-meta">
                <span className="project-status">
                  {getStatusIcon(project.status)}
                  {getStatusLabel(project.status)}
                </span>
                <span className="project-date">
                  {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="project-actions">
              <button 
                className="action-btn primary"
                onClick={() => navigate(`/chat?project=${project.id}`)}
              >
                Abrir
              </button>
              <button 
                className="action-btn danger"
                onClick={() => deleteProject(project.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="empty-state">
            <FolderOpen size={64} />
            <h3>Nenhum projeto ainda</h3>
            <p>Crie seu primeiro projeto para começar</p>
            <button className="create-project-btn" onClick={() => setShowCreateModal(true)}>
              <Plus size={20} />
              Criar Projeto
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Novo Projeto</h2>
            
            <div className="form-group">
              <label>Nome do Projeto</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Ex: Cozinha Planejada"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Cliente (opcional)</label>
              <input
                type="text"
                value={newProjectClient}
                onChange={(e) => setNewProjectClient(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={createProject}>
                Criar Projeto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
