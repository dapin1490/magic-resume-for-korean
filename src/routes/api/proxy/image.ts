import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/proxy/image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url);
          const imageUrl = searchParams.get("url");

          if (!imageUrl) {
            console.error("Missing image URL parameter");
            return Response.json({ error: "Missing image URL parameter" }, { status: 400 });
          }

          let parsedUrl: URL;
          try {
            parsedUrl = new URL(imageUrl);
          } catch (_error) {
            console.error(`Invalid image URL format: ${imageUrl}`);
            return Response.json({ error: "Invalid image URL format" }, { status: 400 });
          }

          if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
            console.error(`Unsupported URL protocol: ${parsedUrl.protocol}`);
            return Response.json({ error: "Only HTTP and HTTPS protocols are supported" }, { status: 400 });
          }

          let response: Response;
          try {
            response = await fetch(imageUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                Referer: parsedUrl.origin
              }
            });
          } catch (error: any) {
            console.error(`Failed to fetch image: ${error.message || "Unknown error"}`);
            return Response.json({ error: `Failed to fetch image: ${error.message || "Unknown error"}` }, { status: 500 });
          }

          if (!response.ok) {
            console.error(`Image server returned an error: ${response.status} ${response.statusText}`);
            return Response.json({ error: `Failed to fetch image: ${response.status} ${response.statusText}` }, { status: response.status });
          }

          let imageBuffer: ArrayBuffer;
          try {
            imageBuffer = await response.arrayBuffer();
          } catch (error: any) {
            console.error(`Failed to read image content: ${error.message || "Unknown error"}`);
            return Response.json({ error: `Failed to read image content: ${error.message || "Unknown error"}` }, { status: 500 });
          }

          if (imageBuffer.byteLength === 0) {
            console.error("Image content is empty");
            return Response.json({ error: "Image content is empty" }, { status: 400 });
          }

          const contentType = response.headers.get("content-type") || "image/jpeg";

          return new Response(imageBuffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
              "Surrogate-Control": "no-store",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type"
            }
          });
        } catch (error: any) {
          console.error("Unhandled image proxy error:", error);
          return Response.json({ error: `Error while processing image request: ${error.message || "Unknown error"}` }, { status: 500 });
        }
      }
    }
  }
});
