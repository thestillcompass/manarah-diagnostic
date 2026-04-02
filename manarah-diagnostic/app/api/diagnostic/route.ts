import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Diagnostic submission received:", body);

    return NextResponse.json({
      success: true,
      message: "Diagnostic submitted successfully",
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