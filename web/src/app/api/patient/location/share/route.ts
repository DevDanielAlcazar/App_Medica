import { NextRequest } from "next/server";

interface LocationShareToken {
  token: string;
  expiresAt: string;
  expiresInSeconds: number;
}

const shareTokens = new Map<string, LocationShareToken>();

export async function POST(req: NextRequest) {
  try {
    const { lat, lng, hours } = await req.json();

    if (typeof lat !== "number" || typeof lng !== "number") {
      return Response.json(
        { success: false, error: "Lat/Lng inválidos" },
        { status: 400 }
      );
    }

    const expiresInSeconds = Math.max(1, Math.min(24, hours || 1)) * 3600;
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
    
    const tokenId = `loc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const tokenUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://angelicamed.com"}/api/patient/location/view/${tokenId}`;

    shareTokens.set(tokenId, {
      token: tokenUrl,
      expiresAt,
      expiresInSeconds,
    });

    setTimeout(() => shareTokens.delete(tokenId), expiresInSeconds * 1000);

    return Response.json({
      success: true,
      token: tokenUrl,
      expiresAt,
      expiresInHours: Math.max(1, Math.min(24, hours || 1)),
    });
  } catch (err) {
    console.error("Location share error:", err);
    return Response.json(
      { success: false, error: "Error generando enlace de ubicación" },
      { status: 500 }
    );
  }
}