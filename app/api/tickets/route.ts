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
    const raw = await readFile(DATA_PATH, "utf8");
    const tickets: Ticket[] = JSON.parse(raw || "[]");

    const newTicket: Ticket = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      createdAt: new Date().toISOString(),
    };

    tickets.unshift(newTicket);

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
