import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function DashboardAreaChart({data}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
            width={500}
            height={300}
            data={data}
            margin={{
                top: 10,
                right: 30,
                left: -10,
                bottom: 0,
            }}

        >
            <defs>
                <linearGradient id='colorLast' x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#228be6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#228be6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d41c1c" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#d41c1c" stopOpacity={0} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 3" />
            <XAxis dataKey="name" axisLine={false} tick={{fontSize: 14}} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip />
            <Legend verticalAlign="top" align='left' iconType="square" iconSize={14} height={40} />
            <Area name="L'année passée" type="monotone" id='last_year' dataKey="last" stroke="#228be6" fill="url(#colorLast)"  />
            <Area name="Cette année" type="monotone" id='this_year' dataKey="current" stroke="#d41c1c" fill="url(#colorCurrent)" activeDot={{ r: 8 }} />
        </AreaChart>
    </ResponsiveContainer>
  )
}

export default DashboardAreaChart