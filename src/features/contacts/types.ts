export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};
