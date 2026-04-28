import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

function extractJSON(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {}
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return JSON.parse(match[1].trim());
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) return JSON.parse(objMatch[0]);
  throw new Error('Could not parse JSON from response');
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
    const model = google('gemini-2.0-flash-lite');

    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
      .join('\n\n');

    const result = await generateText({
      model,
      system: `You are a business idea analyst. Based on a conversation between a user and an AI business consultant, produce a structured review of the business idea.

Respond ONLY with a valid JSON object — no markdown, no explanation — in this exact format:
{
  "review": "A clear, honest 3-5 sentence overall assessment of the business idea's viability and potential.",
  "tips": [
    "Specific actionable tip 1",
    "Specific actionable tip 2",
    "Specific actionable tip 3",
    "Specific actionable tip 4",
    "Specific actionable tip 5"
  ],
  "nextSteps": [
    "Immediate concrete action the founder should take",
    "Second priority action",
    "Third priority action",
    "Fourth priority action"
  ]
}`,
      messages: [
        {
          role: 'user',
          content: `Here is the conversation about the business idea:\n\n${conversationText}\n\nProvide the review JSON.`,
        },
      ],
    });

    const data = extractJSON(result.text);
    return Response.json(data);

  } catch (error) {
    console.error('Review analysis error:', error);
    return Response.json({ error: 'Failed to generate review' }, { status: 500 });
  }
}
