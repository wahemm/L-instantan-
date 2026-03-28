import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzePhoto(buffer: Buffer, mimeType: string): Promise<string> {
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const vision = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: dataUrl, detail: "high" },
          },
          {
            type: "text",
            text: "Décris cette photo en détail pour recréer une version cartoon hyper réaliste et professionnelle. Décris précisément : le visage de chaque personne (forme, yeux, nez, bouche, sourcils, couleur de peau, coiffure, expression), leurs vêtements et couleurs, leurs positions, le décor et l'arrière-plan, la lumière et l'ambiance. Sois très précis pour que le résultat ressemble exactement aux personnes de la photo. Réponds uniquement avec la description, sans introduction.",
          },
        ],
      },
    ],
    max_tokens: 1000,
  });

  return vision.choices[0]?.message?.content?.trim() ?? "";
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("photos") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No photos" }, { status: 400 });
  }

  const results: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Étape 1 : analyser la photo avec GPT-4o
    const description = await analyzePhoto(buffer, file.type);

    if (!description) {
      return NextResponse.json({ error: "Failed to analyze photo" }, { status: 500 });
    }

    // Étape 2 : générer le cartoon avec gpt-image-1
    const imageFile = await toFile(buffer, file.name, { type: file.type });

    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: `Transform the provided image into a hyper-realistic professional cartoon illustration while preserving the exact facial features and identity of the people in the photo.

Keep the same:
- faces and facial proportions
- pose and body position
- clothing and accessories
- environment and composition

Style requirements:
- ultra detailed semi-realistic cartoon style
- professional digital illustration
- cinematic lighting and soft shadows
- vibrant but natural colors
- clean outlines and smooth shading
- highly detailed skin and facial features
- sharp focus
- 4k quality

The final image should look like a high-end animated movie still (Pixar / modern 3D animation inspired) while still clearly resembling the original photograph.

Additional context from photo analysis: ${description}

NO text. NO speech bubbles. NO captions. NO writing anywhere in the image.`,
      n: 1,
      size: "1024x1024",
    });

    const imageData = response.data?.[0];

    if (imageData?.b64_json) {
      results.push(imageData.b64_json);
    } else if (imageData?.url) {
      const imgRes = await fetch(imageData.url);
      const imgBuffer = await imgRes.arrayBuffer();
      results.push(Buffer.from(imgBuffer).toString("base64"));
    } else {
      return NextResponse.json({ error: "No image returned from OpenAI" }, { status: 500 });
    }
  }

  return NextResponse.json({ images: results });
}
