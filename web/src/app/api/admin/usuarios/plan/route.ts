import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { userId, planId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { planId: planId || null },
    });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("Plan assign error:", err);
    return NextResponse.json({ error: "Error assigning plan" }, { status: 500 });
  }
}