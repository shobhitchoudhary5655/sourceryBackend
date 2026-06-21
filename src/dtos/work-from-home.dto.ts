export interface CreateWorkFromHomeDto {
  userId: number;

  date: string;
}

export interface UpdateWorkFromHomeDto {
  status?: 'pending' | 'accepted' | 'rejected';
}