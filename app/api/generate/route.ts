import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("photos") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No photos provided" }, { status: 400 });
  }

  const results: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Input = buffer.toString("base64");

    const imageFile = await toFile(buffer, file.name, { type: file.type });

    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt:
        "Transform this photo into a comic book cartoon style. Keep exactly the same faces, people, positions, landscape and composition. Only change the artistic style to colorful cartoon with bold black outlines. Do not add any text or bubbles.",
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
      return NextResponse.json(
        { error: "No image returned from OpenAI" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ images: results });
}
