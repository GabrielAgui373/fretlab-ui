export type Session = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  last_opened_at: string;
};

export type SessionFormValues = {
  name: string;
  description: string;
};
