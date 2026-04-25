import { createFileRoute } from "@tanstack/react-router";
import { AIModelType, AI_MODEL_CONFIGS } from "@/config/ai";
import { formatGeminiErrorMessage, getGeminiModelInstance } from "@/lib/server/gemini";

const parseUpstreamError = (raw: string, fallback: string) => {
  if (!raw) return { message: fallback };
  try {
    const data = JSON.parse(raw) as {
      error?: { message?: string; code?: string };
      message?: string;
    };
    return {
      message: data.error?.message || data.message || fallback,
      code: data.error?.code
    };
  } catch {
    return { message: raw };
  }
};

export const Route = createFileRoute("/api/polish")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { apiKey, model, content, modelType, apiEndpoint, customInstructions } = body as {
            apiKey: string;
            model: string;
            content: string;
            modelType: AIModelType;
            apiEndpoint?: string;
            customInstructions?: string;
          };

          const modelConfig = AI_MODEL_CONFIGS[modelType as AIModelType];
          if (!modelConfig) {
            throw new Error("Invalid model type");
          }

          let systemPrompt = `You are a resume polishing assistant. Improve the Markdown supplied by the user while keeping the same language(s) and script(s) as the source. Do not translate the resume into another language unless the user text is already bilingual in a consistent way.

              Polishing principles:
              1. Use clearer, more professional wording while staying faithful to facts.
              2. Emphasize concrete outcomes and relevant skills where the source supports it.
              3. Keep sentences concise and readable.
              4. Prefer direct, confident phrasing without changing meaning.
              5. Preserve all factual content (dates, titles, employers, metrics, links).
              6. Preserve the original Markdown structure (list depth, emphasis, links, headings).

              Output constraints (must follow):
              1. Output only the polished body, with no wrapper or commentary.
              2. No prefaces, explanations, summaries, or meta-advice to the reader.
              3. No filler openers such as "Here is...", "Below...", "In summary...", or similar.
              4. Do not invent new sections or closing paragraphs not grounded in the source.
              5. Do not wrap the result in Markdown code fences (\`\`\`).
              6. Strip any accidental explanatory text; the final message must be only the polished Markdown.`;

          if (customInstructions?.trim()) {
            systemPrompt += `\n\nAdditional user instructions:\n${customInstructions.trim()}`;
          }

          if (modelType === "gemini") {
            const geminiModel = model || "gemini-flash-latest";
            const modelInstance = getGeminiModelInstance({
              apiKey,
              model: geminiModel,
              systemInstruction: systemPrompt,
              generationConfig: {
                temperature: 0.4,
              },
            });

            const encoder = new TextEncoder();

            const stream = new ReadableStream({
              async start(controller) {
                try {
                  const result = await modelInstance.generateContentStream(content);
                  for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    if (chunkText) {
                      controller.enqueue(encoder.encode(chunkText));
                    }
                  }
                } catch (error) {
                  controller.error(error);
                  return;
                }
                controller.close();
              },
            });

            return new Response(stream, {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive"
              }
            });
          }

          const response = await fetch(modelConfig.url(apiEndpoint), {
            method: "POST",
            headers: modelConfig.headers(apiKey),
            body: JSON.stringify({
              model: modelConfig.requiresModelId ? model : modelConfig.defaultModel,
              messages: [
                {
                  role: "system",
                  content: systemPrompt
                },
                {
                  role: "user",
                  content
                }
              ],
              stream: true
            })
          });

          if (!response.ok) {
            const fallbackMessage = `Upstream API error: ${response.status} ${response.statusText}`;
            const rawError = await response.text();
            const parsedError = parseUpstreamError(rawError, fallbackMessage);
            return Response.json(
              { error: parsedError },
              { status: response.status }
            );
          }

          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            async start(controller) {
              if (!response.body) {
                controller.close();
                return;
              }

              const reader = response.body.getReader();
              const decoder = new TextDecoder();
              let pending = "";

              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) {
                    break;
                  }

                  pending += decoder.decode(value, { stream: true });
                  const lines = pending.split(/\r?\n/);
                  pending = lines.pop() ?? "";

                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith("data:")) continue;

                    try {
                      const payload = trimmed.slice(5).trim();
                      if (!payload || payload === "[DONE]") continue;

                      const data = JSON.parse(payload) as {
                        error?: { message?: string };
                        choices?: Array<{ delta?: { content?: string } }>;
                      };
                      if (data.error?.message) {
                        controller.error(new Error(data.error.message));
                        return;
                      }

                      const deltaContent = data.choices?.[0]?.delta?.content;
                      if (deltaContent) {
                        controller.enqueue(encoder.encode(deltaContent));
                      }
                    } catch (e) {
                      console.error("Error parsing JSON:", e);
                    }
                  }
                }

                const tail = (pending + decoder.decode()).trim();
                if (tail.startsWith("data:")) {
                  const payload = tail.slice(5).trim();
                  if (payload && payload !== "[DONE]") {
                    const data = JSON.parse(payload) as {
                      choices?: Array<{ delta?: { content?: string } }>;
                    };
                    const deltaContent = data.choices?.[0]?.delta?.content;
                    if (deltaContent) {
                      controller.enqueue(encoder.encode(deltaContent));
                    }
                  }
                }

                controller.close();
              } catch (error) {
                console.error("Stream reading error:", error);
                controller.error(error);
              }
            }
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive"
            }
          });
        } catch (error) {
          console.error("Polish error:", error);
          return Response.json(
            { error: formatGeminiErrorMessage(error) },
            { status: 500 }
          );
        }
      }
    }
  }
});
