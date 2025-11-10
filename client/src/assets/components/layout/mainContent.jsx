import PageHeader from './PageHeader';
import StatsSection from './StatsSection';

export default function MainContent({ 
    children, 
    showSection = true, 
    showWaving = true,
    userName = "Jonathan",
    buttons = [],  // ← CAMBIO: Recibir array de botones
    onCloseDropdown,
    statsData
}) { 

    return (
        <main className="flex flex-col overflow-hidden w-[749px] h-full gap-[var(--marging-section-S)] px-[var(--marging-M)]
        pt-[var(--marging-section-M)]">
            {/* --------Header, waving and notifications--------- */}
            <PageHeader 
                userName={userName}
                buttons={buttons}  // ← CAMBIO: pasar buttons
                onCloseDropdown={onCloseDropdown}
                showWaving={showWaving}
            />

            {/* ----------------showing stats section----------------- */}
            <StatsSection 
                showSection={showSection}
                statsData={statsData}
            />
            
            <div className="content-body w-full h-auto">
                {children}
            </div>
        </main>
    );
}