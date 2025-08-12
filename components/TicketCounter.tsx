import { Ticket } from "@/types/types";

interface TicketCounterProps {
  tickets?: Ticket[];
}

export default function TicketCounter({ tickets = [] }: TicketCounterProps) {
  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const openCount = safeTickets.filter(
    (ticket) => ticket.status !== "closed"
  ).length;

  return (
    <div className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg">
      {openCount} Open Tickets
    </div>
  );
}
