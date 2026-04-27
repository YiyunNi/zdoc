import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  data: Array<{ date: string; inputTokens: number; outputTokens: number; cachedTokens: number }>;
}

export default function TokenTrendChart({ data }: Props): React.ReactElement {
  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
          <YAxis tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="inputTokens" stackId="a" fill="var(--blue)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="outputTokens" stackId="a" fill="var(--purple)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="cachedTokens" stackId="a" fill="var(--green)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
