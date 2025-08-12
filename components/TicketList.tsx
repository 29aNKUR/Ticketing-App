"use client";
import { Ticket } from "@/types/types";
import TicketItem from "./TicketItem";

interface TicketListProps {
  tickets: Ticket[];
  onDelete?: (id: string) => void;
}

export default function TicketList({ tickets, onDelete }: TicketListProps) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg text-gray-500 text-sm">
        No tickets found.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {tickets.map((t) => (
        <TicketItem key={t.id} ticket={t} onDelete={onDelete} />
      ))}
    </div>
  );
}
