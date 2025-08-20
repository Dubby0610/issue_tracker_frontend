export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'on_hold' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  issues_count?: number;
}

export interface Issue {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: 'active' | 'on_hold' | 'resolved' | 'closed';
  assigned_to_id?: number;
  reporter_id: number;
  created_at: string;
  updated_at: string;
  assigned_to?: User;
  reporter?: User;
  comments?: Comment[];
  project?: Project;
}

export interface Comment {
  id: number;
  issue_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface CreateProjectData {
  name: string;
  description: string;
  status: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  status: string;
  assigned_to_id?: number;
  reporter_id: number;
}

export interface CreateCommentData {
  content: string;
  user_id: number;
}
