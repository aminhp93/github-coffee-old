export type Booking = {
  create_at: string;
  id: number;
  creator: string;
  participant: string | null;
  tag: number;
  status: number;
  title: string;
};
