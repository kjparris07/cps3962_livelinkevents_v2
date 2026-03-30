import { NextResponse } from "next/server";
import { events } from "@/lib/events";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;

  const event = events.find(e => e.id === params.id);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}
