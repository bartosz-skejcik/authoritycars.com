import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "phone",
      "name",
      "budget_from",
      "budget_to",
      "vehicle_type",
      "status_id",
    ];
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Ensure budget values are valid numbers
    if (isNaN(data.budget_from) || isNaN(data.budget_to)) {
      return NextResponse.json(
        { error: "Budget values must be valid numbers" },
        { status: 400 },
      );
    }

    // Ensure budget_from is less than budget_to
    if (data.budget_from > data.budget_to) {
      return NextResponse.json(
        {
          error:
            "Budget from value must be less than or equal to budget to value",
        },
        { status: 400 },
      );
    }

    // Insert the submission into the database
    const { data: submission, error } = await supabase
      .from("submissions")
      .insert({
        phone: data.phone,
        name: data.name,
        budget_from: data.budget_from,
        budget_to: data.budget_to,
        vehicle_type: data.vehicle_type,
        status_id: data.status_id,
        ref: data.ref || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating submission:", error);
      return NextResponse.json(
        { error: "Failed to create submission" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: submission },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
