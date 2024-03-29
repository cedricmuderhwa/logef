import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function DashboardBarChart({ data, dataKey }) {
  return (
    <ResponsiveContainer>
      <BarChart
        width={150}
        height={40}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: -10,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="1 3" />
        <XAxis
          dataKey="service_name"
          axisLine={false}
          tick={{ fontSize: 14 }}
        />
        <YAxis tick={{ fontSize: 14 }} axisLine={false} />
        <Tooltip />
        <Bar barSize={24} dataKey={dataKey}>
          {data?.map((entry, index) => (
            <Cell key={index} fill="#ebf151" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default DashboardBarChart;
