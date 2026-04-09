// Text overlay is now handled by the prompt telling Flux to NOT add text,
// and we skip server-side text compositing to avoid native dependency issues.
// The "I am Name" text could be overlaid client-side on the result screen if needed.

export async function addTextOverlay(
  imageBuffer: Buffer,
  _name: string
): Promise<Buffer> {
  // Pass through — no server-side text overlay
  // Text is handled in the AI prompt or client-side
  return imageBuffer;
}
