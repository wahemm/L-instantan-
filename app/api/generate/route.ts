import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    const output = await replicate.run(
      "catacolabs/cartoonify:f109015d60170dfb20460f17da8cb863155823c85ece1115e1e9e4ec7ef51d3b",
      { input: { image: buffer } }
    );

    console.log("OUTPUT TYPE:", typeof output, "OUTPUT VALUE:", JSON.stringify(output));

    const imageUrl = typeof output === 'string' ? output : Array.isArray(output) ? output[0] : (output as any).url?.() ?? (output as any).toString();

    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    results.push(Buffer.from(imgBuffer).toString("base64"));
  }

  return NextResponse.json({ images: results });
}
