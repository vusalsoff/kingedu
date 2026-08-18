import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    let url = searchParams.get("url");

    if (!id && url) {
      const trimmed = url.trim();
      const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        id = idMatch[1];
      } else if (dMatch && dMatch[1]) {
        id = dMatch[1];
      }
    }

    if (!id && !url) {
      return NextResponse.redirect(new URL("/img/Icon.jpeg", request.url));
    }

    const urlsToTry = [];
    if (id) {
      // 1. Thumbnail API (high quality and direct)
      urlsToTry.push(`https://drive.google.com/thumbnail?id=${id}&sz=w1000`);
      // 2. Direct view link
      urlsToTry.push(`https://drive.google.com/uc?export=view&id=${id}`);
      // 3. Direct download link
      urlsToTry.push(`https://drive.google.com/uc?export=download&id=${id}`);
    } else if (url) {
      urlsToTry.push(url);
    }

    for (const targetUrl of urlsToTry) {
      try {
        const res = await fetch(targetUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
          },
          redirect: "follow",
          cache: "no-store"
        });

        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          // Ensure we received image or binary stream, not an HTML error/login page
          if (contentType.includes("image/") || contentType.includes("octet-stream") || contentType.includes("binary")) {
            const arrayBuffer = await res.arrayBuffer();
            if (arrayBuffer.byteLength > 500) {
              return new NextResponse(Buffer.from(arrayBuffer), {
                status: 200,
                headers: {
                  "Content-Type": contentType.includes("image/") ? contentType : "image/jpeg",
                  "Cache-Control": "public, max-age=86400, s-maxage=86400",
                  "Access-Control-Allow-Origin": "*"
                }
              });
            }
          }
        }
      } catch (e) {
        console.warn(`[Image Proxy] Failed to fetch ${targetUrl}:`, e.message);
      }
    }

    // If all attempts fail, redirect cleanly to placeholder
    return NextResponse.redirect(new URL("/img/Icon.jpeg", request.url));
  } catch (error) {
    console.error("[Image Proxy] Fatal error:", error);
    return NextResponse.redirect(new URL("/img/Icon.jpeg", request.url));
  }
}
