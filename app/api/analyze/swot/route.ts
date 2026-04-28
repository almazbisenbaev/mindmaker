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
      system: `You are a business strategist performing a SWOT analysis. Based on a conversation about a business idea, produce a thorough SWOT analysis.

Respond ONLY with a valid JSON object — no markdown, no explanation — in this exact format:
{
  "strengths": [
    "Specific strength 1",
    "Specific strength 2",
    "Specific strength 3",
    "Specific strength 4"
  ],
  "weaknesses": [
    "Specific weakness 1",
    "Specific weakness 2",
    "Specific weakness 3",
    "Specific weakness 4"
  ],
  "opportunities": [
    "Specific market opportunity 1",
    "Specific market opportunity 2",
    "Specific market opportunity 3",
    "Specific market opportunity 4"
  ],
  "threats": [
    "Specific threat 1",
    "Specific threat 2",
    "Specific threat 3",
    "Specific threat 4"
  ]
}

Each item should be a clear, specific insight (not generic). Aim for 3-5 items per quadrant.`,
      messages: [
        {
          role: 'user',
          content: `Here is the conversation about the business idea:\n\n${conversationText}\n\nProvide the SWOT analysis JSON.`,
        },
      ],
    });

    const data = extractJSON(result.text);
    return Response.json(data);

  } catch (error) {
    console.error('SWOT analysis error:', error);
    return Response.json({ error: 'Failed to generate SWOT analysis' }, { status: 500 });
  }
}
