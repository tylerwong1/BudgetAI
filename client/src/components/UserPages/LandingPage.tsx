import {
  useCheckLoggedIn,
  getUserTrends,
} from "@/components/UserPages/HandleUser";
import { Bar, BarChart } from "recharts";
import { ChartConfig, ChartContainer } from "../ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

function LandingPage() {
  useCheckLoggedIn();
  return (
    <div className="content-holder">
      <div className="card bg-muted w-3/5 p-5">
        <h1 className="grow text-center">Spending Chart</h1>
        <div className="card bg-foreground text-accent text-center">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center">Your Trends</h1>
          <ul className="list-dot">
            {getUserTrends().map((trend, index) => (
              <li key={index}>{trend}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default LandingPage;
