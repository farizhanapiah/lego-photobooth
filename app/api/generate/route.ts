import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { buildPrompt, submitFluxGeneration } from "@/lib/flux-pro";
import { readFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Get session data
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("name, gender, photo_url")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Get poster image as base64
    const posterPath = join(process.cwd(), "public", "myplayfestival_poster.jpeg");
    const posterBuffer = await readFile(posterPath);
    const posterBase64 = posterBuffer.toString("base64");

    // Download user photo from Supabase Storage
    const photoStoragePath = `photos/${sessionId}/original.jpg`;
    const { data: photoData, error: downloadError } = await supabase.storage
      .from("photos")
      .download(photoStoragePath);

    if (downloadError || !photoData) {
      return NextResponse.json(
        { error: "Failed to download user photo" },
        { status: 500 }
      );
    }

    const photoBuffer = Buffer.from(await photoData.arrayBuffer());
    const userPhotoBase64 = photoBuffer.toString("base64");

    // Build prompt and submit to Flux Pro
    const prompt = buildPrompt(session.name, session.gender);
    const { taskId, pollingUrl } = await submitFluxGeneration(
      prompt,
      posterBase64,
      userPhotoBase64
    );

    // Update session with task ID and polling URL
    await supabase
      .from("sessions")
      .update({
        generation_task_id: taskId,
        status: "processing",
      })
      .eq("id", sessionId);

    return NextResponse.json({ taskId, pollingUrl });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Failed to start generation" },
      { status: 500 }
    );
  }
}
