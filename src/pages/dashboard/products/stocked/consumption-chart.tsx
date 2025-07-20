import { useAppSelector } from "@/store";
import { ItemConsumption } from "@/types/item-consumption";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ConsumptionChart() {
  const { data, loading, error, currentItemId } = useAppSelector(
    (state) => state.consumptionChart
  );

  const chartData = data.map((item: ItemConsumption) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  if (loading) {
    return (
      <div className="h-60 w-full flex items-center justify-center">
        <div className="text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-60 w-full flex items-center justify-center">
        <div className="text-red-400">Error loading chart data: {error}</div>
      </div>
    );
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="96%" height="100%">
        <LineChart data={chartData} key={currentItemId}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Line
            type="monotone"
            dataKey="quantity"
            stroke="#38a46c"
            strokeWidth={2}
            dot={{ fill: "#38a46c", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#38a46c", strokeWidth: 2 }}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
