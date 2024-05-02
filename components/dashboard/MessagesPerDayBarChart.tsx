"use client";

import { MessagesPerDayResultType } from "@/data/whatsapp-chat/messages-per-day";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MessagesPerDayBarChartProps {
  data: MessagesPerDayResultType[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-muted p-3">
        <p className="label">{`Date : ${format(label, "EEE MMM dd yyyy h:mm aa")}`}</p>
        <p className="intro">{`Count : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export function MessagesPerDayBarChart({ data }: MessagesPerDayBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: Date) => format(value, "EEE dd mm")}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
