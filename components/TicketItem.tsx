"use client";
import { Ticket } from "@/types/types";

interface TicketItemProps {
  ticket: Ticket;
  onDelete?: (id: string) => void;
}

export default function TicketItem({ ticket, onDelete }: TicketItemProps) {
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    const res = await fetch(`/api/delete/${ticket.id}`, { method: "DELETE" });

    if (res.ok && onDelete) {
      onDelete(ticket.id.toString());
    } else {
      alert("Failed to delete ticket");
    }
  }

  return (
    <div className="flex justify-between bg-white rounded-lg p-4 border shadow-sm">
      <div>
        <div className="font-semibold text-gray-800">{ticket.title}</div>
        <div className="text-sm text-gray-500">
          {ticket.description?.slice(0, 140)}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            ticket.priority === "Low"
              ? "bg-cyan-100 text-cyan-800"
              : ticket.priority === "Medium"
              ? "bg-orange-100 text-orange-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {ticket.priority}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(ticket.createdAt).toLocaleString()}
        </span>
        <button
          onClick={handleDelete}
          className="text-xs text-red-600 hover:underline border border-red-600 p-1 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
