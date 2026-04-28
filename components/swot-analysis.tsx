interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface SwotAnalysisProps {
  data: SwotData;
}

const quadrants = [
  {
    key: 'strengths' as const,
    label: 'Strengths',
    description: 'Internal positive factors',
    headerClass: 'bg-green-50 border-green-200',
    badgeClass: 'bg-green-100 text-green-800',
    dotClass: 'bg-green-500',
  },
  {
    key: 'weaknesses' as const,
    label: 'Weaknesses',
    description: 'Internal negative factors',
    headerClass: 'bg-red-50 border-red-200',
    badgeClass: 'bg-red-100 text-red-800',
    dotClass: 'bg-red-500',
  },
  {
    key: 'opportunities' as const,
    label: 'Opportunities',
    description: 'External positive factors',
    headerClass: 'bg-blue-50 border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-800',
    dotClass: 'bg-blue-500',
  },
  {
    key: 'threats' as const,
    label: 'Threats',
    description: 'External negative factors',
    headerClass: 'bg-orange-50 border-orange-200',
    badgeClass: 'bg-orange-100 text-orange-800',
    dotClass: 'bg-orange-500',
  },
];

export function SwotAnalysis({ data }: SwotAnalysisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {quadrants.map((q) => (
        <div
          key={q.key}
          className={`rounded-lg border p-4 ${q.headerClass}`}
        >
          <div className="mb-3">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${q.badgeClass}`}>
              {q.label}
            </span>
            <p className="text-xs text-muted-foreground mt-1">{q.description}</p>
          </div>
          <ul className="space-y-2">
            {data[q.key].map((item, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${q.dotClass}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
