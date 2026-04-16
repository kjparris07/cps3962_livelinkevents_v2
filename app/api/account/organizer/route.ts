import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        fullName: "Jane Smith",
        email,
        username: "janesmithmusic",
        phoneNumber: "999-888-7777",
        organizationType: "Artist / Organizer",
        website: "www.janesmithmusic.com",
        instagramHandle: "@janesmithmusic",
        artistGenre: "Afrobeats",
        verifiedOrganizer: true,
        eventsPublished: 4,
        monthlySales: "$2,450.00",
        payoutMethod: "Direct Deposit",
        marketingEmails: true,
        twoFactorEnabled: false,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server error loading organizer account." },
      { status: 500 }
    );
  }
}