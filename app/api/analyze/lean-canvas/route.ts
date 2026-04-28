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
      system: `You are a startup strategist filling out a Lean Canvas for a business idea. Based on a conversation about the business, produce a complete Lean Canvas.

The Lean Canvas fields:
- problem: The top 2-3 problems the target customer has (array of strings)
- solution: The top 2-3 solutions / features (array of strings)
- uniqueValueProposition: A single clear sentence stating how you are different and why customers should choose you
- unfairAdvantage: Something that cannot be easily copied or bought by competitors
- customerSegments: The specific groups of customers you are targeting (array of strings)
- keyMetrics: The key numbers that tell you how your business is doing (array of strings)
- channels: How you reach your customers (array of strings)
- costStructure: The main costs to operate the business (array of strings)
- revenueStreams: How the business makes money (array of strings)

Respond ONLY with a valid JSON object — no markdown, no explanation — in this exact format:
{
  "problem": ["...", "...", "..."],
  "solution": ["...", "...", "..."],
  "uniqueValueProposition": "...",
  "unfairAdvantage": "...",
  "customerSegments": ["...", "..."],
  "keyMetrics": ["...", "...", "..."],
  "channels": ["...", "...", "..."],
  "costStructure": ["...", "...", "..."],
  "revenueStreams": ["...", "...", "..."]
}`,
      messages: [
        {
          role: 'user',
          content: `Here is the conversation about the business idea:\n\n${conversationText}\n\nProvide the Lean Canvas JSON.`,
        },
      ],
    });

    const data = extractJSON(result.text);
    return Response.json(data);

  } catch (error) {
    console.error('Lean Canvas analysis error:', error);
    return Response.json({ error: 'Failed to generate Lean Canvas' }, { status: 500 });
  }
}
