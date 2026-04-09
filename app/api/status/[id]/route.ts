import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getFluxResult } from "@/lib/flux-pro";
import { addTextOverlay } from "@/lib/text-overlay";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Missing task ID" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Find the session by task ID
    const { data: session } = await supabase
      .from("sessions")
      .select("id, name")
      .eq("generation_task_id", taskId)
      .single();

    // Use the BFL polling URL (may be on a regional subdomain)
    const pollingUrl = `https://api.bfl.ai/v1/get_result?id=${taskId}`;
    const result = await getFluxResult(pollingUrl);

    if (result.status === "Ready" && result.resultUrl && session) {
      // Download the generated image from Flux Pro
      const imageResponse = await fetch(result.resultUrl);
      const rawBuffer = Buffer.from(await imageResponse.arrayBuffer());

      // Add "I am Name" text overlay with proper branding font
      const imageBuffer = await addTextOverlay(rawBuffer, session.name);

      // Upload to Supabase Storage
      const storagePath = `photos/${session.id}/result.jpg`;
      await supabase.storage
        .from("photos")
        .upload(storagePath, imageBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(storagePath);

      // Update session
      await supabase
        .from("sessions")
        .update({
          result_url: urlData.publicUrl,
          status: "complete",
          completed_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      return NextResponse.json({
        status: "complete",
        progress: 100,
        resultUrl: urlData.publicUrl,
      });
    }

    // Map BFL statuses to progress
    const progressMap: Record<string, number> = {
      Pending: 15,
      Processing: 50,
      Moderated: 0,
      Error: 0,
    };

    const progress = progressMap[result.status] ?? 30;

    if (result.status === "Error" || result.status === "Moderated") {
      return NextResponse.json({
        status: "error",
        progress: 0,
      });
    }

    return NextResponse.json({
      status: "processing",
      progress,
    });
  } catch (err) {
    console.error("Status check error:", err);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
