import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Ticket } from "@/types/types";

const DATA_PATH = path.resolve("data/tickets.json");

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const raw = await readFile(DATA_PATH, "utf8");
    let tickets: Ticket[] = JSON.parse(raw || "[]");

    const idNum = Number(params.id);
    const newTickets = tickets.filter((ticket) => ticket.id !== idNum);

    if (newTickets.length === tickets.length) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    await writeFile(DATA_PATH, JSON.stringify(newTickets, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tickets/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
