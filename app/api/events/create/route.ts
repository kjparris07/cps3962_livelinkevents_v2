// app/api/events/create/route.ts

let events: any[] = []; // temporary in-memory storage

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newEvent = {
      id: Date.now().toString(),
      name: body.name,
      date: body.date,
      location: body.location,
      description: body.description,
    };

    events.push(newEvent);

    return new Response(JSON.stringify(newEvent), {
      status: 201,
    });
  } catch (error) {
    return new Response("Failed to create event", {
      status: 500,
    });
  }
}
