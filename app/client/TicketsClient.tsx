"use client";

import SearchBar from "@/components/SearchBar";
import TicketCounter from "@/components/TicketCounter";
import TicketForm from "@/components/TicketForm";
import TicketList from "@/components/TicketList";
import { Ticket } from "@/types/types";
import { useState } from "react";

interface TicketsClientProps {
  initialTickets: Ticket[];
}

export default function TicketsClient({ initialTickets }: TicketsClientProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filtered, setFiltered] = useState<Ticket[]>(initialTickets);
  const [loading, setLoading] = useState<boolean>(false);

  async function loadTickets() {
    setLoading(true);
    try {
      const res = await fetch("/api/tickets");
      const data: Ticket[] = await res.json();
      setTickets(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(q: string) {
    if (!q.trim()) {
      setFiltered(tickets);
      return;
    }
    const term = q.toLowerCase();
    setFiltered(
      tickets.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(term)) ||
          (t.description && t.description.toLowerCase().includes(term))
      )
    );
  }

  function handleDelete(id: string) {
    setTickets((prev) => prev.filter((t) => t.id.toString() !== id));
    setFiltered((prev) => prev.filter((t) => t.id.toString() !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Mini Ticketing App</h1>
        <TicketCounter tickets={tickets} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4">
          <TicketForm
            onSaved={(updated) => {
              setTickets(updated);
              setFiltered(updated);
            }}
          />
          <SearchBar onSearch={handleSearch} />
          {loading ? (
            <div className="text-gray-500 text-sm">Loading tickets...</div>
          ) : (
            <TicketList tickets={filtered} onDelete={handleDelete} />
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white shadow rounded-lg p-4 border">
            <h3 className="text-lg font-semibold">Summary</h3>
            <p className="text-sm text-gray-500">
              Total tickets: {tickets.length}
            </p>
            <p className="text-sm text-gray-500">
              Open: {tickets.filter((t) => t.status !== "closed").length}
            </p>
            <p className="text-sm text-gray-500">
              Closed: {tickets.filter((t) => t.status === "closed").length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 border">
            <h4 className="font-semibold">Help</h4>
            <p className="text-sm text-gray-500">
              Create tickets using the form. Search filters the list instantly.
              Use the delete button to remove tickets.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
