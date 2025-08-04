import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend as PieLegend,
  ResponsiveContainer as PieResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  Legend as BarLegend,
  ResponsiveContainer as BarResponsiveContainer,
} from "recharts";

import CommentsHistogram from "./CommentsHistogram";

const API_BASE_URL = "http://localhost:5000/api/v1/posts";

const PIE_COLORS = ["#3b82f6", "#9ca3af"];
const BAR_COLORS = [
  "#3b82f6",
  "#4f46e5",
  "#6366f1",
  "#818cf8",
  "#a5b4fc",
  "#c7d2fe",
];

const Insights = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistogramData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/v1/comments/approved-comments-per-blog"
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching histogram data:", err);
      }
    };

    fetchHistogramData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total views
        const viewsRes = await fetch(`${API_BASE_URL}/total-views`);
        if (!viewsRes.ok) throw new Error("Failed to fetch total views");
        const viewsData = await viewsRes.json();
        setTotalViews(viewsData.totalViews || 0);

        // Fetch recent posts
        const postsRes = await fetch(
          `${API_BASE_URL}/get-posts?limit=6&sort=-createdAt`
        );
        if (!postsRes.ok) throw new Error("Failed to fetch recent posts");
        const postsData = await postsRes.json();
        setBlogPosts(postsData.posts || []);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieChartData = [
    { name: "Total Blog Views", value: totalViews },
    { name: "Remaining", value: 500 - totalViews },
  ];

  const histogramData = blogPosts.map((post) => ({
    title:
      post.title.length > 12 ? `${post.title.substring(0, 12)}...` : post.title,
    views: post.views || 0,
    fullTitle: post.title,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Platform Insights
      </h3>
      <p className="text-gray-600 mb-6">
        View analytics and metrics about your platform.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart (Existing) */}
        <div className="bg-gray-50 rounded-lg p-7 h-64 border border-blue-600">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <h4 className="text-gray-700 text-sm font-bold mb-1">
                Total Blog Views
              </h4>
              <PieResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <PieTooltip />
                  <PieLegend />
                </PieChart>
              </PieResponsiveContainer>
            </>
          )}
        </div>

        {/* New Histogram (Smaller Size) */}
        <div className="bg-gray-50 rounded-lg p-6 h-64 border border-blue-600">
          <h4 className="text-gray-700 text-sm font-bold mb-2">
            Recent Posts Views
          </h4>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : blogPosts.length > 0 ? (
            <BarResponsiveContainer width="100%" height="100%">
              <BarChart
                data={histogramData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="title"
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  width={30}
                  domain={[0, 100]}
                  tickCount={6}
                  interval={0}
                />
                <BarTooltip
                  formatter={(value) => [`${value} views`, "Views"]}
                  labelFormatter={(label) => {
                    const fullTitle = histogramData.find(
                      (item) => item.title === label
                    )?.fullTitle;
                    return fullTitle || label;
                  }}
                />
                <BarLegend />
                <Bar dataKey="views" name="Views" radius={[4, 4, 0, 0]}>
                  {histogramData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </BarResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500 text-sm">
              No recent posts available
            </div>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-6 h-64 border border-blue-600">
          <h4 className="text-gray-700 text-sm font-bold mb-2">
            Comments Per Post
          </h4>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : blogPosts.length > 0 ? (
            <BarResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="title"
                  angle={-90}
                  textAnchor="end"
                  interval={0}
                  hide
                />
                <YAxis width={30} domain={[0, 50]} tickCount={6} interval={0} />
                <PieTooltip
                  formatter={(value) => [`${value} views`, "Comments"]}
                  labelFormatter={(label) => {
                    const fullTitle = data.find(
                      (item) => item.title === label
                    )?.fullTitle;
                    return fullTitle || label;
                  }}
                />{" "}
                <Bar dataKey="commentCount" fill="#4f46e5" />
              </BarChart>
            </BarResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500 text-sm">
              No recent posts available
            </div>
          )}
        </div>
      </div>

      {/* <div className="mt-6 bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
        <p className="text-gray-500">Engagement metrics</p>
      </div> */}
    </div>
  );
};

export default Insights;
