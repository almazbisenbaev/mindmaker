import React from 'react';

interface LeanTemplateProps {
  document: {
    id: string;
    title: string;
    description?: string;
  };
}

export function LeanTemplate({ document }: LeanTemplateProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Problem */}
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Problem</h3>
          <p className="text-red-700">List top 3 problems</p>
        </div>

        {/* Solution */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Solution</h3>
          <p className="text-green-700">Outline possible solutions</p>
        </div>

        {/* Metrics */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Metrics</h3>
          <p className="text-blue-700">Key numbers that tell how your business is doing</p>
        </div>

        {/* Unique Value Proposition */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 md:col-span-3">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Unique Value Proposition</h3>
          <p className="text-purple-700">Single, clear, compelling message that states why you are different and worth paying attention</p>
        </div>

        {/* Unfair Advantage */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Unfair Advantage</h3>
          <p className="text-yellow-700">Something that cannot be easily copied or bought</p>
        </div>

        {/* Channels */}
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">Channels</h3>
          <p className="text-indigo-700">Path to customers</p>
        </div>

        {/* Customer Segments */}
        <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
          <h3 className="text-lg font-semibold text-pink-800 mb-2">Customer Segments</h3>
          <p className="text-pink-700">Target customers and users</p>
        </div>

        {/* Cost Structure */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Cost Structure</h3>
          <p className="text-gray-700">Fixed and variable costs</p>
        </div>

        {/* Revenue Streams */}
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <h3 className="text-lg font-semibold text-emerald-800 mb-2">Revenue Streams</h3>
          <p className="text-emerald-700">Revenue model, lifetime value, revenue, gross margin</p>
        </div>
      </div>
    </div>
  );
}