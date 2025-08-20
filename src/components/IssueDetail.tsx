import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Issue, Comment, User } from '../types';
import { issuesApi, commentsApi, usersApi } from '../services/api';
import ConfirmationModal from './ConfirmationModal';

const IssueDetail: React.FC = () => {
  const { projectId, issueId } = useParams<{ projectId: string; issueId: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    assigned_to_id: undefined as number | undefined,
    reporter_id: 1
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedUser, setSelectedUser] = useState<number>(1); // Default user
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadIssueDetails = useCallback(async () => {
    try {
      setError(null);
      
      const [issueResponse, commentsResponse] = await Promise.all([
        issuesApi.getById(Number(projectId), Number(issueId)),
        commentsApi.getByIssue(Number(projectId), Number(issueId))
      ]);
      
      const issueData = issueResponse.data;
      setIssue(issueData);
      setComments(commentsResponse.data);
      
      // Initialize form data with the loaded issue data
      setFormData({
        title: issueData.title,
        description: issueData.description || '',
        status: issueData.status,
        assigned_to_id: issueData.assigned_to_id,
        reporter_id: issueData.reporter_id
      });
    } catch (error: any) {
      console.error('Error loading issue details:', error);
      
      if (error.response?.status === 404) {
        setError('Issue not found.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load issue details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, issueId]);

  useEffect(() => {
    if (projectId && issueId) {
      loadIssueDetails();
      loadUsers();
    }

    // Cleanup function to clear any success/error states when component unmounts
    return () => {
      setSaveSuccess(false);
      setSaveError(null);
    };
  }, [projectId, issueId, loadIssueDetails]);

  const loadUsers = async () => {
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSave = async () => {
    if (!issue) return;
    
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const response = await issuesApi.update(Number(projectId), issue.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        assigned_to_id: formData.assigned_to_id,
        reporter_id: formData.reporter_id
      });
      
      // Update the displayed issue with the saved data
      const savedIssue = response.data;
      setIssue(savedIssue);
      
      // Update form data to match the saved data 
      setFormData({
        title: savedIssue.title,
        description: savedIssue.description || '',
        status: savedIssue.status,
        assigned_to_id: savedIssue.assigned_to_id,
        reporter_id: savedIssue.reporter_id
      });
      
      // Show success message
      setSaveSuccess(true);
      
      // Navigate back to project issues page after a brief delay
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error saving issue:', error);
      if (error.response?.status === 404) {
        setSaveError('Issue not found.');
      } else if (error.response?.status >= 500) {
        setSaveError('Server error. Please try again.');
      } else {
        setSaveError('Failed to save issue. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!issue) return;
    
    try {
      await issuesApi.delete(Number(projectId), issue.id);
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await commentsApi.create(Number(projectId), Number(issueId), {
        content: newComment,
        user_id: selectedUser
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCancel = () => {
    if (issue) {
      // Reset form data to original issue data
      setFormData({
        title: issue.title,
        description: issue.description || '',
        status: issue.status,
        assigned_to_id: issue.assigned_to_id,
        reporter_id: issue.reporter_id
      });
    }
    navigate(`/projects/${projectId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
            loadIssueDetails();
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading issue...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Projects
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              <Link 
                to={`/projects/${projectId}`} 
                className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2"
              >
                {issue.project?.name || `Project ${projectId}`}
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              <span className="ml-1 text-gray-900 font-medium md:ml-2">Issue #{issue.id}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Issue #{issue.id} – {issue.title}
          </h1>
          <div className="mt-2 flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
              {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              Created {new Date(issue.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saveSuccess}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
          </button>
          <button
            onClick={confirmDelete}
            disabled={saving || saveSuccess}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            Delete issue
          </button>
        </div>
      </div>

      {/* Success/Error Notifications */}
      {saveSuccess && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Issue updated successfully! Redirecting you back to the project page...
              </p>
            </div>
          </div>
        </div>
      )}

      {saveError && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {saveError}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setSaveError(null)}
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            {/* Issue Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue number:
                </label>
                <input
                  type="text"
                  value={`#${issue.id}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creation date:
                </label>
                <input
                  type="text"
                  value={new Date(issue.created_at).toLocaleDateString()}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title:
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description:
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Plain text"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned to:
                </label>
                <select
                  value={formData.assigned_to_id || ''}
                  onChange={(e) => handleFormChange('assigned_to_id', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status:
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="on_hold">On hold</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Comments</h3>
            
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {comment.user?.name.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.user?.name || 'Unknown User'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No comments yet. Be the first to add one!
                </p>
              )}
            </div>

            {/* Add Comment */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">U</span>
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(Number(e.target.value))}
                      className="text-sm border-none focus:ring-0 p-0 font-medium text-gray-900"
                    >
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write new comment here and it will be saved"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="mt-3">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Issue Details</h3>
            
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Reporter:</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {issue.reporter?.name || 'Unknown'}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated:</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(issue.updated_at).toLocaleString()}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Project:</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {issue.project?.name || `Project ${projectId}`}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Issue"
        message="Are you sure you want to delete this issue? This action cannot be undone."
        confirmText="Delete Issue"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default IssueDetail;
