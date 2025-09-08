
export type Inquiry = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string; // Stored as ISO string
};
