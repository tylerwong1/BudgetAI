import {useCheckLoggedIn, getUserTrends} from "@/components/UserPages/HandleUser"
import "@/styles/MainPage.css"

function LandingPage() {
    useCheckLoggedIn();
    return(
        <div className="content-holder">
            <div className="card bg-muted w-3/5 p-5">
                <h1 className="grow text-center">
                    Spending Chart
                </h1>
                <div className="card bg-foreground text-accent text-center">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    [insert data here]
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-center">Your Trends</h1>
                    <ul className="list-dot">
                        {getUserTrends().map((trend, index) => (
                        <li
                        key={index}>
                            {trend}
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default LandingPage;