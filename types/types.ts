export type Ticket = {
  id: number;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  status: "open" | "closed";
  createdAt: string;
};
