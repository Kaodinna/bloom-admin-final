// ─────────────────────────────────────────────────────────────
// /api/bubble — universal Bubble proxy
//
// All PATCH and DELETE requests from the admin frontend are
// routed through here. GET and POST work fine directly from
// the browser (Bubble allows them), so only PATCH/DELETE need
// proxying.
//
// Frontend calls:  POST /api/bubble  { method, path, body, token }
// This server calls Bubble with the real method (PATCH/DELETE)
// No CORS issue because it's server → Bubble, not browser → Bubble
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_BUBBLE_BASE_URL ?? "";

export async function POST(req: NextRequest) {
  try {
    const { method, path, body, token } = await req.json();

    if (!path || !token) {
      return NextResponse.json(
        { error: "Missing path or token" },
        { status: 400 },
      );
    }

    // Only proxy methods that CORS blocks from the browser
    const allowedMethods = ["PATCH", "DELETE"];
    if (!allowedMethods.includes(method?.toUpperCase())) {
      return NextResponse.json(
        { error: "Only PATCH and DELETE are proxied" },
        { status: 400 },
      );
    }

    const url = `${BASE}${path}`;

    const bubbleRes = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await bubbleRes.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: bubbleRes.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
