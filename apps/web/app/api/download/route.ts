// app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const filename = request.nextUrl.searchParams.get("filename");

  if (!url || !filename) {
    return new NextResponse("Missing url or filename", { status: 400 });
  }

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type":
        response.headers.get("Content-Type") || "application/octet-stream",
    },
  });
}
