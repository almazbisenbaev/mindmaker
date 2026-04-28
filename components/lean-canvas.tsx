export interface LeanCanvasData {
  problem: string[];
  solution: string[];
  uniqueValueProposition: string;
  unfairAdvantage: string;
  customerSegments: string[];
  keyMetrics: string[];
  channels: string[];
  costStructure: string[];
  revenueStreams: string[];
}

interface LeanCanvasProps {
  data: LeanCanvasData;
}

function Cell({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-border rounded-lg p-3 flex flex-col gap-2 ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function ItemList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground/40 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LeanCanvas({ data }: LeanCanvasProps) {
  return (
    <div className="space-y-4">
      {/* Mobile: stack all cells */}
      <div className="grid grid-cols-1 sm:hidden gap-3">
        <Cell label="Problem"><ItemList items={data.problem} /></Cell>
        <Cell label="Solution"><ItemList items={data.solution} /></Cell>
        <Cell label="Unique Value Proposition"><p>{data.uniqueValueProposition}</p></Cell>
        <Cell label="Unfair Advantage"><p>{data.unfairAdvantage}</p></Cell>
        <Cell label="Customer Segments"><ItemList items={data.customerSegments} /></Cell>
        <Cell label="Key Metrics"><ItemList items={data.keyMetrics} /></Cell>
        <Cell label="Channels"><ItemList items={data.channels} /></Cell>
        <Cell label="Cost Structure"><ItemList items={data.costStructure} /></Cell>
        <Cell label="Revenue Streams"><ItemList items={data.revenueStreams} /></Cell>
      </div>

      {/* Desktop: lean canvas grid layout */}
      <div className="hidden sm:grid gap-2" style={{
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'auto auto auto',
      }}>
        {/* Problem - col 1, rows 1-2 */}
        <div style={{ gridColumn: '1', gridRow: '1 / 3' }}>
          <Cell label="Problem" className="h-full">
            <ItemList items={data.problem} />
          </Cell>
        </div>

        {/* Solution - col 2, row 1 */}
        <div style={{ gridColumn: '2', gridRow: '1' }}>
          <Cell label="Solution" className="h-full">
            <ItemList items={data.solution} />
          </Cell>
        </div>

        {/* Unique Value Proposition - col 3, rows 1-2 */}
        <div style={{ gridColumn: '3', gridRow: '1 / 3' }}>
          <Cell label="Unique Value Proposition" className="h-full">
            <p>{data.uniqueValueProposition}</p>
          </Cell>
        </div>

        {/* Unfair Advantage - col 4, row 1 */}
        <div style={{ gridColumn: '4', gridRow: '1' }}>
          <Cell label="Unfair Advantage" className="h-full">
            <p>{data.unfairAdvantage}</p>
          </Cell>
        </div>

        {/* Customer Segments - col 5, rows 1-2 */}
        <div style={{ gridColumn: '5', gridRow: '1 / 3' }}>
          <Cell label="Customer Segments" className="h-full">
            <ItemList items={data.customerSegments} />
          </Cell>
        </div>

        {/* Key Metrics - col 2, row 2 */}
        <div style={{ gridColumn: '2', gridRow: '2' }}>
          <Cell label="Key Metrics" className="h-full">
            <ItemList items={data.keyMetrics} />
          </Cell>
        </div>

        {/* Channels - col 4, row 2 */}
        <div style={{ gridColumn: '4', gridRow: '2' }}>
          <Cell label="Channels" className="h-full">
            <ItemList items={data.channels} />
          </Cell>
        </div>

        {/* Cost Structure - cols 1-2, row 3 */}
        <div style={{ gridColumn: '1 / 3', gridRow: '3' }}>
          <Cell label="Cost Structure">
            <ItemList items={data.costStructure} />
          </Cell>
        </div>

        {/* Revenue Streams - cols 3-5, row 3 */}
        <div style={{ gridColumn: '3 / 6', gridRow: '3' }}>
          <Cell label="Revenue Streams">
            <ItemList items={data.revenueStreams} />
          </Cell>
        </div>
      </div>
    </div>
  );
}
