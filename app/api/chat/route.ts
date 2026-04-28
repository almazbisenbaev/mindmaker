import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const COMPLETION_MARKER = '[READY_FOR_ANALYSIS]';

const systemPrompt = `You are Mindmaker, a business idea validator. Your job is to gather key information about the user's business idea through a focused conversation, then signal when you have enough to generate a full analysis.

PROCESS:
1. In your first response, warmly acknowledge the user's idea and ask your first question
2. Ask ONE focused question at a time to learn about:
   - Who are the target customers?
   - What specific problem does it solve?
   - What is the solution / product?
   - How will it make money (revenue model)?
   - Who are the competitors / what alternatives exist?
   - What is the unique value proposition?
   - What resources or team are needed?
   - What are the biggest risks?

3. After approximately 6–10 exchanges where you've covered most topics, write a brief summary of what you've learned and end your message with EXACTLY this text on its own line:
[READY_FOR_ANALYSIS]

RULES:
- Ask only ONE question per message
- Be conversational and encouraging
- Help users who say "I don't know" by offering examples
- Acknowledge each answer before moving on
- Do not repeat questions already answered
- When you have sufficient info on all key topics, signal completion`;

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

    const result = await generateText({
      model,
      system: systemPrompt,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const text = result.text;
    const isComplete = text.includes(COMPLETION_MARKER);
    const message = text.replace(COMPLETION_MARKER, '').trim();

    return Response.json({ message, isComplete });

  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
