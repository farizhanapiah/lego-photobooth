const BFL_API_BASE = "https://api.bfl.ai";

export function buildPrompt(name: string, gender: "male" | "female"): string {
  const genderDesc = gender === "male" ? "male" : "female";
  return `EDIT TASK: Take the LEGO My Play Festival poster (input_image) and modify it by replacing the main central LEGO minifigure character.

REFERENCE FACE (input_image_2): A real photograph of a ${genderDesc} person. Study this photo carefully — note their hair color, hair style, skin tone, facial features, age, any facial hair, glasses, hat, and clothing colors.

WHAT TO DO: In the output, the central running minifigure must be a NEW ${genderDesc} LEGO minifigure that visually represents the person from input_image_2 in LEGO style. Make it look like a LEGO version of that specific person — same hair color and style as a LEGO hair piece, same skin if dark/light, matching outfit colors on the torso, and a running pose with legs mid-stride.

KEEP from the original poster: the LEGO logo top-left, Petronas Twin Towers, rainbow brick towers, colorful baseplate ground, floating LEGO bricks, the smaller side characters (Malaysia shirt minifig, burger minifig, parrot, tiger), and the "MY Play Festival" branding at the bottom.

Add the title "I am ${name}" at the top of the poster in the same bold playful 3D LEGO-style lettering as the "Play Festival" text below, with red, yellow and white colors and thick black outlines.

The output MUST be visibly different from the input — the central minifigure must clearly be a NEW character that looks like the person in input_image_2, not the original "I Love Malaysia" minifigure.`;
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
