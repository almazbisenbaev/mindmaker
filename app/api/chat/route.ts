import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  console.log('🚀 Chat API endpoint hit');
  
  try {
    const { messages } = await req.json();
    console.log('📨 Received messages:', JSON.stringify(messages, null, 2));

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔑 Initializing Google AI SDK');
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
    const model = google('gemini-3.1-flash-lite-preview');
    console.log('✅ Model initialized successfully');

    const systemPrompt = `You are Mindmaker, a business idea consultant AI. Your role is to help users validate and improve their business ideas through a structured conversation. Be helpful, provide examples, and guide users who don't know answers.

Follow this process:
1. First, acknowledge their business idea and show enthusiasm
2. Then ask clarifying questions ONE AT A TIME to understand the full picture covering:
   - Target market and customers
   - Problem being solved
   - Solution/product details
   - Revenue model
   - Competitive landscape
   - Unique value proposition
   - Resources required
   - Timeline and milestones

3. Once you have sufficient information, analyze the idea using:
   - Lean Canvas framework
   - SWOT analysis
   - Market viability assessment
   - Risk assessment

4. Provide feedback on:
   - Viability of the idea
   - Strengths and opportunities
   - Weaknesses and threats
   - Areas that need improvement
   - What the user forgot to consider
   - Actionable recommendations

IMPORTANT GUIDELINES:
- Ask ONE question at a time to maintain natural conversation flow
- Always provide examples when asking difficult questions
- If user says "I don't know" or seems unsure, help them figure it out
- Be encouraging and supportive, not critical
- Break down complex concepts into simple terms
- Provide concrete examples for each business concept
- When asking about revenue, give examples of different models (subscription, one-time, etc.)
- When asking about target market, provide examples of customer segments
- Always offer to help brainstorm answers if the user is stuck

Example of helping a stuck user:
User: "I don't know who my target market is"
You: "That's completely normal! Let's think about it together. Who would benefit most from your solution? For example, if it's a productivity app, could it be students, professionals, or small business owners? What problem does it solve and who has that problem?"

Keep responses concise but thorough. Focus on being a helpful guide rather than an interrogator.`;

    const conversationHistory = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    console.log('💬 Sending conversation to AI model');
    const result = await generateText({
      model: model,
      messages: conversationHistory,
    });

    console.log('✅ Response generated successfully');
    console.log('📝 Response content:', result.text);

    return new Response(result.text, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('💥 Error in chat API:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
