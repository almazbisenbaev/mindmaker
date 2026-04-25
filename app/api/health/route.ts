export async function GET() {
  console.log('🏥 Health check endpoint hit');
  
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasApiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      apiKeyLength: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length || 0,
    };

    console.log('✅ Health check successful:', healthStatus);
    
    return new Response(JSON.stringify(healthStatus), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
