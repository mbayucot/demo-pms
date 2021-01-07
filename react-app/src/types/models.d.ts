export enum Role {
  client = "Client",
  admin = "Admin",
  staff = "Staff",
}

export enum Status {
  pending = "To Do",
  processing = "In Progress",
  completed = "Done",
}

interface Model {
  readonly id: number;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}

export interface User extends Model {
  email: string;
  role: Role;
  password?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar?: string;
}

export interface Project extends Model {
  name: string;
  created_by?: number;
  readonly client?: User;
}

export interface Task extends Model {
  summary: string;
  description: string;
  status: Status;
  readonly status_fmt: typeof Status;
  assigned_to?: number | "";
  readonly assignee?: User;
}
