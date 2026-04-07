import { NextResponse } from "next/server";

async function getAccessToken() {
  const res = await fetch("https://accounts.zoho.in/oauth/v2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const accessToken = await getAccessToken();

    const zohoRes = await fetch(
      "https://www.zohoapis.in/crm/v2/Leads",
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            {
              Last_Name: body.name || "Unknown",
              Email: body.email,
              Phone: body.phone,
              Company: body.company || "Unknown",

              Lead_Source: body.source || "Website",

              Team_Size: body.teamSize,
              Revenue_Range: body.revenueRange,
              Founder_State: body.founderState,

              Diagnostic_Score: body.score,
              Weakest_Area: body.weakestArea,
              Result_Type: body.resultType,

              Lead_Temperature: body.temperature,
              Intent_Tag: body.intentTag,
            },
          ],
        }),
      }
    );

    const result = await zohoRes.json();

    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}