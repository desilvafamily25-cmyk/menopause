exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const prompt = body.prompt;
  const consent = body.consent;

  if (consent !== true) {
    return { statusCode: 400, body: JSON.stringify({ error: "Consent required" }) };
  }

  if (!prompt || typeof prompt !== "string") {
    return { statusCode: 400, body: JSON.stringify({ error: "Prompt missing" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server missing OPENAI_API_KEY" }) };
  }

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          {
            role: "system",
            content:
              "You are a clinical decision-support assistant for an Australian GP. Provide evidence-based suggestions, contraindications, monitoring, red flags, and follow-up. Do not provide emergency instructions. Output structured headings and bullet points.",
          },
          { role: "user", content: prompt },
        ],
        max_output_tokens: 1800,
        temperature: 0.2,
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return { statusCode: r.status, body: txt };
    }

    const data = await r.json();

    // Extract text from Responses API output
    let text = "";
    if (Array.isArray(data.output)) {
      for (const item of data.output) {
        if (item?.type === "message" && Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c?.type === "output_text" && typeof c.text === "string") text += c.text;
          }
        }
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ text }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};

