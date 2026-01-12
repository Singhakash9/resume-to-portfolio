import { NextResponse } from "next/server";
import mammoth from "mammoth";

let cachedData: any = null;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No file uploaded" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let text = "";

  // DOCX
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  }

  // TXT
  else if (file.type === "text/plain") {
    text = buffer.toString("utf-8");
  }

  else {
    return NextResponse.json(
      { error: "Only DOCX and TXT supported" },
      { status: 400 }
    );
  }

  cachedData = {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    summary: text.slice(0, 800),
  };

  return NextResponse.json(cachedData);
}

export async function GET() {
  if (!cachedData) {
    return NextResponse.json(
      { error: "No data yet" },
      { status: 404 }
    );
  }

  return NextResponse.json(cachedData);
}

/* ---------- Helpers ---------- */

function extractName(text: string) {
  return text.split("\n")[0]?.trim() || "";
}

function extractEmail(text: string) {
  const match = text.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  );
  return match?.[0] || "";
}

function extractPhone(text: string) {
  const match = text.match(
    /(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/
  );
  return match?.[0] || "";
}
