import { getSupabaseServer } from "@/lib/supabase-server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = getSupabaseServer();
  const { data: session } = await supabase.from("sessions").select("name, result_url").eq("id", id).single();

  return {
    title: session ? `${session.name}'s LEGO Minifigure — My Play Festival` : "My Play Festival",
    description: "Check out my LEGO Minifigure from My Play Festival!",
    openGraph: {
      images: session?.result_url ? [session.result_url] : [],
    },
  };
}

export default async function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseServer();
  const { data: session } = await supabase.from("sessions").select("name, result_url").eq("id", id).single();

  if (!session?.result_url) {
    return (
      <div style={{
        fontFamily: "'Nunito', system-ui, sans-serif",
        background: "linear-gradient(135deg, #FFCF00 0%, #E3000B 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}>
        <p style={{
          fontFamily: "'Fredoka', system-ui, sans-serif",
          fontSize: "28px",
          fontWeight: 700,
          color: "white",
          textAlign: "center",
        }}>
          Photo not found or has expired.
          <br />
          <span style={{ fontSize: "18px", fontWeight: 400, opacity: 0.8 }}>
            Photos are deleted after 24 hours.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Nunito', system-ui, sans-serif",
      background: "linear-gradient(135deg, #FFCF00 0%, #E3000B 100%)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@700&family=Nunito:wght@600;700&display=swap" rel="stylesheet" />

      <div style={{
        background: "white",
        borderRadius: "24px",
        padding: "24px",
        maxWidth: "500px",
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "'Fredoka', system-ui, sans-serif",
          fontSize: "28px",
          color: "#1D1D1B",
          marginBottom: "16px",
        }}>
          {session.name}&apos;s LEGO Minifigure
        </h1>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={session.result_url}
          alt={`${session.name}'s LEGO Minifigure`}
          style={{
            width: "100%",
            borderRadius: "16px",
            marginBottom: "16px",
          }}
        />

        <a
          href={session.result_url}
          download={`${session.name}_lego_minifigure.jpg`}
          style={{
            display: "inline-block",
            background: "#E3000B",
            color: "white",
            fontFamily: "'Fredoka', system-ui, sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            textTransform: "uppercase",
            padding: "14px 40px",
            borderRadius: "50px",
            border: "3px solid #1D1D1B",
            boxShadow: "0 4px 0 #1D1D1B",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Save Image
        </a>
      </div>

      <p style={{
        marginTop: "16px",
        fontSize: "14px",
        color: "rgba(255,255,255,0.8)",
      }}>
        LEGO My Play Festival 2026 | Kuala Lumpur
      </p>
    </div>
  );
}
