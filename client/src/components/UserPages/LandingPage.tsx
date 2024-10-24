import {useCheckLoggedIn} from "@/components/UserPages/HandleUser"
import "@/styles/MainPage.css"

function LandingPage() {
    useCheckLoggedIn();
    return(
        <div>
        </div>
    );
}
export default LandingPage;
