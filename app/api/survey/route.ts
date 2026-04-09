import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, answers } = await request.json();

    if (!sessionId || !answers) {
      return NextResponse.json(
        { error: "Missing sessionId or answers" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    const { error } = await supabase.from("survey_responses").insert({
      session_id: sessionId,
      answers,
    });

    if (error) {
      console.error("Survey save error:", error);
      return NextResponse.json(
        { error: "Failed to save survey" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
