import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Ticket } from "@/types/types";

const DATA_PATH = path.resolve("data/tickets.json");

export async function GET() {
  try {
    const raw = await readFile(DATA_PATH, "utf8");
    const tickets: Ticket[] = JSON.parse(raw || "[]");
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("GET /api/tickets error:", error);
    return NextResponse.json(
      { error: "Failed to read tickets" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description = "", priority = "Low", status = "open" } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Read existing tickets
    const raw = await readFile(DATA_PATH, "utf8");
    const tickets: Ticket[] = JSON.parse(raw || "[]");

    // Create a new ticket
    const newTicket: Ticket = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      createdAt: new Date().toISOString(),
    };

    // Add new ticket at the top
    tickets.unshift(newTicket);

    // Write updated tickets back to the file
    await writeFile(DATA_PATH, JSON.stringify(tickets, null, 2), "utf8");

    return NextResponse.json(tickets, { status: 201 });
  } catch (error) {
    console.error("POST /api/tickets error:", error);
    return NextResponse.json(
      { error: "Failed to save ticket" },
      { status: 500 }
    );
  }
}

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
