import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { Project } from '../types';
import { projectsApi } from '../services/api';
import CreateProjectModal from './CreateProjectModal';
import ConfirmationModal from './ConfirmationModal';
import EditProjectModal from './EditProjectModal';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsApi.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects([...projects, newProject]);
    setShowCreateModal(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setShowEditModal(false);
    setEditingProject(null);
  };

  const handleViewProject = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await projectsApi.delete(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      setShowDeleteConfirm(false);
      setDeletingProjectId(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const confirmDeleteProject = (projectId: number) => {
    setDeletingProjectId(projectId);
    setShowDeleteConfirm(true);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your project portfolio and track issues</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create new project
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewProject(project.id)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {project.name}
                </h3>
                <Menu as="div" className="relative">
                  <Menu.Button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProject(project);
                          }}
                          className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Edit project
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteProject(project.id);
                          }}
                          className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-red-700`}
                        >
                          Delete project
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
              
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {project.issues_count || 0} issues
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found.</p>
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {showEditModal && editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => {
            setShowEditModal(false);
            setEditingProject(null);
          }}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingProjectId(null);
        }}
        onConfirm={() => deletingProjectId && handleDeleteProject(deletingProjectId)}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and will also delete all associated issues."
        confirmText="Delete Project"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ProjectList;
