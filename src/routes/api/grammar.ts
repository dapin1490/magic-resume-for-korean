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

export const Route = createFileRoute("/api/grammar")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { apiKey, model, content, modelType, apiEndpoint } = body as {
            apiKey: string;
            model: string;
            content: string;
            modelType: AIModelType;
            apiEndpoint?: string;
          };

          const modelConfig = AI_MODEL_CONFIGS[modelType as AIModelType];
          if (!modelConfig) {
            throw new Error("Invalid model type");
          }

          const systemPrompt = `You are a resume proofreading assistant. Work in the same language and script as the user's text. Your task is to identify **only** objective misspellings and clear punctuation mistakes—nothing else.

            **Strictly forbidden**:
            1. ❌ Do **not** offer style, tone, polishing, or rewriting suggestions. If usage is acceptable in context, do **not** report it.
            2. ❌ Do **not** return filler such as "no errors found". If there are no issues, the "errors" array must be empty.
            3. ❌ Do **not** "fix" domain terms, names, product names, or stack keywords unless the source text clearly shows a typo.

            **Only these two categories**:
            1. ✅ **Misspellings**: wrong letters, characters, or tokens for an intended word in that language or script.
            2. ✅ **Serious punctuation errors**: duplicated closing punctuation, broken pairs (e.g. unmatched quotes), or placement that is clearly wrong for the sentence—not stylistic choices.

            **Do not report (common false positives)**:
            - ❌ **Locale or house style**: mixed punctuation conventions, straight vs curly quotes, or choices typical of technical resumes.
            - ❌ **Spacing**: optional or inconsistent spaces around numbers, URLs, slashes, or between segments in different scripts.

            Return a single JSON object with this shape:
            {
              "errors": [
                {
                  "context": "Full sentence or line containing the issue (verbatim from the source)",
                  "text": "Exact erroneous fragment (must appear verbatim in the source)",
                  "suggestion": "Minimal corrected fragment only (not a full rewrite unless the whole span is wrong)",
                  "reason": "Short label in the same language as the source",
                  "type": "spelling"
                }
              ]
            }

            **Output rule**: report only misspellings and clear punctuation errors; never polish or rewrite unrelated text.`;

          if (modelType === "gemini") {
            const geminiModel = model || "gemini-flash-latest";
            const modelInstance = getGeminiModelInstance({
              apiKey,
              model: geminiModel,
              systemInstruction: systemPrompt,
              generationConfig: {
                temperature: 0,
                responseMimeType: "application/json",
              },
            });

            const result = await modelInstance.generateContent(content);
            const text = result.response.text() || "";

            return Response.json({
              choices: [
                {
                  message: {
                    content: text,
                  },
                },
              ],
            });
          }

          const response = await fetch(modelConfig.url(apiEndpoint), {
            method: "POST",
            headers: modelConfig.headers(apiKey),
            body: JSON.stringify({
              model: modelConfig.requiresModelId ? model : modelConfig.defaultModel,
              response_format: {
                type: "json_object"
              },
              messages: [
                {
                  role: "system",
                  content: systemPrompt
                },
                {
                  role: "user",
                  content
                }
              ]
            })
          });

          const raw = await response.text();
          if (!response.ok) {
            const fallbackMessage = `Upstream API error: ${response.status} ${response.statusText}`;
            const parsedError = parseUpstreamError(raw, fallbackMessage);
            return Response.json(
              { error: parsedError },
              { status: response.status }
            );
          }

          let data: unknown;
          try {
            data = raw ? JSON.parse(raw) : {};
          } catch {
            return Response.json(
              { error: "Invalid upstream response: expected JSON payload" },
              { status: 502 }
            );
          }

          return Response.json(data);
        } catch (error) {
          console.error("Error in grammar check:", error);
          return Response.json(
            { error: formatGeminiErrorMessage(error) },
            { status: 500 }
          );
        }
      }
    }
  }
});
