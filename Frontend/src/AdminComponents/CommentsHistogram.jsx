import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const CommentsHistogram = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistogramData = async () => {
      try {
        const res = await fetch("https://blog-frontend-qjw4.onrender.com/api/v1/comments/approved-comments-per-blog");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching histogram data:", err);
      }
    };

    fetchHistogramData();
  }, []);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 70 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" angle={-45} textAnchor="end" interval={0} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="commentCount" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommentsHistogram;
