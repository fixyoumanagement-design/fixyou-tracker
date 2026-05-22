export type ProjectStatus = 'WAIT' | 'BOOKING' | 'FIXED/RUNNING' | 'FINALIZED';
export type JobCategory = 'PIC' | 'Job Partner' | 'Job Vendor';

export interface Project {
  id: string;
  name: string;
  client: string;
  brand: string;
  runningDate: string;
  revenue: number;
  payout: number;
  talangan: number;
  profit: number;
  category: JobCategory;
  status: ProjectStatus;
  talentCount?: number;
  worksheetLink?: string;
  groupLink?: string;
  broadcastText?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  projectId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
