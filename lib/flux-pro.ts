const BFL_API_BASE = "https://api.bfl.ai";

export function buildPrompt(name: string, gender: "male" | "female"): string {
  const genderDesc = gender === "male" ? "male" : "female";
  return `Replace the main central lego minifigure in image 1 (the poster) with a new ${genderDesc} lego minifigure based on the person shown in image 2 (the photo reference).

The new minifigure MUST be clearly ${genderDesc} and closely resemble the person in image 2: match their exact hair color, hair style, skin tone, facial hair if any, glasses if any, and clothing color and style. If they wear a hat or cap, give the minifigure a matching LEGO hat piece. If they have a beard or mustache, add it to the minifigure face. Copy the outfit colors and style from the reference photo onto the minifigure torso and legs.

Pose the new minifigure like it is running, in a dynamic forward-leaning pose with arms and legs mid-stride.

Keep EVERYTHING else from the original poster (image 1) exactly the same: the LEGO logo on the top left, the Petronas Twin Towers in the background, the colorful LEGO baseplate ground, all floating bricks in the sky, all the other smaller minifigure characters on the sides, the birds and animals, and the "MY PLAY FESTIVAL" branding at the bottom.

Do NOT add any extra text or titles to the image. Keep the top area of the poster clear with just the sky and towers. Make sure the LEGO logo on top left is always visible`;
}

export async function submitFluxGeneration(
  prompt: string,
  posterBase64: string,
  userPhotoBase64: string
): Promise<{ taskId: string; pollingUrl: string }> {
  const response = await fetch(`${BFL_API_BASE}/v1/flux-2-pro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Key": process.env.BFL_API_KEY!,
    },
    body: JSON.stringify({
      prompt,
      input_image: `data:image/jpeg;base64,${posterBase64}`,
      input_image_2: `data:image/jpeg;base64,${userPhotoBase64}`,
      safety_tolerance: 2,
      output_format: "jpeg",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Flux 2 Pro API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return {
    taskId: data.id,
    pollingUrl: data.polling_url || `${BFL_API_BASE}/v1/get_result?id=${data.id}`,
  };
}

export async function getFluxResult(
  pollingUrl: string
): Promise<{ status: string; resultUrl?: string }> {
  const response = await fetch(pollingUrl, {
    headers: {
      "X-Key": process.env.BFL_API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(`Flux status check failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.status === "Ready" && data.result?.sample) {
    return { status: "Ready", resultUrl: data.result.sample };
  }

  return { status: data.status };
}
