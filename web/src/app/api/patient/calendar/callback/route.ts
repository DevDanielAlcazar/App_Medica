import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  // CSRF state validation
  const storedState = req.cookies.get("gcal_oauth_state")?.value;
  if (state !== storedState) {
    return Response.json({ error: "CSRF state mismatch" }, { status: 403 });
  }

  if (error) {
    return new Response(null, {
      status: 302,
      headers: { Location: `/paciente/perfil?error=calendar_denied` },
    });
  }

  if (!code) {
    return Response.json({ error: "No authorization code" }, { status: 400 });
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/patient/calendar/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    // Use absolute URL for server-side fetch
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const sessionRes = await fetch(`${appUrl}/api/auth/me`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });
    const session = await sessionRes.json();
    if (!session?.user?.id) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    const user = session.user;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiry: new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
      },
    });

    // Limpiar la cookie de state
    const response = NextResponse.redirect(new URL("/paciente/perfil?success=calendar_connected", process.env.NEXT_PUBLIC_APP_URL));
    response.cookies.delete("gcal_oauth_state");
    return response;
  } catch (err) {
    console.error("Calendar callback error:", err);
    return new Response(null, {
      status: 302,
      headers: { Location: `/paciente/perfil?error=calendar_error` },
    });
  }
}