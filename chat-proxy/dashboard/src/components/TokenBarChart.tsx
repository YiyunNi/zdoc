import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  data: Array<{ model: string; totalTokens: number }>;
}

const COLORS = ['var(--blue)', 'var(--purple)', 'var(--green)', 'var(--amber)', 'var(--red)'];

export default function TokenBarChart({ data }: Props): React.ReactElement {
  const top10 = data.slice(0, 10);
  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top10} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
          <YAxis dataKey="model" type="category" tick={{ fontSize: 10 }} stroke="var(--text-muted)" width={120} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="totalTokens" radius={[0, 4, 4, 0]}>
            {top10.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
