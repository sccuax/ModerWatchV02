import PageHeader from './PageHeader';
import StatsSection from './StatsSection';


export default function MainContent({ children }) { 

    /* showStats = false,
    statsData = [], */
    // children  // ← Aquí va la parte variable (table, form, etc)
    return (
    <main className="flex flex-col w-[749px] h-full gap-[var(--marging-section-S)] px-[var(--marging-M)]
    pt-[var(--marging-section-M)]">
        {/* --------Header, waving and notifications--------- */}
            <PageHeader 
            userName="Jonathan" 
            messageCoun={3}
            notificationCount={2}
            />

            {/* ----------------showing stats section----------------- */}
            
            <StatsSection 
    statsData={[
        { type: 'staff', text: 'Staff', data: '8' },
        { type: 'orders', text: 'Orders', data: '200' },
        { type: 'cancellations', text: 'Cancel', data: '23' }
    ]}
/>
            <div className="content-body">
                {children}  {/* ← Aquí cambias table o form según la página */}
            </div>
        </main>
    );
}