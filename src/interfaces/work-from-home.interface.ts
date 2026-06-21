export type WorkFromHomeStatus =
  | 'pending'
  | 'accepted'
  | 'rejected';

export interface IWorkFromHome {
  id: number;

  userId: number;

  date: string;

  status: WorkFromHomeStatus;

  createdAt?: Date;

  updatedAt?: Date;
}