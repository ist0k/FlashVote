"use client";

import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { PollOptionWithVotes } from "@/lib/types/poll";

interface ResultsChartProps {
  options: PollOptionWithVotes[];
  totalVotes: number;
}

function percent(votes: number, totalVotes: number): number {
  if (totalVotes === 0) return 0;
  return Math.round((votes / totalVotes) * 100);
}

export function ResultsChart({ options, totalVotes }: ResultsChartProps) {
  const chartData = options.map((option) => ({
    id: option.id,
    label:
      option.label.length > 28 ? `${option.label.slice(0, 27)}…` : option.label,
    votes: option.voteCount,
    share: percent(option.voteCount, totalVotes),
  }));

  return (
    <div className="flex flex-col gap-3">
      <div
        role="img"
        aria-label={`Results: ${options
          .map((option) => `${option.label}: ${option.voteCount} votes`)
          .join(", ")}. Total ${totalVotes} votes.`}
      >
        <ResponsiveContainer width="100%" height={chartData.length * 56 + 24}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 44, bottom: 4, left: 0 }}
          >
            <XAxis type="number" hide domain={[0, (dataMax: number) => Math.max(dataMax, 1)]} />
            <YAxis
              type="category"
              dataKey="label"
              width={140}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 13 }}
            />
            <Bar dataKey="votes" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} isAnimationActive>
              <LabelList
                dataKey="share"
                position="right"
                formatter={(value: React.ReactNode) => `${String(value)}%`}
                style={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Textual alternative for screen readers and no-JS contexts */}
      <table className="sr-only">
        <caption>Poll results</caption>
        <thead>
          <tr>
            <th scope="col">Option</th>
            <th scope="col">Votes</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr key={option.id}>
              <td>{option.label}</td>
              <td>{option.voteCount}</td>
              <td>{percent(option.voteCount, totalVotes)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalVotes === 0 ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          No votes yet — results will appear here as soon as the first vote lands.
        </p>
      ) : null}
    </div>
  );
}
