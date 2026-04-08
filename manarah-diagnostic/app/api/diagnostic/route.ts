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

    // Build outgoing payload as specified
    const {
      name,
      email,
      phone,
      company,
      source,
      stage,
      revenueRange,
      founderState,
      score,
      weakestArea,
      resultType,
      temperature,
      intentTag,
    } = body;

    const outgoingPayload = {
      name,
      email,
      phone,
      company,
      source,
      teamSize: stage,
      revenueRange,
      founderState,
      score,
      weakestArea,
      resultType,
      temperature,
      intentTag,
    };

    console.log("Diagnostic outgoing payload:", outgoingPayload);

    // You can forward outgoingPayload to another service here if needed

    return NextResponse.json({
      success: true,
      message: "Diagnostic submitted successfully",
      data: outgoingPayload,
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