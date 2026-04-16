import { NextResponse } from "next/server";
import { logIn } from "@/app/actions"; // adjust path if needed

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fd = new FormData();
    fd.append("email", body.email);
    fd.append("password", body.password);

    const result = await logIn(fd);

    return NextResponse.json(result);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}