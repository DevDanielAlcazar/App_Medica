import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getDoctorUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "medico") return null;
  return user;
}

export async function GET() {
  try {
    const user = await getDoctorUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get doctor profile
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: user.id },
    });

    // Today appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await prisma.appointment.count({
      where: {
        doctorId: user.id,
        dateTime: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Pending payouts
    const pendingPayouts = await prisma.payout.count({
      where: {
        doctorId: doctorProfile?.id,
        status: "pending",
      },
    });

    // Monthly earnings
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const earnings = await prisma.payout.aggregate({
      where: {
        doctorId: doctorProfile?.id,
        status: "paid",
        createdAt: { gte: firstOfMonth },
      },
      _sum: { amount: true },
    });

    return NextResponse.json({
      success: true,
      todayAppointments,
      pendingPayouts,
      verificationStatus: doctorProfile?.verificationStatus || "pendiente",
      monthlyEarnings: earnings._sum.amount || 0,
    });
  } catch (error) {
    console.error("Error fetching doctor dashboard:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}