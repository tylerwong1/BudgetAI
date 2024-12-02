"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { apiRequest } from "@/api";
import { useEffect, useState } from "react";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface CategoryData {
  [category: string]: number;
}

type ResponseElement = [string, CategoryData];

type APIResponse = ResponseElement[];

interface ChartData {
  month: string;
  [category: string]: number;
}

//format data so chart can understand
const parseData = (response: APIResponse): ChartData[] => {
  const chartData = response.map(([month, categories]) => {
    // Construct a ChartData object
    const chartItem: ChartData = { month };

    Object.entries(categories).forEach(([category, value]) => {
      chartItem[category] = value;
    });
    return chartItem;
  });
  return chartData;
};

export function SpendingChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await apiRequest("/query/transactions/totals", "GET");
        const data = parseData(response);
        console.log(data);
        setChartData(data);
      } catch (error) {
        console.log("Error...", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  if (loading) {
    return <p>Loading chart...</p>; // Show a loading state while fetching data
  }

  if (chartData.length === 0) {
    return <p>No data available.</p>; // Handle case when no data is returned
  }

  // Extract unique category names for dynamic line rendering
  const categoryNames = Object.keys(chartData[0]).filter(
    (key) => key !== "month",
  );
  console.log(chartData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historic Spending</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {/* Render a Line for each category */}
            {categoryNames.map((category, index) => (
              <Line
                key={category}
                dataKey={category}
                type="monotone"
                stroke={`hsl(${(index * 60) % 360}, 100%, 50%)`} // Generate a unique color for each category
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
