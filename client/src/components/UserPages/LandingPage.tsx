import { useCheckLoggedIn } from "@/components/UserPages/HandleUser";
import { SpendingChart } from "../ui/SpendingChart";
import { apiRequest } from "@/api";
import { useEffect, useState } from "react";

async function getUserTrends(): Promise<string[]> {
  const response = await apiRequest("/chat/insights", "GET");
  console.log(response);
  const insights = response?.insights;
  return typeof insights === "string" ? insights.split("\n") : [];
}

function LandingPage() {
  useCheckLoggedIn();
  const [trends, setTrends] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await getUserTrends();
        setTrends(data);
      } catch (error) {
        console.error("Error fetching trends..", error);
        setTrends(["Unable to retrieve trends. Try again later."]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);
  return (
    <div className="content-holder">
      <div className="card bg-muted w-3/5 p-5">
        <h1 className="grow text-center">Spending Chart</h1>
        {trends[0] != "Unable to retrieve trends. Try again later." && <SpendingChart />}
        <div className="flex flex-col items-center justify-center">
          {loading ? (
            <p>Loading Trends...</p>
          ) : trends[0] != "Unable to retrieve trends. Try again later." ? (
            <>
              <h1 className="text-center">Your Trends</h1>
              <ul className="list-dot">
                {trends.map((trend, index) => (
                  <li key={index}>{trend}</li>
                ))}
              </ul>
            </>
          ) : <div>
            <br/>
            <h2>Please upload data using the <a href="./upload">Upload Page</a>!</h2>
            </div>}
        </div>
      </div>
    </div>
  );
  
}
export default LandingPage;
