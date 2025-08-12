"use client";
import { Ticket } from "@/types/types";
import { useState, FormEvent } from "react";

interface TicketFormProps {
  onSaved?: (tickets: Ticket[]) => void;
}

export default function TicketForm({ onSaved }: TicketFormProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated: Ticket[] = await res.json();
      setTitle("");
      setDescription("");
      setPriority("Low");
      if (onSaved) onSaved(updated);
    } catch (err) {
      setError("Could not save ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-3">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "Low" | "Medium" | "High")
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <textarea
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 min-h-[80px] w-full"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}
