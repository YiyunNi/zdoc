import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['var(--green)', 'var(--red)'];

interface Props {
  up: number;
  down: number;
}

export default function FeedbackChart({ up, down }: Props): React.ReactElement {
  const data = [
    { name: 'Thumbs Up', value: up },
    { name: 'Thumbs Down', value: down },
  ];
  const total = up + down;
  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12 }}>
        <span><span style={{ color: 'var(--green)', fontWeight: 700 }}>{up}</span> Up ({total ? Math.round(up / total * 100) : 0}%)</span>
        <span><span style={{ color: 'var(--red)', fontWeight: 700 }}>{down}</span> Down ({total ? Math.round(down / total * 100) : 0}%)</span>
      </div>
    </div>
  );
}
