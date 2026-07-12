import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUserAuth(request);
    if (!user || user.role !== "medico") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        payouts: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!doctorProfile) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      balance: doctorProfile.balance,
      clabe: doctorProfile.clabe,
      bankName: doctorProfile.bankName,
      transactions: doctorProfile.transactions,
      payouts: doctorProfile.payouts,
    });
  } catch (error) {
    console.error("Error fetching doctor finances:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserAuth(request);
    if (!user || user.role !== "medico") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const { amount } = await request.json();

    if (!amount || amount <= 0 || amount > doctorProfile.balance) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!doctorProfile.clabe || !doctorProfile.bankName) {
      return NextResponse.json({ error: "Bank details missing" }, { status: 400 });
    }

    // Atomic transaction to deduct balance and create payout request
    const result = await prisma.$transaction(async (tx) => {
      const updatedDoctor = await tx.doctorProfile.update({
        where: { id: doctorProfile.id },
        data: {
          balance: { decrement: amount },
        },
      });

      const txRecord = await tx.doctorTransaction.create({
        data: {
          doctorId: doctorProfile.id,
          amount: amount,
          type: "withdrawal",
          description: "Retiro de fondos",
          status: "completed",
        },
      });

      const payout = await tx.payout.create({
        data: {
          doctorId: doctorProfile.id,
          amount: amount,
          status: "pending",
          clabe: doctorProfile.clabe,
          bankName: doctorProfile.bankName,
        },
      });

      return { payout, txRecord };
    });

    return NextResponse.json({ success: true, payout: result.payout });
  } catch (error) {
    console.error("Error requesting payout:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
