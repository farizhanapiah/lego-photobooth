import sharp from "sharp";

export async function addTextOverlay(
  imageBuffer: Buffer,
  name: string
): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const width = metadata.width || 768;
  const height = metadata.height || 1344;

  const text = `I am ${name}`;
  const fontSize = Math.round(width * 0.09);
  const topOffset = Math.round(height * 0.02);

  // Create SVG text overlay with bold style matching the poster
  const svgText = `
    <svg width="${width}" height="${Math.round(fontSize * 2.5)}">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700');
        </style>
        <filter id="shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="#1D1D1B" flood-opacity="0.7"/>
        </filter>
      </defs>
      <text
        x="50%"
        y="65%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Fredoka, Impact, Arial Black, sans-serif"
        font-weight="700"
        font-size="${fontSize}px"
        fill="#FFCF00"
        stroke="#E3000B"
        stroke-width="${Math.round(fontSize * 0.08)}"
        paint-order="stroke"
        filter="url(#shadow)"
        letter-spacing="2"
      >${escapeXml(text)}</text>
    </svg>
  `;

  const textBuffer = Buffer.from(svgText);

  const result = await image
    .composite([
      {
        input: textBuffer,
        top: topOffset,
        left: 0,
      },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();

  return result;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
