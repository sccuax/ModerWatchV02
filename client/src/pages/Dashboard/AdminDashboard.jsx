import LeftSideBar from "../../assets/components/sideBarLeft/sideBarLeft";
import RightSideBar from "../../assets/components/sideBarRight/sideBarRight";
import MainContent from "../../assets/components/layout/mainContent";
import ShowRequester from "../../assets/components/layout/showRequester";
export default function AdminDashboard() {
    return <div className=" h-screen w-full flex bg-[var(--color-bg-white)]">
        <LeftSideBar/>
        <MainContent>
            <ShowRequester onFilterClick={() => console.log('Filter button clicked')} />
        </MainContent>
        <RightSideBar />
        </div>;
}