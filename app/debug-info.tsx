'use client';

import { useEffect, useState } from 'react';

export default function DebugInfo() {
  const [envStatus, setEnvStatus] = useState<{
    hasApiKey: boolean;
    apiKeyLength?: number;
    nodeEnv: string;
    apiHealthStatus?: any;
  } | null>(null);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      // Check API health to verify server-side API key
      fetch('/api/health')
        .then(res => res.json())
        .then(data => {
          setEnvStatus({
            hasApiKey: data.hasApiKey || false,
            apiKeyLength: data.apiKeyLength || 0,
            nodeEnv: process.env.NODE_ENV || 'unknown',
            apiHealthStatus: data,
          });
        })
        .catch(err => {
          console.error('Health check failed:', err);
          setEnvStatus({
            hasApiKey: false,
            apiKeyLength: 0,
            nodeEnv: process.env.NODE_ENV || 'unknown',
          });
        });
    }
  }, []);

  if (!envStatus || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">🐛 Debug Info</div>
      <div className="space-y-1">
        <div>🌍 Environment: {envStatus.nodeEnv}</div>
        <div>🔑 Server API Key: {envStatus.hasApiKey ? '✅ Set' : '❌ Missing'}</div>
        {envStatus.hasApiKey && (
          <div>📏 Key Length: {envStatus.apiKeyLength} chars</div>
        )}
        <div>� Health: {envStatus.apiHealthStatus?.status || 'unknown'}</div>
      </div>
    </div>
  );
}
