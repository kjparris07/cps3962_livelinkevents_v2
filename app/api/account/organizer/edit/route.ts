import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      fullName,
      username,
      phoneNumber,
      organizationType,
      website,
      instagramHandle,
      artistGenre,
      marketingEmails,
      twoFactorEnabled,
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Organizer account updated.",
      updatedUser: {
        email,
        fullName,
        username,
        phoneNumber,
        organizationType,
        website,
        instagramHandle,
        artistGenre,
        marketingEmails,
        twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server error updating organizer account." },
      { status: 500 }
    );
  }
}