import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Verify the user's session.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Extract data from the request body.
    const { plan, subscriptionId } = await request.json();

    // Basic validation: Check if plan is provided.
    if (!plan) {
      return new NextResponse(JSON.stringify({ error: "Plan is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Define allowed plans.  This is important for security.
    const allowedPlans = ["free", "basic", "pro"];
    if (!allowedPlans.includes(plan)) {
      return new NextResponse(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Update the user's 'plan' field in the database using Prisma.
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email!, // Use email from session
      },
      data: {
        plan: plan,
        // subscriptionId: subscriptionId, // Optional: Store the subscription ID
      },
    });

    // 4. Return a success response.
    return new NextResponse(
      JSON.stringify({
        message: "Plan upgraded successfully",
        user: updatedUser,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    // Handle errors, especially database errors.
    console.error("Error upgrading plan:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to upgrade plan",
        details: error.message,
      }),
      {
        status: 500, // Internal Server Error
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
