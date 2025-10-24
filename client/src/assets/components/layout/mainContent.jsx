import PageHeader from './PageHeader';
import StatsSection from './StatsSection';

export default function MainContent({ 
    children, 
    showSection = true, 
    userName = "Jonathan",
    buttons = [],  // ← CAMBIO: Recibir array de botones
    onCloseDropdown
}) { 

    return (
        <main className="flex flex-col overflow-hidden w-[749px] h-full gap-[var(--marging-section-S)] px-[var(--marging-M)]
        pt-[var(--marging-section-M)]">
            {/* --------Header, waving and notifications--------- */}
            <PageHeader 
                userName={userName}
                buttons={buttons}  // ← CAMBIO: pasar buttons
                onCloseDropdown={onCloseDropdown}
            />

            {/* ----------------showing stats section----------------- */}
            <StatsSection 
                showSection={showSection}
                statsData={[
                    { type: 'staff', text: 'Staff', data: '8', colorClass: 'text-[var(--color-text-purple)]' },
                    { type: 'orders', text: 'Orders', data: '200', colorClass: 'text-[var(--color-text-stock)]' },
                    { type: 'cancellations', text: 'Cancel', data: '23', colorClass: 'text-[var(--color-text-no-stock)]', className: 'justify-end' }
                ]}
            />
            
            <div className="content-body w-full h-auto">
                {children}
            </div>
        </main>
    );
}