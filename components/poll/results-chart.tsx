"use client";

import { useState } from "react";
import { InboxIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import type { PollOptionWithVotes } from "@/lib/types/poll";

interface ResultsChartProps {
  options: PollOptionWithVotes[];
  totalVotes: number;
}

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function colorAt(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

function percent(votes: number, totalVotes: number): number {
  if (totalVotes === 0) return 0;
  return Math.round((votes / totalVotes) * 100);
}

type ChartKind = "bars" | "donut";

export function ResultsChart({ options, totalVotes }: ResultsChartProps) {
  const { dict } = useI18n();
  const [kind, setKind] = useState<ChartKind>("bars");

  const chartData = options.map((option, index) => ({
    id: option.id,
    fullLabel: option.label,
    shortLabel:
      option.label.length > 24 ? `${option.label.slice(0, 23)}…` : option.label,
    votes: option.voteCount,
    share: percent(option.voteCount, totalVotes),
    fill: colorAt(index),
  }));

  return (
    <div className="flex flex-col gap-3">
      {/* Chart kind switcher */}
      <div
        className="flex w-fit items-center gap-0.5 rounded-lg border p-0.5"
        role="group"
        aria-label={dict.poll.chart.tableCaption}
      >
        {(["bars", "donut"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            aria-pressed={kind === value}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              kind === value
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {value === "bars" ? dict.poll.chart.bars : dict.poll.chart.donut}
          </button>
        ))}
      </div>

      {totalVotes === 0 ? (
        <EmptyResults text={dict.poll.noVotesYet} />
      ) : kind === "bars" ? (
        <div
          key="bars"
          role="img"
          className="animate-in fade-in duration-300"
          aria-label={`${dict.poll.chart.tableCaption}: ${options
            .map((option) => `${option.label}: ${option.voteCount}`)
            .join(", ")}. ${dict.poll.chart.totalLabel} ${totalVotes}.`}
        >
          <ResponsiveContainer width="100%" height={options.length * 56 + 24}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 44, bottom: 4, left: 0 }}
            >
              <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                type="number"
                hide
                domain={[0, (dataMax: number) => Math.max(dataMax, 1)]}
              />
              <YAxis
                type="category"
                dataKey="shortLabel"
                width={140}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 13, fill: "var(--muted-foreground)" }}
              />
              <Bar
                dataKey="votes"
                radius={[0, 6, 6, 0]}
                isAnimationActive
                animationDuration={450}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={entry.fill} />
                ))}
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
      ) : (
        <div
          key="donut"
          role="img"
          className="flex animate-in fade-in flex-col items-center gap-4 duration-300 sm:flex-row sm:justify-center sm:gap-10"
          aria-label={`${dict.poll.chart.tableCaption}: ${options
            .map((option) => `${option.label}: ${option.voteCount}`)
            .join(", ")}. ${dict.poll.chart.totalLabel} ${totalVotes}.`}
        >
          <div className="relative h-56 w-56 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="votes"
                  nameKey="fullLabel"
                  innerRadius="62%"
                  outerRadius="92%"
                  paddingAngle={2}
                  strokeWidth={0}
                  isAnimationActive
                  animationDuration={500}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.id} fill={entry.fill} />
                  ))}
                  <Label
                    value={`${totalVotes}`}
                    position="center"
                    className="fill-foreground text-2xl font-bold"
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex w-full max-w-xs flex-col gap-1.5 text-sm">
            {chartData.map((entry) => (
              <li key={entry.id} className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full transition-transform duration-200 hover:scale-125"
                  style={{ backgroundColor: entry.fill }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate">{entry.fullLabel}</span>
                <span className="tabular-nums text-muted-foreground">
                  {entry.votes} · {entry.share}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Textual alternative for screen readers */}
      <table className="sr-only">
        <caption>{dict.poll.chart.tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{dict.poll.chart.colOption}</th>
            <th scope="col">{dict.poll.chart.colVotes}</th>
            <th scope="col">{dict.poll.chart.colShare}</th>
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
    </div>
  );
}

function EmptyResults({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-12 text-center animate-in fade-in zoom-in-95 duration-300">
      <span className="flex size-11 items-center justify-center rounded-full bg-muted">
        <InboxIcon className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
