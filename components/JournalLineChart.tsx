"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

type Point = { date: string; count: number };

export default function JournalLineChart({ data }: { data: Point[] }) {
  if (!data?.length) return <div className="opacity-60 text-sm">No activity in range.</div>;

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeOpacity={0.15} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickMargin={6}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            width={28}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(v) => [`${v}`, "Entries"]}
            labelFormatter={(d) => `Date: ${d}`}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#ffffff"
            strokeOpacity={0.8}
            dot={false}
            strokeWidth={2}
            activeDot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
