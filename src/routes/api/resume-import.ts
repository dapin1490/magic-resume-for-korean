import { createFileRoute } from "@tanstack/react-router";
import { formatGeminiErrorMessage, getGeminiModelInstance } from "@/lib/server/gemini";

const parseJsonPayload = (content: string) => {
  const text = content.trim();
  try {
    return JSON.parse(text);
  } catch (error) {}

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch (error) {}
  }

  const objectBlock = text.match(/\{[\s\S]*\}/);
  if (objectBlock?.[0]) {
    try {
      return JSON.parse(objectBlock[0]);
    } catch (error) {}
  }

  return null;
};

const extractBase64Payload = (value: string) => {
  const matched = value.match(/^data:(.*?);base64,(.*)$/);
  if (matched) {
    return {
      mimeType: matched[1] || "image/jpeg",
      data: matched[2] || "",
    };
  }

  return {
    mimeType: "image/jpeg",
    data: value,
  };
};

export const Route = createFileRoute("/api/resume-import")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { apiKey, model, content, images, locale } = body as {
            apiKey: string;
            model?: string;
            content?: string;
            images?: string[];
            locale?: string;
          };

          if (!apiKey || (!content && (!images || images.length === 0))) {
            return Response.json(
              { error: "Missing API key or resume content/images" },
              { status: 400 }
            );
          }

          const geminiModel = model || "gemini-flash-latest";
          const imageParts = Array.isArray(images)
            ? images.map((image) => {
                const payload = extractBase64Payload(image);
                return {
                  inlineData: {
                    mimeType: payload.mimeType,
                    data: payload.data,
                  },
                };
              })
            : [];
          const modelInstance = getGeminiModelInstance({
            apiKey,
            model: geminiModel,
            systemInstruction: `You are a resume structuring assistant. Extract fields from the user's resume (plain text and/or page images) and return exactly one valid JSON object matching the schema below.

Output constraints:
1. Return JSON only. No Markdown, no prose outside the JSON.
2. If a value is unknown or ambiguous, use an empty string or empty array as appropriate.
3. For every human-readable string, use the same primary language and script as the source material. Do not translate into another language unless the resume itself is clearly written that way. If the dominant language is unclear, you may follow the optional UI locale hint when provided: ${JSON.stringify(locale ?? null)}.
4. For description and details fields, use arrays of short strings, one readable phrase or sentence per item.

JSON schema:
{
  "title": "Resume title",
  "basic": {
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "employementStatus": "",
    "birthDate": ""
  },
  "education": [
    {
      "school": "",
      "major": "",
      "degree": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "description": ["", ""]
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "date": "",
      "details": ["", ""]
    }
  ],
  "projects": [
    {
      "name": "",
      "role": "",
      "date": "",
      "description": ["", ""],
      "link": "",
      "linkLabel": ""
    }
  ],
  "skills": ["", ""]
}`,
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          });

          const inputParts = [
            {
              text:
                content ||
                "Extract information from the following resume page images and output strictly in the JSON schema.",
            },
            ...imageParts,
          ];

          const result = await modelInstance.generateContent(inputParts);
          const aiContent = result.response.text();

          if (!aiContent || typeof aiContent !== "string") {
            return Response.json(
              { error: "AI did not return structured content" },
              { status: 500 }
            );
          }

          const parsedResume = parseJsonPayload(aiContent);
          if (!parsedResume) {
            return Response.json(
              { error: "Failed to parse AI JSON output" },
              { status: 500 }
            );
          }

          return Response.json({ resume: parsedResume });
        } catch (error) {
          console.error("Error in resume import:", error);
          const status =
            typeof (error as any)?.status === "number"
              ? (error as any).status
              : 500;
          return Response.json(
            { error: formatGeminiErrorMessage(error) },
            { status }
          );
        }
      },
    },
  },
});
