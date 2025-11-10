import LeftSideBar from "../../assets/components/sideBarLeft/sideBarLeft";
import RightSideBar from "../../assets/components/sideBarRight/sideBarRight";
import MainContent from "../../assets/components/layout/mainContent";
import ContentData from "../../assets/components/Tables/containerData";
import Filter from '../../assets/components/buttons/tertiary'
import SearchBar from '../../assets/components/forms/searchBar'


const UserDashboard = () => {

const iconSettings = [
    { id: 1, IconName: "bell" },      // minúscula
    { id: 2, IconName: "update" },    
    { id: 3, IconName: "delete" },
]

    const buttonFilter = [
        {
            id: 1,
            iconName: "filter",
            text: "Filters",
            textClass: "bodyText text-[var(--color-text-gray)]",
            showIcon: true,
            //onClick: handleFilterClick,
        },
        
    ];
    
    const headerButtons = [
        {        
        id: "bell",
        icon: "bell",
        count: 0,
    }
    ];


    const customStats = [
        { 
            type: 'products',  // usa los tipos existentes en imageStats
            text: 'Total',
            data: '150',
            colorClass: 'text-[var(--color-text-purple)]'
        },
        { 
            type: 'suppliers',
            text: 'Suppliers',
            data: '45',
            colorClass: 'text-green-600'
        },
        { 
            type: 'noStock',
            text: 'No stock',
            data: '12',
            colorClass: 'text-orange-500'
        }
    ];

    return (
        <div className="h-screen w-full flex bg-[var(--color-bg-white)]">
            <LeftSideBar />
            <MainContent
            buttons={headerButtons}
            statsData={customStats}
            >
                <section className="flex flex-col pt-[var(--marging-section-XL)] gap-[var(--marging-section-S)] border-t-[0.5px] border-[var(--color-border-gray)]">
                    <div className="py-[var(--marging-M)] flex items-center gap-[var(--marging-section-M)]">
                    <SearchBar 
                    placeholder="Search for product ID, brand, categories or key word..."
                    />
                        {buttonFilter.map((button) => (
                    <Filter key={button.id} {...button} className={'w-[97px]'}/>
                    ))}
                    </div>
                        <ContentData
                        heading1={"Name"}
                        heading2={"ID"}
                        heading3={"Category"}
                        heading4={"Actions"}
                        iconConf={iconSettings}
                        justifyContainerData={"items-center justify-center"}
                        />
                </section>
            </MainContent>
            <RightSideBar />
        </div>
    );
}

export default UserDashboard;