import { NextResponse } from "next/server";
import { getContent, getConfig } from "@/lib/data-reader";

export async function GET() {
  try {
    const content = getContent();
    const config = getConfig();

    return NextResponse.json({ content, config }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al leer los datos" },
      { status: 500 }
    );
  }
}
