import { Ticket } from "@/types/types";
import { readFile } from "fs/promises";
import path from "path";
import TicketsClient from "./client/TicketsClient";

export default async function Page() {
  // Load actual tickets from file
  const filePath = path.resolve("data/tickets.json");
  const raw = await readFile(filePath, "utf8");
  const tickets: Ticket[] = JSON.parse(raw || "[]");

  // Simulate network delay of 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <main className="max-w-5xl mx-auto p-6">
      <TicketsClient initialTickets={tickets} />
    </main>
  );
}
