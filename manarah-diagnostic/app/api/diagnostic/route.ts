import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || body.name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Invalid name" },
        { status: 400 }
      );
    }

    if (!body.phone || body.phone.length < 8) {
      return NextResponse.json(
        { success: false, error: "Invalid phone" },
        { status: 400 }
      );
    }

    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    console.log("Diagnostic submission received:", body);

    return NextResponse.json({
      success: true,
      message: "Diagnostic submitted successfully",
      source: body.source,
    });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting the diagnostic",
      },
      { status: 500 }
    );
  }
}