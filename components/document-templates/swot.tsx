import React from 'react';

interface SWOTTemplateProps {
  document: {
    id: string;
    title: string;
    description?: string;
    // Add other document fields as needed
  };
}

export function SWOTTemplate({ document }: SWOTTemplateProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Strengths</h3>
          <p className="text-green-700">Content for strengths...</p>
        </div>

        {/* Weaknesses */}
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Weaknesses</h3>
          <p className="text-red-700">Content for weaknesses...</p>
        </div>

        {/* Opportunities */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Opportunities</h3>
          <p className="text-blue-700">Content for opportunities...</p>
        </div>

        {/* Threats */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Threats</h3>
          <p className="text-yellow-700">Content for threats...</p>
        </div>
      </div>
    </div>
  );
}