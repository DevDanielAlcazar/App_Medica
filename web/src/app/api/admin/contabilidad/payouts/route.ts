import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) return null;
  return user;
}

export async function GET(request: Request) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cycleId = searchParams.get("cycleId");

    let whereClause: any = {};
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
    const user = await getAdminUser();
    if (!user) {
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