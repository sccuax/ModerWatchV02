import LeftSideBar from "../../assets/components/sideBarLeft/sideBarLeft";
import RightSideBar from "../../assets/components/sideBarRight/sideBarRight";
import MainContent from "../../assets/components/layout/mainContent";
import ShowRequester from "../../assets/components/layout/showRequester";
import { useNotificationDropdown } from "../../hooks/useNotificationDropdown";



export default function AdminDashboard() {
    const {
        toggleDropdown,
        closeAllDropdowns,
        isDropdownOpen,
        userMessages,
        accessRequests,
        messageCount,
        requestCount,
    } = useNotificationDropdown();

    const headerButtons = [
        {
            id: "message",
            icon: "message",
            count: messageCount,
            isActive: isDropdownOpen("messages"),
            onClick: () => toggleDropdown("messages"),
            dropdown: {
                type: 'new', // ✅ IMPORTANTE: Especificar que use el Dropdown.jsx nuevo
                messages: userMessages,
                title: "Messages",
                emptyMessage: "No new messages",
            },
        },
        {
            id: "bell",
            icon: "bell",
            count: requestCount,
            isActive: isDropdownOpen("requests"),
            onClick: () => toggleDropdown("requests"),
            dropdown: {
                type: 'new', // ✅ IMPORTANTE: Especificar que use el Dropdown.jsx nuevo
                messages: accessRequests,
                title: "Access Requests",
                emptyMessage: "No pending requests",
            },
        }
    ];

    return (
        <div className="h-screen w-full flex bg-[var(--color-bg-white)]">
            <LeftSideBar />
            <MainContent
                buttons={headerButtons}
                onCloseDropdown={closeAllDropdowns}
            >
                <ShowRequester onFilterClick={() => console.log('Filter button clicked')} />
            </MainContent>
            <RightSideBar />
        </div>
    );
}