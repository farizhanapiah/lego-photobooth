import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    if (!sessionId) {
      return new NextResponse(renderPage("Photo Not Found", null), {
        headers: { "Content-Type": "text/html" },
      });
    }

    const supabase = getSupabaseServer();

    const { data: session } = await supabase
      .from("sessions")
      .select("name, result_url")
      .eq("id", sessionId)
      .single();

    if (!session?.result_url) {
      return new NextResponse(renderPage("Photo Not Found", null), {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new NextResponse(renderPage(session.name, session.result_url), {
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return new NextResponse(renderPage("Error", null), {
      headers: { "Content-Type": "text/html" },
    });
  }
}

function renderPage(name: string, imageUrl: string | null): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}'s LEGO Minifigure — My Play Festival</title>
  <meta property="og:title" content="${name}'s LEGO Minifigure" />
  <meta property="og:description" content="Check out my LEGO Minifigure from My Play Festival!" />
  ${imageUrl ? `<meta property="og:image" content="${imageUrl}" />` : ""}
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@700&family=Nunito:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Nunito', sans-serif;
      background: linear-gradient(135deg, #FFCF00 0%, #E3000B 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 24px;
      padding: 24px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      text-align: center;
    }
    h1 {
      font-family: 'Fredoka', sans-serif;
      font-size: 28px;
      color: #1D1D1B;
      margin-bottom: 16px;
    }
    img {
      width: 100%;
      border-radius: 16px;
      margin-bottom: 16px;
    }
    .btn {
      display: inline-block;
      background: #E3000B;
      color: white;
      font-family: 'Fredoka', sans-serif;
      font-size: 20px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 14px 40px;
      border-radius: 50px;
      border: 3px solid #1D1D1B;
      box-shadow: 0 4px 0 #1D1D1B;
      text-decoration: none;
      cursor: pointer;
    }
    .btn:active {
      box-shadow: 0 2px 0 #1D1D1B;
      transform: translateY(2px);
    }
    .footer {
      margin-top: 16px;
      font-size: 14px;
      color: rgba(255,255,255,0.8);
    }
    .not-found {
      color: white;
      font-family: 'Fredoka', sans-serif;
      font-size: 32px;
      text-align: center;
    }
  </style>
</head>
<body>
  ${
    imageUrl
      ? `
    <div class="card">
      <h1>${name}'s LEGO Minifigure</h1>
      <img src="${imageUrl}" alt="${name}'s LEGO Minifigure" />
      <a class="btn" href="${imageUrl}" download="${name}_lego_minifigure.jpg">
        Save Image
      </a>
    </div>
    <p class="footer">LEGO My Play Festival 2026 | Kuala Lumpur</p>
  `
      : `
    <p class="not-found">Photo not found or has expired.<br>Photos are deleted after 24 hours.</p>
  `
  }
</body>
</html>`;
}
