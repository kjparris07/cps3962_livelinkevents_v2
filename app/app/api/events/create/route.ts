import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Event received:", body);

    // TEMP: just return success for now
    return NextResponse.json({
      success: true,
      message: "Event created (not saved yet)",
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Something went wrong",
    });
  }
}
