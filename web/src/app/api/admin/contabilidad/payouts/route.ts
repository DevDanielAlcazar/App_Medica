import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUserAuth(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cycleId = searchParams.get("cycleId");
    
    let whereClause = {};
    if (cycleId) {
      whereClause = { cycleId };
    }

    const payouts = await prisma.payout.findMany({
      where: whereClause,
      include: {
        doctor: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payouts });
  } catch (error) {
    console.error("Error fetching payouts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserAuth(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { payoutId, status, receiptUrl } = data;

    if (!payoutId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const payout = await prisma.payout.update({
      where: { id: payoutId },
      data: {
        status,
        ...(receiptUrl && { receiptUrl }),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        role: user.role,
        action: "update_payout_status",
        entity: "Payout",
        details: { payoutId, status },
      },
    });

    return NextResponse.json({ payout });
  } catch (error) {
    console.error("Error updating payout:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
