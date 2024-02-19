import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function DashboardSimplePieChart({ data }) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      style={{ border: "2px solid red" }}
    >
      <PieChart width={300} height={300}>
        <Pie
          data={data?.map((obj) => {
            return { name: obj._id, value: obj.total, color: obj.color };
          })}
          cx="50%"
          cy="50%"
          isAnimationActive={true}
          outerRadius={100}
          // label
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={data[index].color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DashboardSimplePieChart;
