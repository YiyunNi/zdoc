import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface GeoData {
  country: string;
  sessions: number;
}

interface GeoChartProps {
  data: GeoData[];
}

const COLORS = ['#3b6de0', '#6c4de0', '#2a9d5c', '#d4850a', '#d44040', '#8b8f9a', '#b0b3ba'];

export default function GeoChart({ data }: GeoChartProps): React.ReactElement {
  const sorted = [...data].sort((a, b) => b.sessions - a.sessions).slice(0, 10);

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 10 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="country"
            type="category"
            width={60}
            tick={{ fontSize: 11, fill: '#6b7080', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #ecedf0',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
            {sorted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
