import PageHeader from './PageHeader';
import StatsSection from './StatsSection';
import ShowRequester from './showRequester';


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
        { type: 'staff', text: 'Staff', data: '8', colorClass: 'text-[var(--color-text-purple)]' },
        { type: 'orders', text: 'Orders', data: '200', colorClass: 'text-[var(--color-text-stock)]' },
        { type: 'cancellations', text: 'Cancel', data: '23', colorClass: 'text-[var(--color-text-no-stock)]', className: 'justify-end' }
    ]}
/>
            <div className="content-body w-full h-auto">
                <ShowRequester onFilterClick={() => console.log('Filter button clicked')} />
                {children}  
                {/* ← here is the content to change from table to form */}
            </div>
        </main>
    );
}