import axios from 'axios';
import { Project, Issue, Comment, User, CreateProjectData, CreateIssueData, CreateCommentData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  create: (data: CreateProjectData) => api.post<Project>('/projects', data),
  update: (id: number, data: Partial<CreateProjectData>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

// Issues API
export const issuesApi = {
  getByProject: (projectId: number) => api.get<Issue[]>(`/projects/${projectId}/issues`),
  getById: (projectId: number, id: number) => api.get<Issue>(`/projects/${projectId}/issues/${id}`),
  create: (projectId: number, data: CreateIssueData) => api.post<Issue>(`/projects/${projectId}/issues`, data),
  update: (projectId: number, id: number, data: Partial<CreateIssueData>) => api.put<Issue>(`/projects/${projectId}/issues/${id}`, data),
  delete: (projectId: number, id: number) => api.delete(`/projects/${projectId}/issues/${id}`),
};

// Comments API
export const commentsApi = {
  getByIssue: (projectId: number, issueId: number) => api.get<Comment[]>(`/projects/${projectId}/issues/${issueId}/comments`),
  create: (projectId: number, issueId: number, data: CreateCommentData) => api.post<Comment>(`/projects/${projectId}/issues/${issueId}/comments`, data),
  delete: (id: number) => api.delete(`/comments/${id}`),
};

// Users API
export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
};

export default api;
