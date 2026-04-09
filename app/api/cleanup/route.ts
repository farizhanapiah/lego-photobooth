import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    // Find sessions older than 24 hours
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: oldSessions, error: queryError } = await supabase
      .from("sessions")
      .select("id")
      .lt("created_at", cutoff);

    if (queryError) {
      console.error("Cleanup query error:", queryError);
      return NextResponse.json({ error: "Query failed" }, { status: 500 });
    }

    if (!oldSessions || oldSessions.length === 0) {
      return NextResponse.json({ cleaned: 0 });
    }

    // Delete storage files for each session
    for (const session of oldSessions) {
      const filesToDelete = [
        `photos/${session.id}/original.jpg`,
        `photos/${session.id}/result.jpg`,
      ];

      await supabase.storage.from("photos").remove(filesToDelete);
    }

    // Delete session rows (cascades to survey_responses)
    const sessionIds = oldSessions.map((s) => s.id);
    const { error: deleteError } = await supabase
      .from("sessions")
      .delete()
      .in("id", sessionIds);

    if (deleteError) {
      console.error("Cleanup delete error:", deleteError);
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }

    console.log(`Cleaned up ${oldSessions.length} sessions`);
    return NextResponse.json({ cleaned: oldSessions.length });
  } catch (err) {
    console.error("Cleanup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
