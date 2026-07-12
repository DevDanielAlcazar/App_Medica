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

    const cycles = await prisma.accountingCycle.findMany({
      orderBy: { startDate: "desc" },
      include: {
        _count: {
          select: { payouts: true },
        },
      },
    });

    return NextResponse.json({ cycles });
  } catch (error) {
    console.error("Error fetching accounting cycles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { periodName, startDate, endDate } = data;

    if (!periodName || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cycle = await prisma.accountingCycle.create({
      data: {
        periodName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "open",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        role: user.role,
        action: "create_accounting_cycle",
        entity: "AccountingCycle",
        details: { cycleId: cycle.id, periodName: cycle.periodName },
      },
    });

    return NextResponse.json({ cycle }, { status: 201 });
  } catch (error) {
    console.error("Error creating accounting cycle:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}