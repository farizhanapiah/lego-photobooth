import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get("photo") as File;
    const sessionId = formData.get("sessionId") as string;

    if (!photo || !sessionId) {
      return NextResponse.json(
        { error: "Missing photo or sessionId" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Upload photo to Supabase Storage
    const buffer = Buffer.from(await photo.arrayBuffer());
    const storagePath = `photos/${sessionId}/original.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(storagePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload photo" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(storagePath);

    // Update session with photo URL
    await supabase
      .from("sessions")
      .update({ photo_url: urlData.publicUrl })
      .eq("id", sessionId);

    // Trigger AI generation
    const generateRes = await fetch(
      new URL("/api/generate", request.url).toString(),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }
    );

    const generateData = await generateRes.json();

    return NextResponse.json({
      success: true,
      taskId: generateData.taskId || null,
      pollingUrl: generateData.pollingUrl || null,
    });
  } catch (err) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
