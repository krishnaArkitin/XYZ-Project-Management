
export enum UserRole {
  Client = 'Client',
  Admin = 'Admin',
  Vendor = 'Vendor'
}

export interface User {
  _id: string; // Changed from 'id' to '_id'
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export enum ProjectStatus {
  Requested = 'Requested',
  Quotation = 'Quotation',
  Approved = 'Approved',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Rejected = 'Rejected'
}

export enum ProjectCategory {
    IoT = 'IoT',
    Manufacturing = 'Manufacturing',
    IT = 'IT',
    Others = 'Others'
}

export interface TimelineEvent {
  _id?: string; // MongoDB auto-generates _id for subdocuments
  date: string;
  title: string;
  description: string;
  author: string;
}

export interface Project {
  _id: string; // Changed from 'id' to '_id'
  title: string;
  category: ProjectCategory;
  description: string;
  timeline: TimelineEvent[];
  status: ProjectStatus;
  budget?: string;
  clientId: string | User; // Can be string ID or populated User object
  vendorId?: string | User; // Can be string ID or populated User object
  files: { name: string; url: string }[];
  expectedTimeline: string;
}

export interface Message {
    _id?: string; // MongoDB auto-generates _id for subdocuments
    sender: string | User; // Can be string ID or populated User object
    text: string;
    timestamp: string;
}

export interface Conversation {
    _id: string; // Changed from 'id' to '_id'
    projectId: string | Project; // Can be string ID or populated Project object
    participants: (string | User)[]; // Array of string IDs or populated User objects
    messages: Message[];
}

export interface Meeting {
    _id: string; // Changed from 'id' to '_id'
    title: string;
    date: string;
    time: string;
    participants: (string | User)[]; // Array of string IDs or populated User objects
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    creator: string | User; // Can be string ID or populated User object
}
