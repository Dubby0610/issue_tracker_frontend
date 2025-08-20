import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Issue, User } from '../types';
import { issuesApi, usersApi } from '../services/api';

interface CreateIssueModalProps {
  projectId: number;
  onClose: () => void;
  onIssueCreated: (issue: Issue) => void;
  existingIssues?: Issue[];
}

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({ projectId, onClose, onIssueCreated, existingIssues = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active',
    assigned_to_id: '',
    reporter_id: 1 // Default reporter
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const issueData = {
        ...formData,
        assigned_to_id: formData.assigned_to_id ? Number(formData.assigned_to_id) : undefined,
        reporter_id: Number(formData.reporter_id)
      };
      const response = await issuesApi.create(projectId, issueData);
      onIssueCreated(response.data);
    } catch (error) {
      console.error('Error creating issue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getNextIssueNumber = () => {
    if (existingIssues.length === 0) {
      return 'Will be assigned automatically';
    }
    
    // Find the highest ID in existing issues and predict the next one
    const maxId = Math.max(...existingIssues.map(issue => issue.id));
    return `#${maxId + 1} (estimated)`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Issue</h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

        <form id="create-issue-form" onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label htmlFor="issue_number" className="block text-sm font-medium text-gray-700 mb-2">
                Issue number:
              </label>
              <input
                type="text"
                value={getNextIssueNumber()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="creation_date" className="block text-sm font-medium text-gray-700 mb-2">
                Creation date:
              </label>
              <input
                type="text"
                value={new Date().toISOString().split('T')[0]}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter issue title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="assigned_to_id" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned to
              </label>
              <select
                id="assigned_to_id"
                name="assigned_to_id"
                value={formData.assigned_to_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="reporter_id" className="block text-sm font-medium text-gray-700 mb-2">
              Reporter
            </label>
            <select
              id="reporter_id"
              name="reporter_id"
              value={formData.reporter_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>


        </form>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              form="create-issue-form"
              disabled={loading || !formData.title}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Issue'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIssueModal;
